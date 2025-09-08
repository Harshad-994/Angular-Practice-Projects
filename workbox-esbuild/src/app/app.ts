import { HttpClient } from '@angular/common/http';
import { Component, isDevMode, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('workbox-esbuild');
  task = signal('');
  todos = signal<string[]>([]);
  offlineMessage = signal('');
  isOnline = signal(true);

  constructor(private http: HttpClient) {
    this.loadTodos();
    this.requestPushSubscription();
    this.setClientStatus();
    if ('serviceWorker' in navigator && !isDevMode()) {
      navigator.serviceWorker
        .register('/service-worker.js') // Matches swDest in config
        .then((reg) => console.log('Workbox SW registered!', reg))
        .catch((err) => console.error('Registration failed', err));
    }
  }

  onAdd() {
    if (!this.isOnline()) {
      const pendingQueue: [string] = JSON.parse(
        localStorage.getItem('queue') ?? '[]'
      );
      pendingQueue.push(this.task());
      localStorage.setItem('queue', JSON.stringify(pendingQueue));
      this.task.set('');
      navigator.serviceWorker.ready.then((reg: any) => {
        if ('sync' in reg) {
          // Check if sync is available
          reg.sync
            .register('sync-todos')
            .then(() => console.log('Sync registered'))
            .catch(() => console.error('Sync registration failed'));
        }
      });
      return;
    }
    this.todos.set([...this.todos(), this.task()]);
    this.task.set('');
    this.offlineMessage.set('');
    localStorage.setItem('todos', JSON.stringify(this.todos()));
  }

  onClear() {
    this.task.set('');
  }

  loadTodos() {
    const storedTodods = JSON.parse(localStorage.getItem('todos') ?? '[]');
    // this.http
    //   .get<string[]>(
    //     'https://my-json-server.typicode.com/typicode/demo/comments'
    //   )
    //   .subscribe({
    //     next: (data) => this.todos.set(data.map((t: any) => t['body'])),
    //     error: () =>
    //       this.offlineMessage.set('Offline - showing the cached data!'),
    //   });
    this.todos.set(storedTodods);
  }

  requestPushSubscription() {
    if ('PushManager' in window) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey:
              'BLuBcvMYorMvqX2w7Q73rw4hc4N4hDufGwGh4eT6qUjwXzj467ROjrP6UjD2djB8VdvJjYIthS5lsYTAc2UBiwQ', // From generate-vapid-keys
          })
          .then((sub) => {
            console.log('Push subscribed!', sub);
            this.http
              .post('http://localhost:8000/api/subscribe', sub)
              .subscribe(); // Send to Node
          })
          .catch((err) => console.error('Subscription failed', err));
      });
    }

    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log(event);

      if (event.data.type === 'push-received') {
        this.loadTodos(); // Refresh UI on push
      }
    });
  }

  setClientStatus() {
    window.addEventListener('online', () => {
      this.isOnline.set(true);
      this.offlineMessage.set('');
    });

    window.addEventListener('offline', () => {
      this.isOnline.set(false);
      this.offlineMessage.set(
        'You are offline now! Serving from the catche or requests will be sync later on.'
      );
    });
  }
}

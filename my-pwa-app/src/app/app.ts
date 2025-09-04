import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('my-pwa-app');
  task = signal('');
  todos = signal<string[]>([]);
  offlineMessage = signal('');

  constructor(
    private http: HttpClient,
    private swPush: SwPush,
    private destroy: DestroyRef,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loadTodos();
    this.requestPushSubscription();
    window.addEventListener('online', () => {
      console.log('Online - Triggering sync');
      this.offlineMessage.set('');
      this.loadTodos(); // Custom function to retry queued to-dos
    });

    window.addEventListener('offline', () => {
      console.log('Offline - Queue mode activated');
      this.offlineMessage.set('Offline - Changes will sync later');
    });
  }

  onAdd() {
    this.todos.set([...this.todos(), this.task()]);
    this.task.set('');
    this.offlineMessage.set('');
  }

  onClear() {
    this.task.set('');
  }

  loadTodos() {
    this.http
      .get<string[]>(
        'https://my-json-server.typicode.com/typicode/demo/comments'
      )
      .subscribe({
        next: (data) => this.todos.set(data.map((t: any) => t['body'])),
        error: () =>
          this.offlineMessage.set('Offline - showing the cached data!'),
      });
  }

  requestPushSubscription() {
    if (!this.swPush.isEnabled) {
      console.log('SwPush is not supported!');
      return;
    }
    this.swPush
      .requestSubscription({
        serverPublicKey:
          'BH9T5TwnqyHPlvLQL9pLt5fS4eR7BDTO_XuX9OgmfLyZ7vdFw2EN6PEcV_zmYY1V95v7cgSfD95o-eV1fNZfc5M',
      })
      .then((sub) => {
        console.log('Subscribed to the push : ', sub);
        this.http.post('http://localhost:8000/api/subscribe', sub).subscribe();
      })
      .catch((err) => console.log(err));
    const sub = this.swPush.messages.subscribe((msg: any) => {
      console.log('Push message received : ', msg);
      // new Notification(msg.notification?.title || 'New TO-DO Alert', {
      //   body: msg.body,
      //   icon: msg.icon,
      //   requireInteraction: true,
      // });
      this.loadTodos();
    });
    this.swPush.notificationClicks.subscribe((e) => {
      console.log(e);
      if (e.action == 'view') {
        this.router.navigate(['/hello']);
        console.log('clicked on the banner');
      } else if (e.action == 'dismiss') {
        console.log('banner dismissed');
      }
    });
    this.destroy.onDestroy(() => sub.unsubscribe());
    this.swPush.notificationClicks.subscribe((event) => {
      if (event.action == 'open') {
        window.open('/');
      }
    });
  }
}

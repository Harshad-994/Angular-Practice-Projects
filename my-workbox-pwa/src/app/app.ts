import { HttpClient } from '@angular/common/http';
import { Component, isDevMode, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('my-workbox-pwa');
  task = signal('');
  todos = signal<string[]>([]);
  offlineMessage = signal('');

  constructor(private http: HttpClient) {
    this.loadTodos();
    if ('serviceWorker' in navigator && !isDevMode()) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => console.log('Workbox sw registerd!', reg))
        .catch((err) => console.log('Registration failed', err));
    }
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
}

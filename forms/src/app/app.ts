import { Component, signal } from '@angular/core';
import { LoginReactive } from './login-reactive/login-reactive';

@Component({
  selector: 'app-root',
  imports: [LoginReactive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('forms');
}

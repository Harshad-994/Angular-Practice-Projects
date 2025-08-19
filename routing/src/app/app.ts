import { Component, signal } from '@angular/core';
import { UsersComponent } from './users/users';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [UsersComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('routing');
}

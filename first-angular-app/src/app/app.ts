import { Component, Output, signal } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { User } from './user/user';
import DUMMY_USERS from './dummy-user';
import { Tasks } from './tasks/tasks';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, User, Tasks],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('first-angular-app');
  @Output() selectedUser?: string;
  users = DUMMY_USERS;

  get getSelectedUser() {
    return DUMMY_USERS.find((u) => u.id === this.selectedUser);
  }

  onSelectUser(id: string) {
    console.log(`id is ${id}`);
    this.selectedUser = id;
  }
}

import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { type UserType } from './user.model';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  @Input({ required: true }) user!: UserType;
  @Output() select = new EventEmitter<string>();
  @Input({ required: true }) selected!: boolean;
  // select = output<string>();

  // name = input.required<string>();
  // selectedUser = signal(DUMMY_USERS[randomUser]);

  // getImagePath = computed(() => `users/${this.selectedUser().avatar}`);

  public get getImagePath(): string {
    return 'users/' + this.user.avatar;
  }

  onSelectUser(): void {
    // const randomUser = Math.floor(Math.random() * DUMMY_USERS.length);
    // this.selectedUser.set(DUMMY_USERS[randomUser]);
    this.select.emit(this.user.id);
  }
}

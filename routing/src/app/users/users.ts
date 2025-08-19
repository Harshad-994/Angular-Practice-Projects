import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class UsersComponent {
  users = [
    { userId: '1', firstName: 'John', lastName: 'Doe' },
    { userId: '2', firstName: 'Jane', lastName: 'Smith' },
    { userId: '3', firstName: 'Alice', lastName: 'Johnson' },
    { userId: '4', firstName: 'Bob', lastName: 'Brown' },
    { userId: '5', firstName: 'Charlie', lastName: 'Davis' },
  ];
}

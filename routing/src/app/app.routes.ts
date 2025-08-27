import { Routes } from '@angular/router';
import { userNameResolver } from './tasks/tasks';
import { NoTaskComponent } from './no-task/no-task';
import { NotFoundComponent } from './not-found/not-found';
import { UsersComponent } from './users/users';

export const routes: Routes = [
  {
    path: '',
    component: NoTaskComponent,
    title: 'No user selected',
  },
  {
    path: 'users',
    component: UsersComponent,
    title: 'User List',
  },
  {
    path: 'tasks/:userId',
    loadComponent: () =>
      import('./tasks/tasks').then((mod) => mod.TasksComponent),
    title: 'User tasks',
    data: {
      message: 'hello',
    },
    resolve: {
      username: userNameResolver,
    },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./tasks/new-task/new-task').then(
            (mod) => mod.NewTaskComponent
          ),
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

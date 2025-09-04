import { Routes } from '@angular/router';
import { HelloComponent } from './hello-component/hello-component';

export const routes: Routes = [
  {
    path: 'hello',
    component: HelloComponent,
    title: 'Hello',
  },
];

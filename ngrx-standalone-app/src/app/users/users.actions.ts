import { createActionGroup, props } from '@ngrx/store';
import { User } from './user.model';

export const UserActions = createActionGroup({
  source: 'Users',
  events: {
    'Add User': props<{ user: User }>(),
    'Remove User': props<{ id: string }>(),
  },
});

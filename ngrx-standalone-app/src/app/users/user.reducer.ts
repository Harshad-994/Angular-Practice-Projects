import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { User } from './user.model';
import { UserActions } from './users.actions';

export interface UserState extends EntityState<User> {}

export const userAdapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: UserState = userAdapter.getInitialState();

export const userReducer = createReducer(
  initialState,
  on(UserActions.addUser, (state, { user }) => userAdapter.addOne(user, state)),
  on(UserActions.removeUser, (state, { id }) =>
    userAdapter.removeOne(id, state)
  )
);

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { userAdapter, UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('users');

const { selectAll, selectTotal, selectEntities } = userAdapter.getSelectors();

export const selectAllUsers = createSelector(selectUserState, selectAll);

export const totalUsers = createSelector(selectUserState, selectTotal);

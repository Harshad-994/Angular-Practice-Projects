import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CounterActions } from './counter.actions';
import { tap } from 'rxjs';

@Injectable()
export class CounterEffects {
  private actions$ = inject(Actions);
  logActions$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CounterActions.increment,
          CounterActions.decrement,
          CounterActions.reset
        ),
        tap((action) => console.log(action))
      ),
    { dispatch: false }
  );
}

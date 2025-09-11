import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodoApiService } from '../data-access/todo-api.service';
import { TodoApiActions, TodosPageActions } from './todos.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class TodoEffects {
  private actions$ = inject(Actions);
  private todoService = inject(TodoApiService);

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosPageActions.init),
      switchMap(() =>
        this.todoService.getTodos().pipe(
          map((todos) => TodoApiActions.loadTodoSuccess({ todos })),
          catchError((error) =>
            of(TodoApiActions.loadTodoFail({ error: error.message }))
          )
        )
      )
    )
  );
}

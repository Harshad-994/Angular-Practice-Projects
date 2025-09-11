import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Todo } from './todo.model';

export const TodosPageActions = createActionGroup({
  source: 'TODO PAGE',
  events: {
    init: emptyProps(),
    addTodo: props<{ todo: Todo }>(),
    toggleComplete: props<{ id: string }>(),
    removeTodo: props<{ id: string }>(),
  },
});

export const TodoApiActions = createActionGroup({
  source: 'TODO API',
  events: {
    loadTodoSuccess: props<{ todos: Todo[] }>(),
    loadTodoFail: props<{ error: string }>(),
  },
});

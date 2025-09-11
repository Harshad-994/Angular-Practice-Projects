import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Todo } from './todo.model';
import { TodoApiActions, TodosPageActions } from './todos.actions';

export interface TodosState extends EntityState<Todo> {
  isLoading: boolean;
  error: string | null;
}
export const adapter: EntityAdapter<Todo> = createEntityAdapter<Todo>();

export const initialState: TodosState = adapter.getInitialState({
  isLoading: false,
  error: null,
});

export const todosFeature = createFeature({
  name: 'todos',
  reducer: createReducer(
    initialState,
    on(TodosPageActions.init, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(TodosPageActions.addTodo, (state, { todo }) =>
      adapter.addOne(todo, state)
    ),
    on(TodosPageActions.removeTodo, (state, { id }) =>
      adapter.removeOne(id, state)
    ),
    on(TodosPageActions.toggleComplete, (state, { id }) => {
      const todo = state.entities[id];
      if (!todo) return state;
      return adapter.updateOne(
        {
          id,
          changes: { isCompleted: !todo.isCompleted },
        },
        state
      );
    }),

    on(TodoApiActions.loadTodoSuccess, (state, { todos }) =>
      adapter.setAll(todos, { ...state, isLoading: false })
    ),
    on(TodoApiActions.loadTodoFail, (state, { error }) => {
      return { ...state, error, isLoading: false };
    })
  ),

  extraSelectors: ({ selectTodosState }) => {
    const { selectAll } = adapter.getSelectors();
    const selectAllTodos = createSelector(selectTodosState, selectAll);
    const selectIsLoading = createSelector(
      selectTodosState,
      (state) => state.isLoading
    );
    const selectError = createSelector(
      selectTodosState,
      (state) => state.error
    );
    return { selectAllTodos, selectIsLoading, selectError };
  },
});

export const { name, reducer, selectAllTodos, selectIsLoading, selectError } =
  todosFeature;

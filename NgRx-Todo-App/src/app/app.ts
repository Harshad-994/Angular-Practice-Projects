import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAllTodos,
  selectError,
  selectIsLoading,
} from './todos/todos.feature';
import { Todo } from './todos/todo.model';
import { TodoApiActions, TodosPageActions } from './todos/todos.actions';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('NgRx-Todo-App');
  private store = inject(Store);
  todos$ = this.store.select(selectAllTodos);
  isLoading$ = this.store.select(selectIsLoading);
  error$ = this.store.select(selectError);

  ngOnInit() {
    this.store.dispatch(TodosPageActions.init());
  }

  onAddTodo(title: string, description: string) {
    const todo: Todo = {
      id: Date.now().toString(),
      isCompleted: false,
      title,
      description,
    };
    this.store.dispatch(TodosPageActions.addTodo({ todo }));
  }

  onToggle(id: string) {
    this.store.dispatch(TodosPageActions.toggleComplete({ id }));
  }

  onRemove(id: string) {
    this.store.dispatch(TodosPageActions.removeTodo({ id }));
  }
}

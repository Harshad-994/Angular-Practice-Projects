import { delay, Observable, of, throwError } from 'rxjs';
import { Todo } from '../todos/todo.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TodoApiService {
  private mockTodos: Todo[] = [
    {
      id: '1',
      title: 'read',
      description: 'Read a book for 10 minutes.',
      isCompleted: false,
    },
    {
      id: '2',
      title: 'exercise',
      description: 'Do a 15-minute workout.',
      isCompleted: false,
    },
    {
      id: '3',
      title: 'meditate',
      description: 'Meditate for 5 minutes.',
      isCompleted: false,
    },
  ];

  getTodos(): Observable<Todo[]> {
    console.log('API: Fetching todos...');
    // return throwError(() => new Error('Failed to load todos from API : ')).pipe(
    //   delay(400)
    // );
    return of(this.mockTodos).pipe(delay(800));
  }
}

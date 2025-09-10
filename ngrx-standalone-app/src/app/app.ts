import { Component, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCount } from './counter/counter.selectors';
import { AsyncPipe } from '@angular/common';
import { CounterActions } from './counter/counter.actions';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
  count$;
  constructor(private store: Store) {
    this.count$ = this.store.select(selectCount);
  }

  protected readonly title = signal('ngrx-standalone-app');

  increment() {
    this.store.dispatch(CounterActions.increment());
  }

  decrement() {
    this.store.dispatch(CounterActions.decrement());
  }

  reset() {
    this.store.dispatch(CounterActions.reset());
  }
}

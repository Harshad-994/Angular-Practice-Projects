import { createActionGroup, emptyProps } from '@ngrx/store';

export const CounterActions = createActionGroup({
  source: 'Counter',
  events: {
    Increment: emptyProps(),
    Decrement: emptyProps(),
    Reset: emptyProps(),
  },
});

import { Component, inject, signal } from '@angular/core';
import { SafeLinkDirective } from './safe-link.directive';
import { FormsModule } from '@angular/forms';
import { StructuralDirective } from './structural.directive';
import { LogDirective } from './log.directive';
import { CustomPipe } from './custom-pipe';
import { loggingToken } from './app.config';
import {
  LUCKY_NUMBERS_TOKEN,
  luckyNumbersProvider,
} from './lucky-numbers-array';
import { Link } from './link/link';
import { ManualChangeDetection } from './manual-change-detection/manual-change-detection';
import {
  BehaviorSubject,
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  from,
  interval,
  map,
  mergeWith,
  of,
  take,
  tap,
  timer,
  zipWith,
} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [
    SafeLinkDirective,
    FormsModule,
    StructuralDirective,
    CustomPipe,
    Link,
    ManualChangeDetection,
  ],
  hostDirectives: [LogDirective],
  providers: [luckyNumbersProvider],
})
export class App {
  protected readonly title = signal('directives');
  private loggingService = inject(loggingToken);
  luckyNumbers = inject(LUCKY_NUMBERS_TOKEN);
  inputNumber = signal(0);
  tempStr = 'hElLo';
  users$ = from([
    { firstname: 'John', lastname: 'Doe', age: 25 },
    { firstname: 'Jane', lastname: 'Smith', age: 30 },
    { firstname: 'Alice', lastname: 'Johnson', age: 22 },
    { firstname: 'Bob', lastname: 'Brown', age: 28 },
  ]);
  quantity$ = new BehaviorSubject<number>(4);
  price$ = new BehaviorSubject<number>(99);
  total$ = this.quantity$.pipe(
    combineLatestWith(this.price$),
    map(([quantity, price]) => price * quantity)
  );
  user$ = timer(1000).pipe(map(() => ({ id: 1, name: 'johndoe' })));
  post$ = timer(3000).pipe(map(() => ({ id: 1, name: 'post' })));
  forkjoinObs = forkJoin([this.user$, this.post$]).pipe(
    map(([user, post]) => ({ user, post }))
  );
  fast$ = interval(800).pipe(take(2));
  slow$ = interval(2000).pipe(take(4));

  constructor() {
    this.users$
      .pipe(
        distinctUntilChanged(),
        tap((val) => console.log(`started processing ${val.firstname}`)),
        filter((val) => val.age < 30),
        map((val) => `${val.firstname} ${val.lastname}`)
      )
      .subscribe((val) => console.log(val));
    this.total$.subscribe((val) => console.log(`Total is : ${val}`));
    this.forkjoinObs.subscribe((val) => console.log(val));
    this.fast$
      .pipe(
        zipWith(this.slow$),
        map(
          ([fastValue, slowValue]) => `Fast: ${fastValue}, Slow: ${slowValue}`
        )
      )
      .subscribe(console.log);
    this.fast$.pipe(mergeWith(this.slow$)).subscribe(console.log);
  }

  onClick(site: string) {
    console.log(site);
    this.loggingService.logMessage('clicked on the link!');
    this.quantity$.next(2);
    this.price$.next(100);
  }

  onSubmit(num: number) {
    this.inputNumber.set(num);
    console.log('sumbitted!', this.inputNumber());
  }
}

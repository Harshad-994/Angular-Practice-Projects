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
import { filter, from, map, of, tap } from 'rxjs';

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

  constructor() {
    this.users$
      .pipe(
        tap((val) => console.log(`started processing ${val.firstname}`)),
        filter((val) => val.age < 30),
        map((val) => `${val.firstname} ${val.lastname}`)
      )
      .subscribe((val) => console.log(val));
  }

  onClick(site: string) {
    console.log(site);
    this.loggingService.logMessage('clicked on the link!');
  }

  onSubmit(num: number) {
    this.inputNumber.set(num);
    console.log('sumbitted!', this.inputNumber());
  }
}

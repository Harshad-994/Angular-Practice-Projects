import { Component, inject, input, signal } from '@angular/core';
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

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [SafeLinkDirective, FormsModule, StructuralDirective, CustomPipe],
  hostDirectives: [LogDirective],
  providers: [luckyNumbersProvider],
})
export class App {
  protected readonly title = signal('directives');
  private loggingService = inject(loggingToken);
  luckyNumbers = inject(LUCKY_NUMBERS_TOKEN);
  inputNumber = signal(0);
  tempStr = 'hElLo';

  onClick(site: string) {
    console.log(site);
    this.loggingService.logMessage('clicked on the link!');
  }

  onSubmit(num: number) {
    this.inputNumber.set(num);
    console.log('sumbitted!', this.inputNumber());
  }
}

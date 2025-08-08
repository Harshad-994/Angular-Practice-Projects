import { Component, input, signal } from '@angular/core';
import { SafeLinkDirective } from './safe-link.directive';
import { FormsModule } from '@angular/forms';
import { StructuralDirective } from './structural.directive';
import { LogDirective } from './log.directive';
import { CustomPipe } from './custom-pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [SafeLinkDirective, FormsModule, StructuralDirective, CustomPipe],
  hostDirectives: [LogDirective],
})
export class App {
  protected readonly title = signal('directives');
  inputNumber = signal(0);
  tempStr = 'hElLo';

  onClick(site: number) {
    console.log(site);
  }

  onSubmit(num: number) {
    this.inputNumber.set(num);
    console.log('sumbitted!', this.inputNumber());
  }
}

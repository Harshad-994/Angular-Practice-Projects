import { Component, signal } from '@angular/core';
import { HeaderComponent } from './header/header';
import { InterestCalculatorComponent } from './calculator/interest-calculator';
import { InterestEntriesComponent } from './entries/interest-entries';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    InterestCalculatorComponent,
    InterestEntriesComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class AppComponent {
  protected readonly title = signal('interest-calculator');
}

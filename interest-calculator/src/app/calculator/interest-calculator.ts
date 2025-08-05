import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { type InputEntryData } from '../core/models/input-entry-data.model';
import { EntryService } from '../core/services/entry-service';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './interest-calculator.html',
  styleUrl: './interest-calculator.css',
})
export class InterestCalculatorComponent {
  inputAmount = signal(0);
  inputRate = signal(0);
  inputTime = signal(0);
  entryService = inject(EntryService);

  onSubmit() {
    const inputData: InputEntryData = {
      amount: this.inputAmount(),
      rate: this.inputRate(),
      time: this.inputTime(),
    };
    this.entryService.addEntry(inputData);
  }
}

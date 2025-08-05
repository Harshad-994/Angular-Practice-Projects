import { Component, inject } from '@angular/core';
import { EntryService } from '../core/services/entry-service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-entries',
  imports: [CurrencyPipe],
  standalone: true,
  templateUrl: './interest-entries.html',
  styleUrl: './interest-entries.css',
})
export class InterestEntriesComponent {
  entryService = inject(EntryService);

  get allEntries() {
    return this.entryService.getAllEntries();
  }

  onDelete(id: string) {
    this.entryService.removeEntry(id);
  }
}

import { computed, Injectable, signal } from '@angular/core';
import { type Entry } from '../models/entry.model';
import { type InputEntryData } from '../models/input-entry-data.model';

@Injectable({ providedIn: 'root' })
export class EntryService {
  private entries = signal<Entry[]>([
    {
      id: '1',
      amount: 1000,
      rate: 5,
      time: 2,
      interest: 100,
    },
    {
      id: '2',
      amount: 2000,
      rate: 4,
      time: 3,
      interest: 240,
    },
    {
      id: '3',
      amount: 1500,
      rate: 6,
      time: 1,
      interest: 90,
    },
  ]);

  calculateInterest(entryData: InputEntryData) {
    return (entryData.amount * entryData.rate * entryData.time) / 100;
  }

  addEntry(entryData: InputEntryData) {
    const interest = this.calculateInterest(entryData);
    const entry: Entry = {
      id: `${Date.now()}`,
      amount: entryData.amount,
      rate: entryData.rate,
      time: entryData.time,
      interest,
    };
    this.entries().push(entry);
    this.entries.set(this.entries());
  }

  removeEntry(id: string) {
    this.entries.set(this.entries().filter((entry) => entry.id != id));
  }

  getAllEntries() {
    return this.entries.asReadonly()();
  }
}

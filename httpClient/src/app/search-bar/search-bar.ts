import { Component, Output, EventEmitter, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBarComponent {
  searchTerm = signal('');

  search = output<string>();

  onSearch(): void {
    if (this.searchTerm().trim()) {
      this.search.emit(this.searchTerm().trim());
    }
  }
}

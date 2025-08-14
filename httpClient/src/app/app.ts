import { Component, signal } from '@angular/core';
import { SearchBarComponent } from './search-bar/search-bar';
import { BookListComponent } from './book-list/book-list';

@Component({
  selector: 'app-root',
  imports: [SearchBarComponent, BookListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('httpClient');
  searchText = signal('');

  onSearchText(searchText: string) {
    this.searchText.set(searchText);
  }
}

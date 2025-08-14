import { HttpClient } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { APIResponse, Book } from './book-model';
import { BookComponent } from './book/book';

@Component({
  selector: 'app-book-list',
  imports: [BookComponent],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookListComponent implements OnInit {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private books = signal<Book[]>([]);
  isFetching = signal(false);
  error = signal('');
  searchText = input.required<string>();

  constructor() {
    effect(() => {
      this.isFetching.set(true);
      const reqSubscription = this.httpClient
        .get<APIResponse>(
          `https://openlibrary.org/search.json?q=${this.searchText()}&lan=en`
        )
        .pipe(
          map((val) => val.docs),
          catchError((error) =>
            throwError(() => new Error('something went wrong...'))
          )
        )
        .subscribe({
          next: (res) => {
            const temp: Book[] = res.map((book) => {
              return {
                id: book.key,
                name: book.title,
                author: book.author_name?.join(' '),
                cover: book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                  : undefined,
              };
            });
            this.books.set(temp);
          },
          error: (err: Error) => {
            this.error.set(err.message);
          },
          complete: () => {
            this.isFetching.set(false);
          },
        });
      this.destroyRef.onDestroy(() => reqSubscription.unsubscribe());
    });
  }

  ngOnInit(): void {}

  get allBooks() {
    return this.books.asReadonly()();
  }
}

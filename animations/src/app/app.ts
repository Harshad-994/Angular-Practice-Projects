import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('animations');
  isVisible = signal(false);
  isOpen = signal(true);
  show = signal(true);
  items: number[] = [1, 2, 3, 4, 5];

  toggle() {
    this.isVisible.set(!this.isVisible());
  }

  toggleIsOpen() {
    this.isOpen.set(!this.isOpen());
  }

  toggleShow() {
    this.show.set(false);
    setTimeout(() => {
      this.show.set(true);
    }, 1);
  }
}

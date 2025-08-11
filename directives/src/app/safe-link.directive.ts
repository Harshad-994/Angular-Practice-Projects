import {
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { LogDirective } from './log.directive';

@Directive({
  selector: 'a[appSafeLink]',
  standalone: true,
  host: {
    '(click)': 'showConfirmation($event)',
  },
  hostDirectives: [LogDirective],
})
export class SafeLinkDirective {
  appSafeLink = input('myapp');
  private hostElement = inject<ElementRef<HTMLAnchorElement>>(ElementRef);
  constructor() {}

  showConfirmation(event: MouseEvent) {
    if (confirm('do you really want to visit that web page?')) {
      this.hostElement.nativeElement.href =
        this.hostElement.nativeElement.href + `?from=${this.appSafeLink()}`;
      return;
    }

    event.preventDefault();
  }
}

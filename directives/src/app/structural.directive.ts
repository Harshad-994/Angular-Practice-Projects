import {
  Directive,
  effect,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[showNumber]',
  standalone: true,
})
export class StructuralDirective {
  currentNumber = input.required<string>({ alias: 'showNumber' });
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  guessingNumber?: string;
  constructor() {
    this.generateRanNumber();
    effect(() => {
      if (this.currentNumber() === this.guessingNumber) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
        this.generateRanNumber();
      } else {
        this.viewContainerRef.clear();
      }
      console.log(this.guessingNumber);
    });
  }

  generateRanNumber() {
    this.guessingNumber = `${Math.floor(Math.random() * 10 + 1)}`;
  }
}

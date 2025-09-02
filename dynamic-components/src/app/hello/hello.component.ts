import { NgTemplateOutlet } from '@angular/common';
import { Component, input, output, signal, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-hello',
  imports: [NgTemplateOutlet],
  templateUrl: './hello.component.html',
  styleUrl: './hello.component.css',
})
export class HelloComponent {
  name = input.required<string>();
  // name = signal('');
  log = output<string>();
  content = input.required<TemplateRef<any>>();
  // name = '';

  ngOnInit() {
    this.log.emit('this is new component');
  }
}

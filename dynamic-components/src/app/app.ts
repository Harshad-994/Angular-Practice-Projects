import {
  ChangeDetectorRef,
  Component,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { HelloComponent } from './hello/hello.component';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('dynamic-components');
  dynamicComp = HelloComponent;
  // @ViewChild('projected', { static: true })
  // projectedContent!: TemplateRef<any>;
  show = signal(false);

  constructor(private cdr: ChangeDetectorRef) {}

  // @ViewChild('container', { read: ViewContainerRef, static: false })
  // container!: ViewContainerRef;

  container = viewChild('container', { read: ViewContainerRef });
  projectedContent = viewChild<TemplateRef<any>>('projectedContent');

  toggleShow() {
    this.show.set(true);
    this.cdr.detectChanges();
    this.container()?.clear();
    const compRef = this.container()?.createComponent(this.dynamicComp);
    compRef?.setInput('content', this.projectedContent());
    compRef?.setInput('name', 'World');
    compRef?.instance.log.subscribe((str) => {
      console.log(str);
    });
  }
}

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Import all lesson components (we'll create these)
import { ObservablesLessonComponent } from './lessons/observables-lesson/observables-lesson.component';
import { BasicOperatorsLessonComponent } from './lessons/basic-operators-lesson/basic-operators-lesson.component';
import { CreationOperatorsLessonComponent } from './lessons/creation-operators-lesson/creation-operators-lesson.component';
import { PipingLessonComponent } from './lessons/piping-lesson/piping-lesson.component';
import { TransformationLessonComponent } from './lessons/transformation-lesson/transformation-lesson.component';
import { FilteringLessonComponent } from './lessons/filtering-lesson/filtering-lesson.component';
import { CombinationLessonComponent } from './lessons/combination-lesson/combination-lesson.component';
import { ErrorHandlingLessonComponent } from './lessons/error-handling-lesson/error-handling-lesson.component';
import { SubjectsLessonComponent } from './lessons/subjects-lesson/subjects-lesson.component';
import { MulticastingLessonComponent } from './lessons/multicasting-lesson/multicasting-lesson.component';
import { HigherOrderLessonComponent } from './lessons/higher-order-lesson/higher-order-lesson.component';
import { CustomOperatorsLessonComponent } from './lessons/custom-operators-lesson/custom-operators-lesson.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ObservablesLessonComponent,
    BasicOperatorsLessonComponent,
    CreationOperatorsLessonComponent,
    PipingLessonComponent,
    TransformationLessonComponent,
    FilteringLessonComponent,
    CombinationLessonComponent,
    ErrorHandlingLessonComponent,
    SubjectsLessonComponent,
    MulticastingLessonComponent,
    HigherOrderLessonComponent,
    CustomOperatorsLessonComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('rxjs-learning-app');
  protected readonly currentTopic = signal<string>('');

  setCurrentTopic(topic: string) {
    this.currentTopic.set(topic);
    console.log(`🎯 Switched to topic: ${topic}`);
  }
}

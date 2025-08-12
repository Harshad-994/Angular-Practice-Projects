import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subjects-lesson',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lesson-container">
      <div class="lesson-header">
        <h1>📡 Subjects</h1>
        <p class="lesson-subtitle">Phase 3: Advanced - BehaviorSubject, ReplaySubject</p>
      </div>
      <div class="coming-soon">
        <h2>🚧 Coming Soon!</h2>
        <p>This lesson will cover <code>Subject</code>, <code>BehaviorSubject</code>, <code>ReplaySubject</code>, and <code>AsyncSubject</code>.</p>
      </div>
    </div>
  `,
  styles: [`
    @import '../lesson-base.css';
    .coming-soon {
      text-align: center;
      padding: 3rem;
      background: #fef5e7;
      border-radius: 8px;
      border: 2px dashed #ed8936;
    }
    .coming-soon code {
      background: rgba(0,0,0,0.1);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }
  `]
})
export class SubjectsLessonComponent {
  constructor() {
    console.log('📚 THEORY: Subjects - Subject, BehaviorSubject, ReplaySubject, AsyncSubject');
  }
}
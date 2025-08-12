import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-operators-lesson',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lesson-container">
      <div class="lesson-header">
        <h1>🛠️ Custom Operators</h1>
        <p class="lesson-subtitle">Phase 3: Advanced - Build Your Own Operators</p>
      </div>
      <div class="coming-soon">
        <h2>🚧 Coming Soon!</h2>
        <p>This lesson will teach you how to create custom operators and reusable operator functions.</p>
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
  `]
})
export class CustomOperatorsLessonComponent {
  constructor() {
    console.log('📚 THEORY: Custom Operators - Creating reusable operator functions');
  }
}
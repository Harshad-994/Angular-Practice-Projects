import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-higher-order-lesson',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lesson-container">
      <div class="lesson-header">
        <h1>🔀 Higher-order Operators</h1>
        <p class="lesson-subtitle">Phase 3: Advanced - Complex Scenarios</p>
      </div>
      <div class="coming-soon">
        <h2>🚧 Coming Soon!</h2>
        <p>This lesson will cover advanced operators like <code>exhaustMap</code>, <code>switchScan</code>, and complex operator combinations.</p>
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
export class HigherOrderLessonComponent {
  constructor() {
    console.log('📚 THEORY: Higher-order Operators - exhaustMap, switchScan, complex combinations');
  }
}
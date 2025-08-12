import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, of, from, interval } from 'rxjs';
import { map, filter, tap, take } from 'rxjs/operators';

@Component({
  selector: 'app-basic-operators-lesson',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basic-operators-lesson.component.html',
  styleUrls: ['./basic-operators-lesson.component.css']
})
export class BasicOperatorsLessonComponent implements OnInit, OnDestroy {
  // Signals for reactive UI updates
  protected readonly mapOutput = signal<string[]>([]);
  protected readonly filterOutput = signal<string[]>([]);
  protected readonly tapOutput = signal<string[]>([]);
  protected readonly chainedOutput = signal<string[]>([]);

  // Subscription management
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    console.log('🎓 Welcome to Basic Operators Lesson!');
    this.logTheory();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('🧹 All subscriptions cleaned up');
  }

  private logTheory() {
    console.log(`
📚 THEORY: Basic Operators (map, filter, tap)

🔍 What are Operators?
- Operators are functions that transform Observables
- They take an Observable as input and return a new Observable
- Operators are pure functions - they don't modify the original Observable
- They are used with the .pipe() method

🔍 The Three Essential Operators:

1. MAP - Transform each emitted value
   - Takes each value and transforms it using a function
   - Like Array.map() but for Observables
   - Example: map(x => x * 2)

2. FILTER - Only emit values that pass a test
   - Takes each value and tests it with a predicate function
   - Only emits values where the predicate returns true
   - Like Array.filter() but for Observables
   - Example: filter(x => x > 10)

3. TAP - Perform side effects without changing the stream
   - Used for debugging, logging, or side effects
   - Does not transform the values
   - The stream continues unchanged
   - Example: tap(x => console.log(x))

🔍 Piping:
- Use .pipe() to chain multiple operators
- Operators are applied from left to right
- Each operator receives the output of the previous one
    `);
  }

  // Example 1: Map Operator
  runMapExample() {
    console.log('\n🚀 Example 1: Map Operator - Transform Values');
    
    this.mapOutput.set([]);
    
    // Create source Observable
    const numbers$ = of(1, 2, 3, 4, 5);
    
    // Transform each number by multiplying by 2
    const doubled$ = numbers$.pipe(
      map(x => x * 2)
    );
    
    const subscription = doubled$.subscribe({
      next: (value) => {
        console.log(`🔢 Original → Doubled: ${value/2} → ${value}`);
        this.mapOutput.update(output => [...output, `${value/2} → ${value}`]);
      },
      complete: () => {
        console.log('✅ Map example completed');
        this.mapOutput.update(output => [...output, 'Completed']);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 2: Filter Operator
  runFilterExample() {
    console.log('\n🚀 Example 2: Filter Operator - Select Values');
    
    this.filterOutput.set([]);
    
    // Create source Observable with mixed numbers
    const numbers$ = of(1, 5, 10, 15, 3, 20, 8, 25);
    
    // Filter only numbers greater than 10
    const filtered$ = numbers$.pipe(
      filter(x => x > 10)
    );
    
    const subscription = filtered$.subscribe({
      next: (value) => {
        console.log(`✅ Passed filter (> 10): ${value}`);
        this.filterOutput.update(output => [...output, `${value} (passed)`]);
      },
      complete: () => {
        console.log('✅ Filter example completed');
        this.filterOutput.update(output => [...output, 'Completed']);
      }
    });

    // Also log the original values for comparison
    numbers$.subscribe(value => {
      if (value <= 10) {
        console.log(`❌ Filtered out (≤ 10): ${value}`);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 3: Tap Operator
  runTapExample() {
    console.log('\n🚀 Example 3: Tap Operator - Side Effects');
    
    this.tapOutput.set([]);
    
    // Create source Observable
    const fruits$ = of('apple', 'banana', 'cherry', 'date');
    
    // Use tap for logging and side effects
    const processed$ = fruits$.pipe(
      tap(fruit => {
        console.log(`🍎 Processing: ${fruit}`);
        this.tapOutput.update(output => [...output, `Processing: ${fruit}`]);
      }),
      map(fruit => fruit.toUpperCase()),
      tap(fruit => {
        console.log(`📝 Transformed: ${fruit}`);
        this.tapOutput.update(output => [...output, `Transformed: ${fruit}`]);
      })
    );
    
    const subscription = processed$.subscribe({
      next: (value) => {
        console.log(`🎯 Final result: ${value}`);
        this.tapOutput.update(output => [...output, `Final: ${value}`]);
      },
      complete: () => {
        console.log('✅ Tap example completed');
        this.tapOutput.update(output => [...output, 'Completed']);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 4: Chaining Operators
  runChainedExample() {
    console.log('\n🚀 Example 4: Chaining Multiple Operators');
    
    this.chainedOutput.set([]);
    
    // Create source Observable with numbers
    const numbers$ = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    
    // Chain multiple operators together
    const processed$ = numbers$.pipe(
      tap(x => {
        console.log(`🔍 Original value: ${x}`);
        this.chainedOutput.update(output => [...output, `Original: ${x}`]);
      }),
      filter(x => x % 2 === 0), // Keep only even numbers
      tap(x => {
        console.log(`✅ After filter (even): ${x}`);
        this.chainedOutput.update(output => [...output, `After filter: ${x}`]);
      }),
      map(x => x * x), // Square the numbers
      tap(x => {
        console.log(`🔢 After map (squared): ${x}`);
        this.chainedOutput.update(output => [...output, `After map: ${x}`]);
      }),
      filter(x => x > 10), // Keep only squares greater than 10
      tap(x => {
        console.log(`🎯 Final value: ${x}`);
        this.chainedOutput.update(output => [...output, `Final: ${x}`]);
      })
    );
    
    const subscription = processed$.subscribe({
      next: (value) => {
        console.log(`📤 Emitted: ${value}`);
      },
      complete: () => {
        console.log('✅ Chained operators example completed');
        this.chainedOutput.update(output => [...output, 'Completed']);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 5: Real-world scenario - Processing user data
  runRealWorldExample() {
    console.log('\n🚀 Example 5: Real-world Scenario - User Data Processing');
    
    // Simulate user data
    const users = [
      { id: 1, name: 'Alice', age: 25, active: true },
      { id: 2, name: 'Bob', age: 17, active: false },
      { id: 3, name: 'Charlie', age: 30, active: true },
      { id: 4, name: 'Diana', age: 16, active: true },
      { id: 5, name: 'Eve', age: 28, active: false }
    ];
    
    const users$ = from(users);
    
    // Process users: filter active adults, transform to display format
    const processedUsers$ = users$.pipe(
      tap(user => console.log(`👤 Processing user: ${user.name}`)),
      filter(user => user.active), // Only active users
      filter(user => user.age >= 18), // Only adults
      map(user => ({
        displayName: `${user.name} (${user.age})`,
        category: user.age >= 25 ? 'Senior' : 'Junior'
      })),
      tap(user => console.log(`✅ Processed: ${user.displayName} - ${user.category}`))
    );
    
    const subscription = processedUsers$.subscribe({
      next: (user) => {
        console.log(`📋 Final user data: ${JSON.stringify(user)}`);
      },
      complete: () => {
        console.log('✅ User processing completed');
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 6: Debugging with tap
  runDebuggingExample() {
    console.log('\n🚀 Example 6: Debugging with Tap');
    
    // Create a stream that might have issues
    const data$ = of(10, 20, 0, 30, -5, 40);
    
    const processed$ = data$.pipe(
      tap(x => console.log(`🔍 Input: ${x}`)),
      map(x => {
        if (x === 0) {
          console.warn('⚠️ Zero detected, converting to 1');
          return 1;
        }
        return x;
      }),
      tap(x => console.log(`🔧 After zero check: ${x}`)),
      filter(x => x > 0),
      tap(x => console.log(`✅ After positive filter: ${x}`)),
      map(x => 100 / x),
      tap(x => console.log(`🧮 After division: ${x}`))
    );
    
    const subscription = processed$.subscribe({
      next: (value) => {
        console.log(`📊 Final result: ${value.toFixed(2)}`);
      },
      complete: () => {
        console.log('✅ Debugging example completed');
      }
    });

    this.subscriptions.push(subscription);
  }

  // Clear all outputs
  clearOutputs() {
    this.mapOutput.set([]);
    this.filterOutput.set([]);
    this.tapOutput.set([]);
    this.chainedOutput.set([]);
    console.clear();
    console.log('🧹 Outputs cleared');
  }
}
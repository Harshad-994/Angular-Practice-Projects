import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, of, from, interval } from 'rxjs';
import { map, filter, tap, take, debounceTime, distinctUntilChanged, switchMap, mergeMap, concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-piping-lesson',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './piping-lesson.component.html',
  styleUrls: ['./piping-lesson.component.css']
})
export class PipingLessonComponent implements OnInit, OnDestroy {
  // Signals for reactive UI updates
  protected readonly basicPipeOutput = signal<string[]>([]);
  protected readonly complexPipeOutput = signal<string[]>([]);
  protected readonly performanceOutput = signal<string[]>([]);
  protected readonly readabilityOutput = signal<string[]>([]);

  // Subscription management
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    console.log('🎓 Welcome to Piping Lesson!');
    this.logTheory();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('🧹 All subscriptions cleaned up');
  }

  private logTheory() {
    console.log(`
📚 THEORY: Piping with .pipe()

🔗 What is Piping?
- .pipe() is the modern way to chain operators in RxJS
- It replaced the old chaining syntax (deprecated since RxJS 5.5)
- Operators are passed as arguments to .pipe()
- Each operator receives the output of the previous operator
- Creates a new Observable without modifying the original

🔗 Why Use .pipe()?
- Better tree-shaking (smaller bundle sizes)
- More readable and maintainable code
- Easier to debug and test individual operators
- Consistent API across all operators
- Better TypeScript support

🔗 Syntax:
observable.pipe(
  operator1(),
  operator2(),
  operator3()
)

🚫 OLD WAY (Deprecated):
observable
  .map(x => x * 2)
  .filter(x => x > 10)
  .subscribe()

✅ NEW WAY (Modern):
observable.pipe(
  map(x => x * 2),
  filter(x => x > 10)
).subscribe()
    `);
  }

  // Example 1: Basic Piping
  runBasicPipeExample() {
    console.log('\n🚀 Example 1: Basic Piping Syntax');
    
    this.basicPipeOutput.set([]);
    
    // Source Observable
    const numbers$ = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    
    // Using .pipe() to chain operators
    const processed$ = numbers$.pipe(
      tap(x => {
        console.log(`🔍 Original: ${x}`);
        this.basicPipeOutput.update(output => [...output, `Original: ${x}`]);
      }),
      map(x => x * 2),
      tap(x => {
        console.log(`🔢 Doubled: ${x}`);
        this.basicPipeOutput.update(output => [...output, `Doubled: ${x}`]);
      }),
      filter(x => x > 10),
      tap(x => {
        console.log(`✅ Filtered (>10): ${x}`);
        this.basicPipeOutput.update(output => [...output, `Filtered: ${x}`]);
      })
    );
    
    const subscription = processed$.subscribe({
      next: (value) => {
        console.log(`📤 Final result: ${value}`);
        this.basicPipeOutput.update(output => [...output, `Final: ${value}`]);
      },
      complete: () => {
        console.log('✅ Basic piping completed');
        this.basicPipeOutput.update(output => [...output, 'Completed']);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 2: Complex Piping Chain
  runComplexPipeExample() {
    console.log('\n🚀 Example 2: Complex Piping Chain');
    
    this.complexPipeOutput.set([]);
    
    // Simulate user search input
    const searchTerms = ['a', 'an', 'ang', 'angu', 'angul', 'angula', 'angular'];
    const searchInput$ = from(searchTerms);
    
    // Complex piping chain for search functionality
    const searchResults$ = searchInput$.pipe(
      tap(term => {
        console.log(`🔍 Search term: "${term}"`);
        this.complexPipeOutput.update(output => [...output, `Search: "${term}"`]);
      }),
      filter(term => term.length >= 2), // Minimum 2 characters
      tap(term => {
        console.log(`✅ Valid length: "${term}"`);
        this.complexPipeOutput.update(output => [...output, `Valid: "${term}"`]);
      }),
      distinctUntilChanged(), // Only if different from previous
      tap(term => {
        console.log(`🔄 Distinct: "${term}"`);
        this.complexPipeOutput.update(output => [...output, `Distinct: "${term}"`]);
      }),
      switchMap(term => {
        // Simulate API call
        const mockResults = [
          `${term}-result-1`,
          `${term}-result-2`,
          `${term}-result-3`
        ];
        console.log(`🌐 API call for: "${term}"`);
        this.complexPipeOutput.update(output => [...output, `API call: "${term}"`]);
        return from(mockResults);
      }),
      tap(result => {
        console.log(`📊 Search result: ${result}`);
        this.complexPipeOutput.update(output => [...output, `Result: ${result}`]);
      })
    );
    
    const subscription = searchResults$.subscribe({
      next: (result) => {
        console.log(`📤 Final search result: ${result}`);
      },
      complete: () => {
        console.log('✅ Complex piping completed');
        this.complexPipeOutput.update(output => [...output, 'Search completed']);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 3: Performance Benefits
  runPerformanceExample() {
    console.log('\n🚀 Example 3: Performance Benefits of Piping');
    
    this.performanceOutput.set([]);
    
    // Large dataset simulation
    const largeDataset = Array.from({ length: 1000 }, (_, i) => i + 1);
    const data$ = from(largeDataset);
    
    console.log('⚡ Processing 1000 items with optimized piping...');
    this.performanceOutput.update(output => [...output, 'Processing 1000 items...']);
    
    const startTime = performance.now();
    
    const optimized$ = data$.pipe(
      // Filter early to reduce subsequent processing
      filter(x => x % 10 === 0), // Only multiples of 10
      tap(() => {
        // Count filtered items
        const currentCount = this.performanceOutput().filter(item => item.includes('Filtered')).length;
        if (currentCount < 5) { // Only show first 5 for demo
          this.performanceOutput.update(output => [...output, `Filtered: ${currentCount + 1} items`]);
        }
      }),
      // Then transform (fewer items to process)
      map(x => x * x),
      // Take only first 10 results
      take(10)
    );
    
    const subscription = optimized$.subscribe({
      next: (value) => {
        console.log(`📊 Processed value: ${value}`);
        if (this.performanceOutput().filter(item => item.includes('Processed')).length < 5) {
          this.performanceOutput.update(output => [...output, `Processed: ${value}`]);
        }
      },
      complete: () => {
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
        console.log(`✅ Performance test completed in ${duration}ms`);
        this.performanceOutput.update(output => [...output, `Completed in ${duration}ms`]);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 4: Readable Code Structure
  runReadabilityExample() {
    console.log('\n🚀 Example 4: Readable Code Structure');
    
    this.readabilityOutput.set([]);
    
    // User data processing pipeline
    const users = [
      { id: 1, name: 'Alice Johnson', age: 28, department: 'Engineering', active: true },
      { id: 2, name: 'Bob Smith', age: 17, department: 'Marketing', active: false },
      { id: 3, name: 'Charlie Brown', age: 35, department: 'Engineering', active: true },
      { id: 4, name: 'Diana Prince', age: 16, department: 'Design', active: true },
      { id: 5, name: 'Eve Wilson', age: 42, department: 'Engineering', active: true }
    ];
    
    const users$ = from(users);
    
    // Well-structured piping for readability
    const processedUsers$ = users$.pipe(
      // Step 1: Log incoming data
      tap(user => {
        console.log(`👤 Processing user: ${user.name}`);
        this.readabilityOutput.update(output => [...output, `Processing: ${user.name}`]);
      }),
      
      // Step 2: Business logic filters
      filter(user => user.active),
      tap(user => {
        console.log(`✅ Active user: ${user.name}`);
        this.readabilityOutput.update(output => [...output, `Active: ${user.name}`]);
      }),
      
      filter(user => user.age >= 18),
      tap(user => {
        console.log(`🔞 Adult user: ${user.name}`);
        this.readabilityOutput.update(output => [...output, `Adult: ${user.name}`]);
      }),
      
      filter(user => user.department === 'Engineering'),
      tap(user => {
        console.log(`⚙️ Engineering user: ${user.name}`);
        this.readabilityOutput.update(output => [...output, `Engineering: ${user.name}`]);
      }),
      
      // Step 3: Data transformation
      map(user => ({
        displayName: `${user.name} (${user.age})`,
        seniority: user.age >= 30 ? 'Senior' : 'Junior',
        department: user.department,
        id: user.id
      })),
      
      // Step 4: Final processing
      tap(processedUser => {
        console.log(`🎯 Final user: ${JSON.stringify(processedUser)}`);
        this.readabilityOutput.update(output => [...output, `Final: ${processedUser.displayName} - ${processedUser.seniority}`]);
      })
    );
    
    const subscription = processedUsers$.subscribe({
      next: (user) => {
        console.log(`📋 Qualified user: ${user.displayName}`);
      },
      complete: () => {
        console.log('✅ User processing pipeline completed');
        this.readabilityOutput.update(output => [...output, 'Pipeline completed']);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 5: Operator Order Matters
  runOrderExample() {
    console.log('\n🚀 Example 5: Operator Order Matters');
    
    const numbers$ = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    
    console.log('❌ INEFFICIENT: Map first, then filter');
    const inefficient$ = numbers$.pipe(
      map(x => {
        console.log(`🔢 Mapping ${x} to ${x * x}`);
        return x * x; // Expensive operation on all items
      }),
      filter(x => {
        console.log(`🔍 Filtering ${x}`);
        return x > 25; // Filter after expensive operation
      })
    );
    
    inefficient$.subscribe(result => {
      console.log(`❌ Inefficient result: ${result}`);
    });
    
    setTimeout(() => {
      console.log('\n✅ EFFICIENT: Filter first, then map');
      const efficient$ = numbers$.pipe(
        filter(x => {
          console.log(`🔍 Filtering ${x}`);
          return x > 5; // Filter first (cheap operation)
        }),
        map(x => {
          console.log(`🔢 Mapping ${x} to ${x * x}`);
          return x * x; // Expensive operation on fewer items
        })
      );
      
      const sub = efficient$.subscribe(result => {
        console.log(`✅ Efficient result: ${result}`);
      });
      
      this.subscriptions.push(sub);
    }, 2000);
  }

  // Example 6: Error Handling in Pipes
  runErrorHandlingExample() {
    console.log('\n🚀 Example 6: Error Handling in Pipes');
    
    const data$ = of(10, 20, 0, 30, -5, 40);
    
    const safeProcessing$ = data$.pipe(
      tap(x => console.log(`🔍 Input: ${x}`)),
      map(x => {
        if (x === 0) {
          throw new Error('Division by zero!');
        }
        return 100 / x;
      }),
      tap(x => console.log(`✅ Result: ${x}`))
    );
    
    const subscription = safeProcessing$.subscribe({
      next: (value) => console.log(`📊 Safe result: ${value.toFixed(2)}`),
      error: (error) => console.error(`❌ Pipeline error: ${error.message}`),
      complete: () => console.log('✅ Error handling example completed')
    });

    this.subscriptions.push(subscription);
  }

  // Clear all outputs
  clearOutputs() {
    this.basicPipeOutput.set([]);
    this.complexPipeOutput.set([]);
    this.performanceOutput.set([]);
    this.readabilityOutput.set([]);
    console.clear();
    console.log('🧹 Outputs cleared');
  }
}
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, Subject, of, from, interval, fromEvent } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, takeUntil, take, takeWhile, skip, first, last, throttleTime, auditTime, sample, tap } from 'rxjs/operators';

@Component({
  selector: 'app-filtering-lesson',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filtering-lesson.component.html',
  styleUrls: ['./filtering-lesson.component.css']
})
export class FilteringLessonComponent implements OnInit, OnDestroy {
  // Signals for reactive UI updates
  protected readonly debounceOutput = signal<string[]>([]);
  protected readonly distinctOutput = signal<string[]>([]);
  protected readonly takeUntilOutput = signal<string[]>([]);
  protected readonly throttleOutput = signal<string[]>([]);
  protected readonly combinedOutput = signal<string[]>([]);

  // Subscription management
  private subscriptions: Subscription[] = [];
  private destroy$ = new Subject<void>();

  ngOnInit() {
    console.log('🎓 Welcome to Filtering Operators Lesson!');
    this.logTheory();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('🧹 All subscriptions cleaned up');
  }

  private logTheory() {
    console.log(`
📚 THEORY: Filtering Operators

🔍 What are Filtering Operators?
- Control the flow of data through Observable streams
- Decide which values to emit and which to ignore
- Essential for performance optimization and user experience
- Help manage timing and frequency of emissions

🔍 Essential Filtering Operators:

1. DEBOUNCETIME - Wait for Pause in Emissions
   - Emits only after a specified time has passed without new emissions
   - Use for: Search input, resize events, user input validation
   - Pattern: Wait for user to stop typing

2. DISTINCTUNTILCHANGED - Only Emit Changed Values
   - Emits only when the current value is different from the previous
   - Use for: Preventing duplicate API calls, state management
   - Pattern: Only when value actually changes

3. TAKEUNTIL - Take Until Another Observable Emits
   - Completes the source Observable when another Observable emits
   - Use for: Component cleanup, cancellation, timeouts
   - Pattern: Essential for preventing memory leaks

4. THROTTLETIME - Limit Emission Rate
   - Emits first value, then ignores subsequent values for specified time
   - Use for: Button clicks, scroll events, rate limiting
   - Pattern: Prevent spam, limit frequency

5. TAKE/SKIP - Control Number of Emissions
   - take(n): Only emit first n values
   - skip(n): Skip first n values
   - Use for: Pagination, ignoring initial values
   - Pattern: Precise control over emission count
    `);
  }

  // Example 1: debounceTime - Search Input
  runDebounceExample() {
    console.log('\n🚀 Example 1: debounceTime - Search Input Optimization');
    
    this.debounceOutput.set([]);
    
    // Simulate rapid user typing
    const searchTerms = ['a', 'an', 'ang', 'angu', 'angul', 'angula', 'angular'];
    let index = 0;
    
    // Create a subject to simulate user input
    const searchInput$ = new Subject<string>();
    
    // Apply debounceTime to wait for user to stop typing
    const debouncedSearch$ = searchInput$.pipe(
      debounceTime(500), // Wait 500ms after user stops typing
      distinctUntilChanged(), // Only if search term changed
      takeUntil(this.destroy$)
    );
    
    // Subscribe to debounced search
    const subscription = debouncedSearch$.subscribe({
      next: (term) => {
        console.log(`🔍 Searching for: "${term}"`);
        this.debounceOutput.update(output => [...output, `🔍 Search: "${term}"`]);
        
        // Simulate API call
        setTimeout(() => {
          console.log(`✅ Results for: "${term}"`);
          this.debounceOutput.update(output => [...output, `✅ Results: "${term}"`]);
        }, 300);
      }
    });
    
    // Simulate user typing with delays
    const simulateTyping = () => {
      if (index < searchTerms.length) {
        const term = searchTerms[index];
        console.log(`⌨️ User typed: "${term}"`);
        this.debounceOutput.update(output => [...output, `⌨️ Typed: "${term}"`]);
        
        searchInput$.next(term);
        index++;
        
        // Random delay between 100-800ms to simulate real typing
        const delay = Math.random() * 700 + 100;
        setTimeout(simulateTyping, delay);
      } else {
        console.log('✅ Typing simulation completed');
        this.debounceOutput.update(output => [...output, 'Typing completed']);
      }
    };
    
    simulateTyping();
    this.subscriptions.push(subscription);
  }

  // Example 2: distinctUntilChanged - Prevent Duplicate API Calls
  runDistinctExample() {
    console.log('\n🚀 Example 2: distinctUntilChanged - Prevent Duplicate API Calls');
    
    this.distinctOutput.set([]);
    
    // Simulate user selections with duplicates
    const userSelections$ = of('apple', 'apple', 'banana', 'banana', 'banana', 'cherry', 'apple', 'cherry');
    
    console.log('📊 Without distinctUntilChanged:');
    this.distinctOutput.update(output => [...output, '📊 Without distinctUntilChanged:']);
    
    // First, show what happens without distinctUntilChanged
    const withoutDistinct$ = userSelections$.pipe(
      takeUntil(this.destroy$)
    );
    
    const sub1 = withoutDistinct$.subscribe({
      next: (selection) => {
        console.log(`❌ API call for: ${selection}`);
        this.distinctOutput.update(output => [...output, `❌ API call: ${selection}`]);
      },
      complete: () => {
        console.log('\n📊 With distinctUntilChanged:');
        this.distinctOutput.update(output => [...output, '📊 With distinctUntilChanged:']);
        
        // Then show with distinctUntilChanged
        const withDistinct$ = userSelections$.pipe(
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        );
        
        const sub2 = withDistinct$.subscribe({
          next: (selection) => {
            console.log(`✅ API call for: ${selection}`);
            this.distinctOutput.update(output => [...output, `✅ API call: ${selection}`]);
          },
          complete: () => {
            console.log('✅ distinctUntilChanged example completed');
            this.distinctOutput.update(output => [...output, 'Comparison completed']);
          }
        });
        
        this.subscriptions.push(sub2);
      }
    });
    
    this.subscriptions.push(sub1);
  }

  // Example 3: takeUntil - Component Cleanup Pattern
  runTakeUntilExample() {
    console.log('\n🚀 Example 3: takeUntil - Component Cleanup Pattern');
    
    this.takeUntilOutput.set([]);
    
    // Simulate long-running observables
    const longRunningTask$ = interval(500).pipe(
      takeUntil(this.destroy$)
    );
    
    const anotherTask$ = interval(800).pipe(
      takeUntil(this.destroy$)
    );
    
    console.log('🔄 Starting long-running tasks...');
    this.takeUntilOutput.update(output => [...output, '🔄 Starting tasks...']);
    
    // Subscribe to tasks
    const sub1 = longRunningTask$.subscribe({
      next: (value) => {
        console.log(`⏰ Task 1 tick: ${value}`);
        this.takeUntilOutput.update(output => [...output, `⏰ Task 1: ${value}`]);
      }
    });
    
    const sub2 = anotherTask$.subscribe({
      next: (value) => {
        console.log(`⏲️ Task 2 tick: ${value}`);
        this.takeUntilOutput.update(output => [...output, `⏲️ Task 2: ${value}`]);
      }
    });
    
    // Simulate component destruction after 5 seconds
    setTimeout(() => {
      console.log('🛑 Simulating component destruction...');
      this.takeUntilOutput.update(output => [...output, '🛑 Component destroying...']);
      
      // Create a local destroy subject for this example
      const localDestroy$ = new Subject<void>();
      
      // Update subscriptions to use local destroy
      const cleanTask1$ = interval(500).pipe(takeUntil(localDestroy$));
      const cleanTask2$ = interval(800).pipe(takeUntil(localDestroy$));
      
      const cleanSub1 = cleanTask1$.subscribe({
        next: (value) => {
          console.log(`✅ Clean Task 1: ${value}`);
          this.takeUntilOutput.update(output => [...output, `✅ Clean Task 1: ${value}`]);
        }
      });
      
      const cleanSub2 = cleanTask2$.subscribe({
        next: (value) => {
          console.log(`✅ Clean Task 2: ${value}`);
          this.takeUntilOutput.update(output => [...output, `✅ Clean Task 2: ${value}`]);
        }
      });
      
      // Destroy after 2 seconds
      setTimeout(() => {
        localDestroy$.next();
        localDestroy$.complete();
        console.log('✅ All tasks cleaned up automatically');
        this.takeUntilOutput.update(output => [...output, '✅ All tasks cleaned up']);
      }, 2000);
      
      this.subscriptions.push(cleanSub1, cleanSub2);
    }, 3000);
    
    this.subscriptions.push(sub1, sub2);
  }

  // Example 4: throttleTime vs debounceTime
  runThrottleExample() {
    console.log('\n🚀 Example 4: throttleTime vs debounceTime - Button Clicks');
    
    this.throttleOutput.set([]);
    
    // Create a subject to simulate rapid button clicks
    const buttonClicks$ = new Subject<number>();
    
    // Apply throttleTime (emits first, then ignores for duration)
    const throttledClicks$ = buttonClicks$.pipe(
      throttleTime(1000),
      takeUntil(this.destroy$)
    );
    
    // Apply debounceTime (waits for pause, then emits last)
    const debouncedClicks$ = buttonClicks$.pipe(
      debounceTime(1000),
      takeUntil(this.destroy$)
    );
    
    // Subscribe to both
    const throttleSub = throttledClicks$.subscribe({
      next: (clickNum) => {
        console.log(`🚫 Throttled click: ${clickNum}`);
        this.throttleOutput.update(output => [...output, `🚫 Throttled: ${clickNum}`]);
      }
    });
    
    const debounceSub = debouncedClicks$.subscribe({
      next: (clickNum) => {
        console.log(`⏳ Debounced click: ${clickNum}`);
        this.throttleOutput.update(output => [...output, `⏳ Debounced: ${clickNum}`]);
      }
    });
    
    // Simulate rapid button clicks
    let clickCount = 0;
    const simulateClicks = () => {
      if (clickCount < 10) {
        clickCount++;
        console.log(`🖱️ Button click ${clickCount}`);
        this.throttleOutput.update(output => [...output, `🖱️ Click ${clickCount}`]);
        
        buttonClicks$.next(clickCount);
        
        // Random delay between clicks (50-300ms)
        const delay = Math.random() * 250 + 50;
        setTimeout(simulateClicks, delay);
      } else {
        console.log('✅ Click simulation completed');
        this.throttleOutput.update(output => [...output, 'Click simulation completed']);
      }
    };
    
    simulateClicks();
    this.subscriptions.push(throttleSub, debounceSub);
  }

  // Example 5: Combined Filtering - Real-world Search
  runCombinedExample() {
    console.log('\n🚀 Example 5: Combined Filtering - Real-world Search Implementation');
    
    this.combinedOutput.set([]);
    
    // Create search input subject
    const searchInput$ = new Subject<string>();
    
    // Comprehensive search implementation
    const searchResults$ = searchInput$.pipe(
      // Log all input
      tap(term => {
        console.log(`📝 Raw input: "${term}"`);
        this.combinedOutput.update(output => [...output, `📝 Input: "${term}"`]);
      }),
      
      // Filter out empty and short searches
      filter(term => term.length >= 2),
      tap(term => {
        console.log(`✅ Valid length: "${term}"`);
        this.combinedOutput.update(output => [...output, `✅ Valid: "${term}"`]);
      }),
      
      // Remove duplicate consecutive searches
      distinctUntilChanged(),
      tap(term => {
        console.log(`🔄 Distinct: "${term}"`);
        this.combinedOutput.update(output => [...output, `🔄 Distinct: "${term}"`]);
      }),
      
      // Wait for user to stop typing
      debounceTime(300),
      tap(term => {
        console.log(`⏳ Debounced: "${term}"`);
        this.combinedOutput.update(output => [...output, `⏳ Debounced: "${term}"`]);
      }),
      
      // Take only first 5 searches for demo
      take(5),
      
      takeUntil(this.destroy$)
    );
    
    const subscription = searchResults$.subscribe({
      next: (term) => {
        console.log(`🔍 Final search: "${term}"`);
        this.combinedOutput.update(output => [...output, `🔍 Search: "${term}"`]);
        
        // Simulate API call
        setTimeout(() => {
          console.log(`📊 Results for: "${term}"`);
          this.combinedOutput.update(output => [...output, `📊 Results: "${term}"`]);
        }, 200);
      },
      complete: () => {
        console.log('✅ Search implementation completed');
        this.combinedOutput.update(output => [...output, 'Search completed']);
      }
    });
    
    // Simulate user search behavior
    const searchTerms = ['a', 'ap', 'app', 'appl', 'apple', 'application', 'app', 'angular', 'ang', 'react', 'vue'];
    let index = 0;
    
    const simulateSearch = () => {
      if (index < searchTerms.length) {
        const term = searchTerms[index];
        searchInput$.next(term);
        index++;
        
        // Variable delay to simulate real typing patterns
        const delay = Math.random() * 400 + 100;
        setTimeout(simulateSearch, delay);
      }
    };
    
    simulateSearch();
    this.subscriptions.push(subscription);
  }

  // Example 6: Performance Comparison
  runPerformanceExample() {
    console.log('\n🚀 Example 6: Performance Impact of Filtering');
    
    // Generate large dataset
    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      category: i % 5 === 0 ? 'premium' : 'standard',
      price: Math.random() * 1000
    }));
    
    const data$ = from(largeDataset);
    
    console.log('⚡ Performance test: Processing 10,000 items');
    
    const startTime = performance.now();
    
    // Efficient filtering: filter early, transform late
    const efficientProcessing$ = data$.pipe(
      filter(item => item.category === 'premium'), // Filter first (reduces dataset)
      filter(item => item.price > 500), // Additional filter
      take(10), // Limit results early
      tap(() => {
        // Count processed items
      }),
      takeUntil(this.destroy$)
    );
    
    const subscription = efficientProcessing$.subscribe({
      next: (item) => {
        console.log(`💎 Premium item: ${item.name} - $${item.price.toFixed(2)}`);
      },
      complete: () => {
        const endTime = performance.now();
        const duration = (endTime - startTime).toFixed(2);
        console.log(`✅ Performance test completed in ${duration}ms`);
        console.log('🎯 Key insight: Early filtering dramatically improves performance');
      }
    });

    this.subscriptions.push(subscription);
  }

  // Clear all outputs
  clearOutputs() {
    this.debounceOutput.set([]);
    this.distinctOutput.set([]);
    this.takeUntilOutput.set([]);
    this.throttleOutput.set([]);
    this.combinedOutput.set([]);
    console.clear();
    console.log('🧹 Outputs cleared');
  }
}
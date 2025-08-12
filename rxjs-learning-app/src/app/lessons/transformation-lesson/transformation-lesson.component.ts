import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, of, from, interval, timer } from 'rxjs';
import { switchMap, mergeMap, concatMap, exhaustMap, map, delay, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-transformation-lesson',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transformation-lesson.component.html',
  styleUrls: ['./transformation-lesson.component.css']
})
export class TransformationLessonComponent implements OnInit, OnDestroy {
  // Signals for reactive UI updates
  protected readonly switchMapOutput = signal<string[]>([]);
  protected readonly mergeMapOutput = signal<string[]>([]);
  protected readonly concatMapOutput = signal<string[]>([]);
  protected readonly exhaustMapOutput = signal<string[]>([]);
  protected readonly comparisonOutput = signal<string[]>([]);

  // Subscription management
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    console.log('🎓 Welcome to Transformation Operators Lesson!');
    this.logTheory();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('🧹 All subscriptions cleaned up');
  }

  private logTheory() {
    console.log(`
📚 THEORY: Transformation Operators (Higher-Order Mapping)

🔄 What are Transformation Operators?
- Also called "flattening operators" or "higher-order mapping operators"
- They transform each source value into an Observable (inner Observable)
- Then they flatten the inner Observables into a single output stream
- Different operators handle multiple inner Observables differently

🔄 The Four Essential Transformation Operators:

1. SWITCHMAP - Cancel Previous, Switch to New
   - Cancels the previous inner Observable when a new one arrives
   - Use for: HTTP requests, search suggestions, navigation
   - Pattern: Latest wins, cancel previous

2. MERGEMAP - Handle Multiple Concurrent Operations
   - Keeps all inner Observables active concurrently
   - Use for: Independent operations, file uploads, parallel processing
   - Pattern: All active, merge results

3. CONCATMAP - Sequential Operations
   - Waits for each inner Observable to complete before starting the next
   - Use for: Sequential operations, ordered processing
   - Pattern: One at a time, maintain order

4. EXHAUSTMAP - Ignore New Until Current Completes
   - Ignores new source values while inner Observable is active
   - Use for: Login requests, save operations, prevent spam
   - Pattern: Ignore new until current finishes

🚫 AVOID: flatMap (use mergeMap instead - same functionality, clearer name)
    `);
  }

  // Example 1: switchMap - Cancel Previous
  runSwitchMapExample() {
    console.log('\n🚀 Example 1: switchMap - Cancel Previous Operations');
    
    this.switchMapOutput.set([]);
    
    // Simulate user typing in search box
    const searchTerms$ = of('a', 'an', 'ang', 'angu', 'angul').pipe(
      // Add delay between search terms to simulate typing
      concatMap((term, index) => of(term).pipe(delay(index * 800)))
    );
    
    // Simulate API search function
    const searchAPI = (term: string) => {
      console.log(`🔍 Starting search for: "${term}"`);
      this.switchMapOutput.update(output => [...output, `🔍 Searching: "${term}"`]);
      
      return of(`Results for "${term}"`).pipe(
        delay(1500), // Simulate API delay
        tap(result => {
          console.log(`✅ Search completed: ${result}`);
          this.switchMapOutput.update(output => [...output, `✅ Completed: ${result}`]);
        })
      );
    };
    
    // Using switchMap - cancels previous searches
    const searchResults$ = searchTerms$.pipe(
      tap(term => {
        console.log(`⌨️ User typed: "${term}"`);
        this.switchMapOutput.update(output => [...output, `⌨️ Typed: "${term}"`]);
      }),
      switchMap(term => searchAPI(term))
    );
    
    const subscription = searchResults$.subscribe({
      next: (result) => {
        console.log(`📊 Final result: ${result}`);
        this.switchMapOutput.update(output => [...output, `📊 Final: ${result}`]);
      },
      complete: () => {
        console.log('✅ switchMap example completed');
        this.switchMapOutput.update(output => [...output, 'Search completed']);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 2: mergeMap - Concurrent Operations
  runMergeMapExample() {
    console.log('\n🚀 Example 2: mergeMap - Concurrent Operations');
    
    this.mergeMapOutput.set([]);
    
    // Simulate multiple file uploads
    const files$ = of('file1.jpg', 'file2.pdf', 'file3.doc');
    
    // Simulate file upload function
    const uploadFile = (filename: string) => {
      const uploadTime = Math.random() * 2000 + 500; // Random upload time
      console.log(`📤 Starting upload: ${filename} (${uploadTime.toFixed(0)}ms)`);
      this.mergeMapOutput.update(output => [...output, `📤 Uploading: ${filename}`]);
      
      return of(`${filename} uploaded successfully`).pipe(
        delay(uploadTime),
        tap(result => {
          console.log(`✅ Upload completed: ${result}`);
          this.mergeMapOutput.update(output => [...output, `✅ ${result}`]);
        })
      );
    };
    
    // Using mergeMap - all uploads happen concurrently
    const uploadResults$ = files$.pipe(
      tap(file => {
        console.log(`📁 Processing file: ${file}`);
        this.mergeMapOutput.update(output => [...output, `📁 Processing: ${file}`]);
      }),
      mergeMap(file => uploadFile(file))
    );
    
    const subscription = uploadResults$.subscribe({
      next: (result) => {
        console.log(`📊 Upload result: ${result}`);
      },
      complete: () => {
        console.log('✅ mergeMap example completed - All uploads finished');
        this.mergeMapOutput.update(output => [...output, 'All uploads completed']);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 3: concatMap - Sequential Operations
  runConcatMapExample() {
    console.log('\n🚀 Example 3: concatMap - Sequential Operations');
    
    this.concatMapOutput.set([]);
    
    // Simulate database operations that must be sequential
    const operations$ = of('CREATE_USER', 'ASSIGN_ROLE', 'SEND_EMAIL', 'LOG_ACTIVITY');
    
    // Simulate database operation function
    const performOperation = (operation: string) => {
      const operationTime = 800; // Fixed time for demo
      console.log(`🗄️ Starting operation: ${operation}`);
      this.concatMapOutput.update(output => [...output, `🗄️ Starting: ${operation}`]);
      
      return of(`${operation} completed`).pipe(
        delay(operationTime),
        tap(result => {
          console.log(`✅ Operation completed: ${result}`);
          this.concatMapOutput.update(output => [...output, `✅ ${result}`]);
        })
      );
    };
    
    // Using concatMap - operations happen one after another
    const operationResults$ = operations$.pipe(
      tap(op => {
        console.log(`📋 Queuing operation: ${op}`);
        this.concatMapOutput.update(output => [...output, `📋 Queued: ${op}`]);
      }),
      concatMap(operation => performOperation(operation))
    );
    
    const subscription = operationResults$.subscribe({
      next: (result) => {
        console.log(`📊 Operation result: ${result}`);
      },
      complete: () => {
        console.log('✅ concatMap example completed - All operations finished in order');
        this.concatMapOutput.update(output => [...output, 'All operations completed sequentially']);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 4: exhaustMap - Ignore New Until Current Completes
  runExhaustMapExample() {
    console.log('\n🚀 Example 4: exhaustMap - Ignore New Until Current Completes');
    
    this.exhaustMapOutput.set([]);
    
    // Simulate rapid button clicks (login attempts)
    const buttonClicks$ = interval(300).pipe(
      take(8), // Simulate 8 rapid clicks
      map(i => `Click ${i + 1}`)
    );
    
    // Simulate login API call
    const loginAPI = (clickInfo: string) => {
      console.log(`🔐 Processing login attempt: ${clickInfo}`);
      this.exhaustMapOutput.update(output => [...output, `🔐 Processing: ${clickInfo}`]);
      
      return of(`Login successful for ${clickInfo}`).pipe(
        delay(2000), // Login takes 2 seconds
        tap(result => {
          console.log(`✅ Login completed: ${result}`);
          this.exhaustMapOutput.update(output => [...output, `✅ ${result}`]);
        })
      );
    };
    
    // Using exhaustMap - ignores clicks while login is in progress
    const loginResults$ = buttonClicks$.pipe(
      tap(click => {
        console.log(`🖱️ Button clicked: ${click}`);
        this.exhaustMapOutput.update(output => [...output, `🖱️ ${click}`]);
      }),
      exhaustMap(click => loginAPI(click))
    );
    
    const subscription = loginResults$.subscribe({
      next: (result) => {
        console.log(`📊 Login result: ${result}`);
      },
      complete: () => {
        console.log('✅ exhaustMap example completed');
        this.exhaustMapOutput.update(output => [...output, 'Login attempts completed']);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 5: Side-by-Side Comparison
  runComparisonExample() {
    console.log('\n🚀 Example 5: Side-by-Side Comparison of All Operators');
    
    this.comparisonOutput.set([]);
    
    // Source: 3 values with 500ms delay between them
    const source$ = of('A', 'B', 'C').pipe(
      concatMap((value, index) => of(value).pipe(delay(index * 500)))
    );
    
    // Inner Observable: takes 1200ms to complete
    const innerObs = (value: string) => {
      return of(`${value}-result`).pipe(
        delay(1200),
        tap(result => {
          console.log(`📊 Inner Observable completed: ${result}`);
          this.comparisonOutput.update(output => [...output, `📊 ${result} completed`]);
        })
      );
    };
    
    console.log('🔄 Testing switchMap (cancels previous)...');
    this.comparisonOutput.update(output => [...output, '🔄 Testing switchMap...']);
    
    const switchMapTest$ = source$.pipe(
      tap(value => {
        console.log(`switchMap - Source emitted: ${value}`);
        this.comparisonOutput.update(output => [...output, `switchMap: ${value} emitted`]);
      }),
      switchMap(value => innerObs(value))
    );
    
    const subscription1 = switchMapTest$.subscribe({
      next: (result) => {
        console.log(`switchMap result: ${result}`);
        this.comparisonOutput.update(output => [...output, `switchMap result: ${result}`]);
      },
      complete: () => {
        console.log('switchMap completed');
        this.comparisonOutput.update(output => [...output, 'switchMap completed']);
        
        // Start mergeMap test after switchMap completes
        setTimeout(() => this.runMergeMapComparison(), 1000);
      }
    });

    this.subscriptions.push(subscription1);
  }

  private runMergeMapComparison() {
    console.log('\n🔄 Testing mergeMap (concurrent)...');
    this.comparisonOutput.update(output => [...output, '🔄 Testing mergeMap...']);
    
    const source$ = of('X', 'Y', 'Z').pipe(
      concatMap((value, index) => of(value).pipe(delay(index * 500)))
    );
    
    const innerObs = (value: string) => {
      return of(`${value}-result`).pipe(
        delay(1200),
        tap(result => {
          console.log(`📊 mergeMap inner completed: ${result}`);
          this.comparisonOutput.update(output => [...output, `📊 ${result} completed`]);
        })
      );
    };
    
    const mergeMapTest$ = source$.pipe(
      tap(value => {
        console.log(`mergeMap - Source emitted: ${value}`);
        this.comparisonOutput.update(output => [...output, `mergeMap: ${value} emitted`]);
      }),
      mergeMap(value => innerObs(value))
    );
    
    const subscription2 = mergeMapTest$.subscribe({
      next: (result) => {
        console.log(`mergeMap result: ${result}`);
        this.comparisonOutput.update(output => [...output, `mergeMap result: ${result}`]);
      },
      complete: () => {
        console.log('mergeMap completed');
        this.comparisonOutput.update(output => [...output, 'mergeMap completed']);
        this.comparisonOutput.update(output => [...output, '✅ Comparison completed']);
      }
    });

    this.subscriptions.push(subscription2);
  }

  // Real-world example: HTTP requests
  runRealWorldExample() {
    console.log('\n🚀 Real-world Example: HTTP Request Patterns');
    
    // Simulate different HTTP request scenarios
    console.log('🌐 Scenario 1: Search suggestions (switchMap)');
    console.log('🌐 Scenario 2: Multiple API calls (mergeMap)');
    console.log('🌐 Scenario 3: Sequential data processing (concatMap)');
    console.log('🌐 Scenario 4: Prevent duplicate requests (exhaustMap)');
    
    // This would typically involve actual HTTP calls
    const mockHttpCall = (url: string) => {
      return of(`Response from ${url}`).pipe(delay(1000));
    };
    
    // Example patterns:
    console.log(`
🔍 Use switchMap for:
- Search autocomplete
- Navigation requests
- User input handling

🔀 Use mergeMap for:
- Independent API calls
- File uploads
- Parallel data fetching

📋 Use concatMap for:
- Sequential operations
- Ordered processing
- Dependent API calls

🚫 Use exhaustMap for:
- Login/save buttons
- Preventing duplicate requests
- Rate limiting
    `);
  }

  // Clear all outputs
  clearOutputs() {
    this.switchMapOutput.set([]);
    this.mergeMapOutput.set([]);
    this.concatMapOutput.set([]);
    this.exhaustMapOutput.set([]);
    this.comparisonOutput.set([]);
    console.clear();
    console.log('🧹 Outputs cleared');
  }
}
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, of, from, interval, timer, fromEvent, EMPTY, NEVER, iif } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-creation-operators-lesson',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creation-operators-lesson.component.html',
  styleUrls: ['./creation-operators-lesson.component.css']
})
export class CreationOperatorsLessonComponent implements OnInit, OnDestroy {
  // Signals for reactive UI updates
  protected readonly ofOutput = signal<string[]>([]);
  protected readonly fromOutput = signal<string[]>([]);
  protected readonly intervalOutput = signal<string[]>([]);
  protected readonly timerOutput = signal<string[]>([]);
  protected readonly fromEventOutput = signal<string[]>([]);
  protected readonly conditionalOutput = signal<string[]>([]);
  protected readonly emptyNeverOutput = signal<string[]>([]);
  protected readonly realWorldOutput = signal<string[]>([]);

  // Subscription management
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    console.log('🎓 Welcome to Creation Operators Lesson!');
    this.logTheory();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('🧹 All subscriptions cleaned up');
  }

  private logTheory() {
    console.log(`
📚 THEORY: Creation Operators

🏭 Creation operators are functions that create new Observables from various sources:

✅ CURRENT & RECOMMENDED:
- of(...values) - Create Observable from individual values
- from(array/iterable) - Create Observable from array, promise, or iterable
- interval(period) - Emit sequential numbers at specified intervals
- timer(delay, period?) - Emit after delay, optionally repeat at intervals
- fromEvent(target, eventName) - Create Observable from DOM events
- EMPTY - Observable that immediately completes
- NEVER - Observable that never emits or completes
- iif(condition, trueObs, falseObs) - Conditionally create Observable

🚫 AVOID (Deprecated):
- create() - Use new Observable() constructor instead
- range() - Use from() with array instead
- bindCallback() - Use modern async/await patterns
    `);
  }

  // Example 1: of() operator
  runOfExample() {
    console.log('\n🚀 Example 1: of() - Create from Values');
    
    this.ofOutput.set([]);
    
    // Create Observable from individual values
    const values$ = of(1, 'hello', true, { name: 'Angular' }, [1, 2, 3]);
    
    const subscription = values$.subscribe({
      next: (value) => {
        const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        console.log(`📦 of() emitted: ${valueStr} (${typeof value})`);
        this.ofOutput.update(output => [...output, `${valueStr} (${typeof value})`]);
      },
      complete: () => {
        console.log('✅ of() completed');
        this.ofOutput.update(output => [...output, 'Completed']);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 2: from() operator
  runFromExample() {
    console.log('\n🚀 Example 2: from() - Create from Iterables');
    
    this.fromOutput.set([]);
    
    // Create Observable from array
    const array$ = from([10, 20, 30, 40, 50]);
    
    // Create Observable from string (iterable)
    const string$ = from('RxJS');
    
    // Create Observable from Promise
    const promise$ = from(Promise.resolve('Promise resolved!'));
    
    console.log('📋 Processing array...');
    this.fromOutput.update(output => [...output, '📋 Processing array...']);
    
    const arraySub = array$.subscribe({
      next: (value) => {
        console.log(`📊 Array value: ${value}`);
        this.fromOutput.update(output => [...output, `Array: ${value}`]);
      },
      complete: () => {
        console.log('📋 Processing string...');
        this.fromOutput.update(output => [...output, '📋 Processing string...']);
        
        const stringSub = string$.subscribe({
          next: (char) => {
            console.log(`🔤 String char: ${char}`);
            this.fromOutput.update(output => [...output, `String: ${char}`]);
          },
          complete: () => {
            console.log('📋 Processing promise...');
            this.fromOutput.update(output => [...output, '📋 Processing promise...']);
            
            const promiseSub = promise$.subscribe({
              next: (value) => {
                console.log(`🤝 Promise value: ${value}`);
                this.fromOutput.update(output => [...output, `Promise: ${value}`]);
              },
              complete: () => {
                console.log('✅ from() examples completed');
                this.fromOutput.update(output => [...output, 'All completed']);
              }
            });
            
            this.subscriptions.push(promiseSub);
          }
        });
        
        this.subscriptions.push(stringSub);
      }
    });

    this.subscriptions.push(arraySub);
  }

  // Example 3: interval() operator
  runIntervalExample() {
    console.log('\n🚀 Example 3: interval() - Emit at Regular Intervals');
    
    this.intervalOutput.set([]);
    
    // Create Observable that emits every 800ms
    const interval$ = interval(800).pipe(
      take(6) // Only take first 6 values
    );
    
    const subscription = interval$.subscribe({
      next: (value) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`⏰ Interval tick ${value} at ${timestamp}`);
        this.intervalOutput.update(output => [...output, `Tick ${value} at ${timestamp}`]);
      },
      complete: () => {
        console.log('✅ Interval completed');
        this.intervalOutput.update(output => [...output, 'Interval completed']);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 4: timer() operator
  runTimerExample() {
    console.log('\n🚀 Example 4: timer() - Delayed and Repeated Emissions');
    
    this.timerOutput.set([]);
    
    // Timer that waits 1 second, then emits every 600ms
    const timer$ = timer(1000, 600).pipe(
      take(5) // Only take first 5 values
    );
    
    console.log('⏲️ Timer starting... (1 second delay)');
    this.timerOutput.update(output => [...output, 'Timer starting... (1 second delay)']);
    
    const subscription = timer$.subscribe({
      next: (value) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`⏲️ Timer emission ${value} at ${timestamp}`);
        this.timerOutput.update(output => [...output, `Timer ${value} at ${timestamp}`]);
      },
      complete: () => {
        console.log('✅ Timer completed');
        this.timerOutput.update(output => [...output, 'Timer completed']);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 5: fromEvent() operator
  runFromEventExample() {
    console.log('\n🚀 Example 5: fromEvent() - Create from DOM Events');
    
    this.fromEventOutput.set([]);
    
    // Create a button element for demonstration
    const button = document.createElement('button');
    button.textContent = 'Click me!';
    button.style.cssText = `
      padding: 10px 20px;
      background: #4299e1;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin: 10px 0;
      font-size: 14px;
    `;
    
    // Find a container to add the button
    const container = document.querySelector('.example-card:last-of-type .code-example');
    if (container) {
      container.appendChild(button);
    }
    
    // Create Observable from click events
    const clicks$ = fromEvent(button, 'click').pipe(
      take(5) // Only take first 5 clicks
    );
    
    console.log('🖱️ Click the button to see fromEvent in action!');
    this.fromEventOutput.update(output => [...output, 'Click the button above!']);
    
    const subscription = clicks$.subscribe({
      next: (event: any) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🖱️ Button clicked at ${timestamp}`);
        this.fromEventOutput.update(output => [...output, `Clicked at ${timestamp}`]);
      },
      complete: () => {
        console.log('✅ fromEvent completed (5 clicks reached)');
        this.fromEventOutput.update(output => [...output, 'Max clicks reached!']);
        button.disabled = true;
        button.textContent = 'Completed!';
        button.style.background = '#68d391';
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 6: EMPTY and NEVER
  runEmptyNeverExample() {
    console.log('\n🚀 Example 6: EMPTY and NEVER - Special Observables');
    
    this.emptyNeverOutput.set([]);
    
    // EMPTY Observable
    console.log('📭 Testing EMPTY Observable...');
    this.emptyNeverOutput.update(output => [...output, '📭 Testing EMPTY Observable...']);
    
    const emptySub = EMPTY.subscribe({
      next: (value) => {
        console.log(`EMPTY emitted: ${value}`); // This won't run
        this.emptyNeverOutput.update(output => [...output, `EMPTY emitted: ${value}`]);
      },
      complete: () => {
        console.log('✅ EMPTY completed immediately');
        this.emptyNeverOutput.update(output => [...output, '✅ EMPTY completed immediately']);
      },
      error: (error) => {
        console.log(`❌ EMPTY error: ${error}`);
        this.emptyNeverOutput.update(output => [...output, `❌ EMPTY error: ${error}`]);
      }
    });

    // NEVER Observable (be careful - this never completes!)
    setTimeout(() => {
      console.log('♾️ Testing NEVER Observable (no output expected)...');
      this.emptyNeverOutput.update(output => [...output, '♾️ Testing NEVER Observable...']);
      
      const neverSub = NEVER.subscribe({
        next: (value) => {
          console.log(`NEVER emitted: ${value}`); // This won't run
          this.emptyNeverOutput.update(output => [...output, `NEVER emitted: ${value}`]);
        },
        complete: () => {
          console.log('NEVER completed'); // This won't run
          this.emptyNeverOutput.update(output => [...output, 'NEVER completed']);
        },
        error: (error) => {
          console.log(`NEVER error: ${error}`); // This won't run
          this.emptyNeverOutput.update(output => [...output, `NEVER error: ${error}`]);
        }
      });

      // Clean up NEVER subscription after 2 seconds for demo
      setTimeout(() => {
        neverSub.unsubscribe();
        console.log('🛑 NEVER subscription manually unsubscribed');
        this.emptyNeverOutput.update(output => [...output, '🛑 NEVER subscription manually unsubscribed']);
        this.emptyNeverOutput.update(output => [...output, '✅ EMPTY & NEVER examples completed']);
      }, 2000);

      this.subscriptions.push(neverSub);
    }, 500);

    this.subscriptions.push(emptySub);
  }

  // Example 7: iif() - Conditional Observable Creation
  runConditionalExample() {
    console.log('\n🚀 Example 7: iif() - Conditional Observable Creation');
    
    this.conditionalOutput.set([]);
    
    // Function to demonstrate conditional creation
    const createConditionalObservable = (condition: boolean) => {
      return iif(
        () => condition,
        of('Condition is TRUE! 🎉'),
        of('Condition is FALSE! ❌')
      );
    };
    
    // Test with true condition
    console.log('🔍 Testing with TRUE condition...');
    this.conditionalOutput.update(output => [...output, '🔍 Testing with TRUE condition...']);
    
    const trueSub = createConditionalObservable(true).subscribe({
      next: (value) => {
        console.log(`✅ True result: ${value}`);
        this.conditionalOutput.update(output => [...output, `True: ${value}`]);
      }
    });
    
    // Test with false condition after a delay
    setTimeout(() => {
      console.log('🔍 Testing with FALSE condition...');
      this.conditionalOutput.update(output => [...output, '🔍 Testing with FALSE condition...']);
      
      const falseSub = createConditionalObservable(false).subscribe({
        next: (value) => {
          console.log(`❌ False result: ${value}`);
          this.conditionalOutput.update(output => [...output, `False: ${value}`]);
        }
      });
      
      this.subscriptions.push(falseSub);
    }, 500);
    
    // Dynamic condition based on current time
    setTimeout(() => {
      const isEvenSecond = new Date().getSeconds() % 2 === 0;
      console.log(`🕐 Testing with time-based condition (even second: ${isEvenSecond})...`);
      this.conditionalOutput.update(output => [...output, `🕐 Testing time-based condition (even second: ${isEvenSecond})...`]);
      
      const timeSub = iif(
        () => isEvenSecond,
        of(`Even second! Current time: ${new Date().toLocaleTimeString()}`),
        of(`Odd second! Current time: ${new Date().toLocaleTimeString()}`)
      ).subscribe({
        next: (value) => {
          console.log(`🕐 Time result: ${value}`);
          this.conditionalOutput.update(output => [...output, `Time: ${value}`]);
        },
        complete: () => {
          console.log('✅ Conditional examples completed');
          this.conditionalOutput.update(output => [...output, 'Completed']);
        }
      });

      this.subscriptions.push(timeSub);
    }, 1000);

    this.subscriptions.push(trueSub);
  }

  // Example 8: Real-world scenario - Data Loading
  runRealWorldExample() {
    console.log('\n🚀 Example 8: Real-world Scenario - Data Loading Simulation');
    
    this.realWorldOutput.set([]);
    
    // Simulate different data sources
    const mockApiData = ['User 1', 'User 2', 'User 3'];
    const mockCacheData = from(['Cached Item A', 'Cached Item B']);
    
    // Simulate loading from cache first
    console.log('💾 Loading from cache...');
    this.realWorldOutput.update(output => [...output, '💾 Loading from cache...']);
    
    const cacheSub = mockCacheData.subscribe({
      next: (item) => {
        console.log(`💾 Cache: ${item}`);
        this.realWorldOutput.update(output => [...output, `💾 Cache: ${item}`]);
      },
      complete: () => {
        console.log('💾 Cache loading completed');
        this.realWorldOutput.update(output => [...output, '💾 Cache loading completed']);
        
        // Then load from API
        setTimeout(() => {
          console.log('🌐 Loading from API...');
          this.realWorldOutput.update(output => [...output, '🌐 Loading from API...']);
          
          const apiSub = from(mockApiData).subscribe({
            next: (user) => {
              console.log(`🌐 API: ${user}`);
              this.realWorldOutput.update(output => [...output, `🌐 API: ${user}`]);
            },
            complete: () => {
              console.log('🌐 API loading completed');
              this.realWorldOutput.update(output => [...output, '🌐 API loading completed']);
              this.realWorldOutput.update(output => [...output, '✅ Real-world example completed']);
            }
          });
          
          this.subscriptions.push(apiSub);
        }, 1000);
      }
    });

    this.subscriptions.push(cacheSub);
  }

  // Clear all outputs
  clearOutputs() {
    this.ofOutput.set([]);
    this.fromOutput.set([]);
    this.intervalOutput.set([]);
    this.timerOutput.set([]);
    this.fromEventOutput.set([]);
    this.conditionalOutput.set([]);
    this.emptyNeverOutput.set([]);
    this.realWorldOutput.set([]);
    console.clear();
    console.log('🧹 Outputs cleared');
  }
}
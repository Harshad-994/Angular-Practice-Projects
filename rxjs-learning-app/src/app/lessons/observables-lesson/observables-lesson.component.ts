import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, interval, of, from, timer } from 'rxjs';

@Component({
  selector: 'app-observables-lesson',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './observables-lesson.component.html',
  styleUrls: ['./observables-lesson.component.css']
})
export class ObservablesLessonComponent implements OnInit, OnDestroy {
  // Signals for reactive UI updates
  protected readonly basicObservableOutput = signal<string[]>([]);
  protected readonly intervalOutput = signal<string[]>([]);
  protected readonly subscriptionStatus = signal<string>('Not subscribed');
  protected readonly isSubscribed = signal<boolean>(false);

  // Subscription management
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    console.log('🎓 Welcome to Observables & Subscriptions Lesson!');
    this.logTheory();
  }

  ngOnDestroy() {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('🧹 All subscriptions cleaned up');
  }

  private logTheory() {
    console.log(`
📚 THEORY: Observables & Subscriptions

🔍 What is an Observable?
- An Observable is a lazy Push collection of multiple values
- It's like a function that can return multiple values over time
- Observables are lazy - they don't execute until subscribed to
- They can emit 0, 1, or many values
- They can complete or error

🔍 What is a Subscription?
- A Subscription represents the execution of an Observable
- It's primarily useful for cancelling the execution
- Subscriptions have an unsubscribe() method to dispose of resources

🔍 Observable Lifecycle:
1. Creation: new Observable() or creation operators
2. Subscription: observable.subscribe()
3. Execution: Observable pushes values to observer
4. Disposal: subscription.unsubscribe()

🔍 Key Concepts:
- Observer: An object with next, error, and complete methods
- Producer: The source of values (HTTP request, user events, etc.)
- Consumer: The code that subscribes to the Observable
    `);
  }

  // Example 1: Basic Observable Creation and Subscription
  runBasicObservableExample() {
    console.log('\n🚀 Example 1: Basic Observable Creation');
    
    // Clear previous output
    this.basicObservableOutput.set([]);
    
    // Create a simple Observable
    const basicObservable = new Observable<number>(observer => {
      console.log('📡 Observable execution started!');
      
      // Emit some values
      observer.next(1);
      observer.next(2);
      observer.next(3);
      
      // Complete the Observable
      setTimeout(() => {
        observer.next(4);
        observer.complete();
        console.log('✅ Observable completed');
      }, 1000);
      
      // Return cleanup function
      return () => {
        console.log('🧹 Observable cleanup');
      };
    });

    // Subscribe to the Observable
    const subscription = basicObservable.subscribe({
      next: (value) => {
        console.log(`📥 Received value: ${value}`);
        this.basicObservableOutput.update(output => [...output, `Received: ${value}`]);
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.basicObservableOutput.update(output => [...output, `Error: ${error}`]);
      },
      complete: () => {
        console.log('🏁 Observable completed');
        this.basicObservableOutput.update(output => [...output, 'Observable completed']);
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 2: Subscription Management
  toggleIntervalSubscription() {
    if (this.isSubscribed()) {
      this.unsubscribeFromInterval();
    } else {
      this.subscribeToInterval();
    }
  }

  private subscribeToInterval() {
    console.log('\n🚀 Example 2: Interval Observable Subscription');
    
    // Clear previous output
    this.intervalOutput.set([]);
    
    // Create an interval Observable
    const intervalObservable = interval(1000); // Emit every 1 second
    
    const subscription = intervalObservable.subscribe({
      next: (value) => {
        console.log(`⏰ Interval tick: ${value}`);
        this.intervalOutput.update(output => [...output, `Tick ${value} at ${new Date().toLocaleTimeString()}`]);
      },
      error: (error) => {
        console.error('❌ Interval error:', error);
      }
    });

    this.subscriptions.push(subscription);
    this.isSubscribed.set(true);
    this.subscriptionStatus.set('Subscribed to interval');
    
    console.log('✅ Subscribed to interval Observable');
  }

  private unsubscribeFromInterval() {
    console.log('\n🛑 Unsubscribing from interval');
    
    // Find and unsubscribe from interval subscription
    const intervalSub = this.subscriptions.find(sub => !sub.closed);
    if (intervalSub) {
      intervalSub.unsubscribe();
      this.subscriptions = this.subscriptions.filter(sub => sub !== intervalSub);
    }
    
    this.isSubscribed.set(false);
    this.subscriptionStatus.set('Unsubscribed');
    
    console.log('🛑 Unsubscribed from interval Observable');
  }

  // Example 3: Observable from Array
  runArrayObservableExample() {
    console.log('\n🚀 Example 3: Observable from Array');
    
    const numbers = [10, 20, 30, 40, 50];
    const arrayObservable = from(numbers);
    
    const subscription = arrayObservable.subscribe({
      next: (value) => {
        console.log(`📦 Array value: ${value}`);
      },
      complete: () => {
        console.log('📦 Array Observable completed');
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 4: Observable with Error
  runErrorObservableExample() {
    console.log('\n🚀 Example 4: Observable with Error Handling');
    
    const errorObservable = new Observable<number>(observer => {
      observer.next(1);
      observer.next(2);
      
      // Simulate an error
      setTimeout(() => {
        observer.error(new Error('Something went wrong!'));
      }, 1000);
    });

    const subscription = errorObservable.subscribe({
      next: (value) => {
        console.log(`✅ Success value: ${value}`);
      },
      error: (error) => {
        console.error(`❌ Caught error: ${error.message}`);
      },
      complete: () => {
        console.log('🏁 This will not be called due to error');
      }
    });

    this.subscriptions.push(subscription);
  }

  // Example 5: Timer Observable
  runTimerExample() {
    console.log('\n🚀 Example 5: Timer Observable');
    
    // Timer that emits after 2 seconds, then every 1 second
    const timerObservable = timer(2000, 1000);
    
    const subscription = timerObservable.subscribe({
      next: (value) => {
        console.log(`⏲️ Timer value: ${value}`);
        
        // Unsubscribe after 5 emissions
        if (value >= 4) {
          subscription.unsubscribe();
          console.log('⏲️ Timer subscription ended');
        }
      }
    });

    this.subscriptions.push(subscription);
  }

  // Clear all outputs
  clearOutputs() {
    this.basicObservableOutput.set([]);
    this.intervalOutput.set([]);
    console.clear();
    console.log('🧹 Outputs cleared');
  }
}
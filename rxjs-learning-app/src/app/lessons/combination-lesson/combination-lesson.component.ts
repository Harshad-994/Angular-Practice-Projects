import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, Subject, of, from, interval, timer, forkJoin } from 'rxjs';
import { combineLatestWith, mergeWith, concatWith, raceWith, zipWith, startWith, withLatestFrom, takeUntil, take, delay, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-combination-lesson',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './combination-lesson.component.html',
  styleUrls: ['./combination-lesson.component.css']
})
export class CombinationLessonComponent implements OnInit, OnDestroy {
  // Signals for reactive UI updates
  protected readonly combineLatestOutput = signal<string[]>([]);
  protected readonly forkJoinOutput = signal<string[]>([]);
  protected readonly mergeWithOutput = signal<string[]>([]);
  protected readonly zipWithOutput = signal<string[]>([]);
  protected readonly raceWithOutput = signal<string[]>([]);

  // Subscription management
  private subscriptions: Subscription[] = [];
  private destroy$ = new Subject<void>();

  ngOnInit() {
    console.log('🎓 Welcome to Combination Operators Lesson!');
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
📚 THEORY: Combination Operators

🤝 What are Combination Operators?
- Combine multiple Observables into a single Observable
- Different strategies for combining emissions
- Essential for coordinating multiple data sources
- Modern operators use the "With" suffix (e.g., combineLatestWith)

🤝 Essential Modern Combination Operators:

1. COMBINELATEST - Latest Values from All Sources
   - Emits when any source Observable emits
   - Always uses the latest value from each source
   - Use for: Form validation, real-time dashboards
   - Pattern: All sources must emit at least once

2. FORKJOIN - Wait for All to Complete
   - Waits for all source Observables to complete
   - Emits the last value from each source
   - Use for: Parallel HTTP requests, batch operations
   - Pattern: Like Promise.all() for Observables

3. MERGEWITH - Merge Multiple Streams
   - Combines multiple Observables into one
   - Emits values as they arrive from any source
   - Use for: Event streams, notifications
   - Pattern: First-come, first-served

4. ZIPWITH - Pair Values by Index
   - Pairs values from sources by their emission order
   - Waits for all sources to emit before emitting pair
   - Use for: Coordinated data processing
   - Pattern: Synchronized emission

5. RACEWITH - First to Emit Wins
   - Subscribes to the first Observable that emits
   - Ignores other Observables after first emission
   - Use for: Timeout scenarios, fallback data
   - Pattern: Competition between sources

🚫 DEPRECATED (Avoid):
- combineLatest() - Use combineLatestWith()
- merge() - Use mergeWith()
- concat() - Use concatWith()
- race() - Use raceWith()
- zip() - Use zipWith()
    `);
  }

  // Example 1: combineLatestWith - Form Validation
  runCombineLatestExample() {
    console.log('\n🚀 Example 1: combineLatestWith - Form Validation');
    
    this.combineLatestOutput.set([]);
    
    // Simulate form fields
    const username$ = new Subject<string>();
    const email$ = new Subject<string>();
    const password$ = new Subject<string>();
    
    // Combine latest values from all form fields
    const formValidation$ = username$.pipe(
      combineLatestWith(email$, password$),
      map(([username, email, password]) => ({
        username,
        email,
        password,
        isValid: username.length >= 3 && email.includes('@') && password.length >= 6
      })),
      takeUntil(this.destroy$)
    );
    
    const subscription = formValidation$.subscribe({
      next: (form) => {
        const status = form.isValid ? '✅ Valid' : '❌ Invalid';
        console.log(`📝 Form: ${form.username}, ${form.email}, ${form.password} - ${status}`);
        this.combineLatestOutput.update(output => [...output, `${form.username} | ${form.email} | ${form.password} - ${status}`]);
      }
    });
    
    // Simulate user input
    const inputs = [
      { field: 'username', value: 'jo', delay: 500 },
      { field: 'email', value: 'jo@', delay: 1000 },
      { field: 'password', value: '123', delay: 1500 },
      { field: 'username', value: 'john', delay: 2000 },
      { field: 'email', value: 'john@example.com', delay: 2500 },
      { field: 'password', value: 'password123', delay: 3000 }
    ];
    
    inputs.forEach(input => {
      setTimeout(() => {
        console.log(`⌨️ User typed in ${input.field}: "${input.value}"`);
        this.combineLatestOutput.update(output => [...output, `⌨️ ${input.field}: "${input.value}"`]);
        
        if (input.field === 'username') username$.next(input.value);
        if (input.field === 'email') email$.next(input.value);
        if (input.field === 'password') password$.next(input.value);
      }, input.delay);
    });
    
    setTimeout(() => {
      console.log('✅ Form validation example completed');
      this.combineLatestOutput.update(output => [...output, 'Form validation completed']);
    }, 3500);
    
    this.subscriptions.push(subscription);
  }

  // Example 2: forkJoin - Parallel HTTP Requests
  runForkJoinExample() {
    console.log('\n🚀 Example 2: forkJoin - Parallel HTTP Requests');
    
    this.forkJoinOutput.set([]);
    
    // Simulate HTTP requests with different response times
    const getUserProfile = () => {
      console.log('🌐 Fetching user profile...');
      this.forkJoinOutput.update(output => [...output, '🌐 Fetching user profile...']);
      return of({ id: 1, name: 'John Doe', email: 'john@example.com' }).pipe(
        delay(1200),
        tap(() => {
          console.log('✅ User profile loaded');
          this.forkJoinOutput.update(output => [...output, '✅ User profile loaded']);
        })
      );
    };
    
    const getUserPosts = () => {
      console.log('📝 Fetching user posts...');
      this.forkJoinOutput.update(output => [...output, '📝 Fetching user posts...']);
      return of([
        { id: 1, title: 'First Post', content: 'Hello World' },
        { id: 2, title: 'Second Post', content: 'Learning RxJS' }
      ]).pipe(
        delay(800),
        tap(() => {
          console.log('✅ User posts loaded');
          this.forkJoinOutput.update(output => [...output, '✅ User posts loaded']);
        })
      );
    };
    
    const getUserSettings = () => {
      console.log('⚙️ Fetching user settings...');
      this.forkJoinOutput.update(output => [...output, '⚙️ Fetching user settings...']);
      return of({ theme: 'dark', notifications: true, language: 'en' }).pipe(
        delay(600),
        tap(() => {
          console.log('✅ User settings loaded');
          this.forkJoinOutput.update(output => [...output, '✅ User settings loaded']);
        })
      );
    };
    
    // Use forkJoin to wait for all requests to complete
    const allUserData$ = forkJoin({
      profile: getUserProfile(),
      posts: getUserPosts(),
      settings: getUserSettings()
    }).pipe(takeUntil(this.destroy$));
    
    const subscription = allUserData$.subscribe({
      next: (data) => {
        console.log('🎉 All data loaded:', data);
        this.forkJoinOutput.update(output => [...output, `🎉 All data loaded: ${data.profile.name}, ${data.posts.length} posts, ${data.settings.theme} theme`]);
      },
      complete: () => {
        console.log('✅ forkJoin example completed');
        this.forkJoinOutput.update(output => [...output, 'All requests completed']);
      }
    });
    
    this.subscriptions.push(subscription);
  }

  // Example 3: mergeWith - Event Streams
  runMergeWithExample() {
    console.log('\n🚀 Example 3: mergeWith - Merge Event Streams');
    
    this.mergeWithOutput.set([]);
    
    // Simulate different event sources
    const buttonClicks$ = interval(1500).pipe(
      take(4),
      map(i => ({ type: 'click', data: `Button ${i + 1}` }))
    );
    
    const keyPresses$ = interval(1000).pipe(
      take(5),
      map(i => ({ type: 'keypress', data: `Key ${String.fromCharCode(65 + i)}` }))
    );
    
    const notifications$ = interval(2000).pipe(
      take(3),
      map(i => ({ type: 'notification', data: `Alert ${i + 1}` }))
    );
    
    // Merge all event streams
    const allEvents$ = buttonClicks$.pipe(
      mergeWith(keyPresses$, notifications$),
      takeUntil(this.destroy$)
    );
    
    const subscription = allEvents$.subscribe({
      next: (event) => {
        console.log(`📨 Event: ${event.type} - ${event.data}`);
        this.mergeWithOutput.update(output => [...output, `📨 ${event.type}: ${event.data}`]);
      },
      complete: () => {
        console.log('✅ All event streams completed');
        this.mergeWithOutput.update(output => [...output, 'All events completed']);
      }
    });
    
    this.subscriptions.push(subscription);
  }

  // Example 4: zipWith - Coordinate Data Processing
  runZipWithExample() {
    console.log('\n🚀 Example 4: zipWith - Coordinate Data Processing');
    
    this.zipWithOutput.set([]);
    
    // Simulate data sources that need to be processed together
    const names$ = of('Alice', 'Bob', 'Charlie', 'Diana').pipe(
      concatWith(of('Eve').pipe(delay(2000))) // Add delay to show waiting behavior
    );
    
    const ages$ = of(25, 30, 35, 28, 32);
    const cities$ = of('New York', 'London', 'Tokyo', 'Paris', 'Sydney');
    
    // Zip streams together - waits for all sources to emit
    const users$ = names$.pipe(
      zipWith(ages$, cities$),
      map(([name, age, city]) => ({ name, age, city })),
      takeUntil(this.destroy$)
    );
    
    const subscription = users$.subscribe({
      next: (user) => {
        console.log(`👤 User: ${user.name}, ${user.age} years old, from ${user.city}`);
        this.zipWithOutput.update(output => [...output, `👤 ${user.name}, ${user.age}, ${user.city}`]);
      },
      complete: () => {
        console.log('✅ User processing completed');
        this.zipWithOutput.update(output => [...output, 'User processing completed']);
      }
    });
    
    this.subscriptions.push(subscription);
  }

  // Example 5: raceWith - First to Respond Wins
  runRaceWithExample() {
    console.log('\n🚀 Example 5: raceWith - First to Respond Wins');
    
    this.raceWithOutput.set([]);
    
    // Simulate different data sources with varying response times
    const primaryAPI$ = of('Primary API Data').pipe(
      delay(Math.random() * 2000 + 1000), // Random delay 1-3 seconds
      tap(() => {
        console.log('🥇 Primary API responded first');
        this.raceWithOutput.update(output => [...output, '🥇 Primary API responded']);
      })
    );
    
    const backupAPI$ = of('Backup API Data').pipe(
      delay(Math.random() * 2000 + 1000), // Random delay 1-3 seconds
      tap(() => {
        console.log('🥈 Backup API responded first');
        this.raceWithOutput.update(output => [...output, '🥈 Backup API responded']);
      })
    );
    
    const cacheData$ = of('Cached Data').pipe(
      delay(Math.random() * 1000 + 500), // Random delay 0.5-1.5 seconds
      tap(() => {
        console.log('⚡ Cache responded first');
        this.raceWithOutput.update(output => [...output, '⚡ Cache responded']);
      })
    );
    
    console.log('🏁 Starting race between data sources...');
    this.raceWithOutput.update(output => [...output, '🏁 Race started...']);
    
    // Race between all data sources
    const fastestData$ = primaryAPI$.pipe(
      raceWith(backupAPI$, cacheData$),
      takeUntil(this.destroy$)
    );
    
    const subscription = fastestData$.subscribe({
      next: (data) => {
        console.log(`🏆 Winner: ${data}`);
        this.raceWithOutput.update(output => [...output, `🏆 Winner: ${data}`]);
      },
      complete: () => {
        console.log('✅ Race completed');
        this.raceWithOutput.update(output => [...output, 'Race completed']);
      }
    });
    
    this.subscriptions.push(subscription);
  }

  // Example 6: Real-world Dashboard Scenario
  runRealWorldExample() {
    console.log('\n🚀 Example 6: Real-world Dashboard - Multiple Data Sources');
    
    // Simulate dashboard data sources
    const userStats$ = timer(500).pipe(
      map(() => ({ activeUsers: 1250, newSignups: 45 })),
      tap(() => console.log('📊 User stats loaded'))
    );
    
    const salesData$ = timer(800).pipe(
      map(() => ({ revenue: 15750, orders: 89 })),
      tap(() => console.log('💰 Sales data loaded'))
    );
    
    const systemHealth$ = interval(1000).pipe(
      take(3),
      map(i => ({ cpu: 45 + i * 5, memory: 60 + i * 3, status: 'healthy' })),
      tap(health => console.log(`🖥️ System health: CPU ${health.cpu}%, Memory ${health.memory}%`))
    );
    
    // Combine for dashboard
    const dashboardData$ = userStats$.pipe(
      combineLatestWith(salesData$, systemHealth$),
      map(([users, sales, system]) => ({
        users,
        sales,
        system,
        lastUpdated: new Date().toLocaleTimeString()
      })),
      takeUntil(this.destroy$)
    );
    
    const subscription = dashboardData$.subscribe({
      next: (dashboard) => {
        console.log(`📈 Dashboard updated at ${dashboard.lastUpdated}:`, {
          activeUsers: dashboard.users.activeUsers,
          revenue: dashboard.sales.revenue,
          systemCPU: dashboard.system.cpu
        });
      }
    });
    
    this.subscriptions.push(subscription);
  }

  // Clear all outputs
  clearOutputs() {
    this.combineLatestOutput.set([]);
    this.forkJoinOutput.set([]);
    this.mergeWithOutput.set([]);
    this.zipWithOutput.set([]);
    this.raceWithOutput.set([]);
    console.clear();
    console.log('🧹 Outputs cleared');
  }
}
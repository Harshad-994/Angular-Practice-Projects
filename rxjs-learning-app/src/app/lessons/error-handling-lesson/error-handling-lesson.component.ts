import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, Subject, of, from, interval, throwError, EMPTY, timer } from 'rxjs';
import { catchError, retry, retryWhen, finalize, tap, map, delay, take, takeUntil, switchMap, delayWhen } from 'rxjs/operators';

@Component({
  selector: 'app-error-handling-lesson',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-handling-lesson.component.html',
  styleUrls: ['./error-handling-lesson.component.css']
})
export class ErrorHandlingLessonComponent implements OnInit, OnDestroy {
  // Signals for reactive UI updates
  protected readonly catchErrorOutput = signal<string[]>([]);
  protected readonly retryOutput = signal<string[]>([]);
  protected readonly finalizeOutput = signal<string[]>([]);
  protected readonly strategiesOutput = signal<string[]>([]);
  protected readonly realWorldOutput = signal<string[]>([]);

  // Subscription management
  private subscriptions: Subscription[] = [];
  private destroy$ = new Subject<void>();

  ngOnInit() {
    console.log('🎓 Welcome to Error Handling Lesson!');
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
📚 THEORY: Error Handling in RxJS

❌ Why Error Handling Matters:
- Errors terminate Observable streams
- Unhandled errors can crash your application
- Users expect graceful error recovery
- Network requests often fail and need retry logic

❌ Essential Error Handling Operators:

1. CATCHERROR - Handle Errors Gracefully
   - Catches errors and returns a fallback Observable
   - Prevents the stream from terminating
   - Use for: Fallback values, error logging, user notifications
   - Pattern: Catch and recover

2. RETRY - Retry Failed Operations
   - Automatically retries the source Observable on error
   - Can specify number of retry attempts
   - Use for: Network requests, temporary failures
   - Pattern: Try again automatically

3. FINALIZE - Cleanup Actions
   - Executes cleanup code when Observable completes or errors
   - Always runs regardless of success or failure
   - Use for: Resource cleanup, logging, UI state reset
   - Pattern: Finally block for Observables

4. RETRYWHEN - Advanced Retry Logic (Modern approach)
   - Custom retry logic with delays and conditions
   - More control than simple retry
   - Use for: Exponential backoff, conditional retries
   - Pattern: Smart retry strategies

❌ Error Handling Best Practices:
- Always handle errors in HTTP requests
- Use catchError to provide fallback values
- Implement retry logic for transient failures
- Log errors for debugging
- Show user-friendly error messages
- Clean up resources in finalize
    `);
  }

  // Example 1: catchError - Basic Error Handling
  runCatchErrorExample() {
    console.log('\n🚀 Example 1: catchError - Basic Error Handling');
    
    this.catchErrorOutput.set([]);
    
    // Simulate API calls that might fail
    const apiCall = (id: number): Observable<any> => {
      console.log(`🌐 Making API call for ID: ${id}`);
      this.catchErrorOutput.update(output => [...output, `🌐 API call: ID ${id}`]);
      
      if (id === 2) {
        // Simulate network error
        return throwError(() => new Error('Network timeout'));
      } else if (id === 4) {
        // Simulate server error
        return throwError(() => new Error('Server error 500'));
      } else {
        // Successful response
        return of({ id, data: `Data for ${id}` }).pipe(delay(500));
      }
    };
    
    // Test different error handling strategies
    const ids = [1, 2, 3, 4, 5];
    
    ids.forEach((id, index) => {
      setTimeout(() => {
        const apiCall$ = apiCall(id).pipe(
          catchError(error => {
            console.error(`❌ Error for ID ${id}: ${error.message}`);
            this.catchErrorOutput.update(output => [...output, `❌ Error ID ${id}: ${error.message}`]);
            
            // Return fallback data
            const fallback = { id, data: `Fallback data for ${id}`, fromCache: true };
            console.log(`🔄 Using fallback for ID ${id}`);
            this.catchErrorOutput.update(output => [...output, `🔄 Fallback ID ${id}`]);
            
            return of(fallback);
          }),
          takeUntil(this.destroy$)
        );
        
        const subscription = apiCall$.subscribe({
          next: (data) => {
            const source = data.fromCache ? 'cache' : 'API';
            console.log(`✅ Success ID ${id} from ${source}:`, data);
            this.catchErrorOutput.update(output => [...output, `✅ Success ID ${id} (${source})`]);
          },
          error: (error) => {
            // This shouldn't happen due to catchError
            console.error(`💥 Unhandled error: ${error.message}`);
          }
        });
        
        this.subscriptions.push(subscription);
      }, index * 800);
    });
    
    setTimeout(() => {
      console.log('✅ catchError example completed');
      this.catchErrorOutput.update(output => [...output, 'Error handling completed']);
    }, 5000);
  }

  // Example 2: retry - Automatic Retry Logic
  runRetryExample() {
    console.log('\n🚀 Example 2: retry - Automatic Retry Logic');
    
    this.retryOutput.set([]);
    
    let attemptCount = 0;
    
    // Simulate unreliable API that fails first few times
    const unreliableAPI = (): Observable<any> => {
      attemptCount++;
      console.log(`🔄 Attempt ${attemptCount}`);
      this.retryOutput.update(output => [...output, `🔄 Attempt ${attemptCount}`]);
      
      if (attemptCount < 3) {
        // Fail first 2 attempts
        return throwError(() => new Error(`Attempt ${attemptCount} failed`));
      } else {
        // Succeed on 3rd attempt
        return of({ success: true, attempt: attemptCount }).pipe(delay(300));
      }
    };
    
    const apiWithRetry$ = unreliableAPI().pipe(
      retry(3), // Retry up to 3 times
      catchError(error => {
        console.error(`❌ All retries failed: ${error.message}`);
        this.retryOutput.update(output => [...output, `❌ All retries failed`]);
        return of({ success: false, error: error.message });
      }),
      takeUntil(this.destroy$)
    );
    
    const subscription = apiWithRetry$.subscribe({
      next: (result) => {
        if (result.success) {
          console.log(`✅ Success after ${result.attempt} attempts`);
          this.retryOutput.update(output => [...output, `✅ Success after ${result.attempt} attempts`]);
        } else {
          console.log(`💥 Final failure: ${result.error}`);
          this.retryOutput.update(output => [...output, `💥 Final failure`]);
        }
      },
      complete: () => {
        console.log('✅ Retry example completed');
        this.retryOutput.update(output => [...output, 'Retry example completed']);
      }
    });
    
    this.subscriptions.push(subscription);
  }

  // Example 3: finalize - Cleanup Actions
  runFinalizeExample() {
    console.log('\n🚀 Example 3: finalize - Cleanup Actions');
    
    this.finalizeOutput.set([]);
    
    // Simulate operations that need cleanup
    const operationWithCleanup = (shouldFail: boolean): Observable<any> => {
      console.log('🚀 Starting operation...');
      this.finalizeOutput.update(output => [...output, '🚀 Starting operation...']);
      
      return new Observable(observer => {
        console.log('📊 Setting up resources...');
        this.finalizeOutput.update(output => [...output, '📊 Setting up resources...']);
        
        const timeoutId = setTimeout(() => {
          if (shouldFail) {
            observer.error(new Error('Operation failed'));
          } else {
            observer.next({ result: 'Operation successful' });
            observer.complete();
          }
        }, 1000);
        
        // Cleanup function
        return () => {
          console.log('🧹 Cleaning up timeout...');
          clearTimeout(timeoutId);
        };
      }).pipe(
        finalize(() => {
          console.log('🏁 Finalize: Cleaning up resources');
          this.finalizeOutput.update(output => [...output, '🏁 Cleanup completed']);
        })
      );
    };
    
    // Test successful operation
    console.log('Testing successful operation:');
    this.finalizeOutput.update(output => [...output, 'Testing successful operation:']);
    
    const successSub = operationWithCleanup(false).subscribe({
      next: (result) => {
        console.log(`✅ Success: ${result.result}`);
        this.finalizeOutput.update(output => [...output, `✅ Success: ${result.result}`]);
      },
      error: (error) => {
        console.error(`❌ Error: ${error.message}`);
        this.finalizeOutput.update(output => [...output, `❌ Error: ${error.message}`]);
      },
      complete: () => {
        console.log('✅ Operation completed');
        this.finalizeOutput.update(output => [...output, '✅ Operation completed']);
        
        // Test failed operation after successful one
        setTimeout(() => {
          console.log('\nTesting failed operation:');
          this.finalizeOutput.update(output => [...output, 'Testing failed operation:']);
          
          const failSub = operationWithCleanup(true).subscribe({
            next: (result) => {
              console.log(`✅ Success: ${result.result}`);
              this.finalizeOutput.update(output => [...output, `✅ Success: ${result.result}`]);
            },
            error: (error) => {
              console.error(`❌ Error: ${error.message}`);
              this.finalizeOutput.update(output => [...output, `❌ Error: ${error.message}`]);
            },
            complete: () => {
              console.log('✅ Failed operation completed');
              this.finalizeOutput.update(output => [...output, 'Failed operation completed']);
            }
          });
          
          this.subscriptions.push(failSub);
        }, 1500);
      }
    });
    
    this.subscriptions.push(successSub);
  }

  // Example 4: Advanced Error Handling Strategies
  runStrategiesExample() {
    console.log('\n🚀 Example 4: Advanced Error Handling Strategies');
    
    this.strategiesOutput.set([]);
    
    // Strategy 1: Exponential Backoff Retry
    const exponentialBackoffRetry = (maxRetries: number) => {
      return retryWhen(errors =>
        errors.pipe(
          tap(error => {
            console.log(`⏳ Retrying after error: ${error.message}`);
            this.strategiesOutput.update(output => [...output, `⏳ Retrying: ${error.message}`]);
          }),
          delayWhen((error, index) => {
            const delay = Math.pow(2, index) * 1000; // Exponential backoff
            console.log(`⏰ Waiting ${delay}ms before retry ${index + 1}`);
            this.strategiesOutput.update(output => [...output, `⏰ Wait ${delay}ms (retry ${index + 1})`]);
            return timer(delay);
          }),
          take(maxRetries)
        )
      );
    };
    
    // Strategy 2: Fallback Chain
    const primaryAPI = () => throwError(() => new Error('Primary API failed'));
    const backupAPI = () => throwError(() => new Error('Backup API failed'));
    const cacheAPI = () => of({ data: 'Cached data', source: 'cache' });
    
    // Test exponential backoff
    let attemptCount = 0;
    const unreliableService = () => {
      attemptCount++;
      if (attemptCount < 3) {
        return throwError(() => new Error(`Service unavailable (attempt ${attemptCount})`));
      }
      return of({ data: 'Service data', attempt: attemptCount });
    };
    
    console.log('🔄 Testing exponential backoff retry...');
    this.strategiesOutput.update(output => [...output, '🔄 Testing exponential backoff...']);
    
    const backoffSub = unreliableService().pipe(
      exponentialBackoffRetry(2),
      catchError(error => {
        console.log('❌ Exponential backoff failed, using fallback');
        this.strategiesOutput.update(output => [...output, '❌ Backoff failed, using fallback']);
        return of({ data: 'Fallback data', source: 'fallback' });
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result: any) => {
        console.log(`✅ Backoff result: ${result.data} (${result.source || 'service'})`);
        this.strategiesOutput.update(output => [...output, `✅ Result: ${result.data}`]);
      }
    });
    
    // Test fallback chain
    setTimeout(() => {
      console.log('\n🔗 Testing fallback chain...');
      this.strategiesOutput.update(output => [...output, '🔗 Testing fallback chain...']);
      
      const fallbackSub = primaryAPI().pipe(
        catchError(error => {
          console.log('❌ Primary failed, trying backup...');
          this.strategiesOutput.update(output => [...output, '❌ Primary failed, trying backup...']);
          return backupAPI();
        }),
        catchError(error => {
          console.log('❌ Backup failed, using cache...');
          this.strategiesOutput.update(output => [...output, '❌ Backup failed, using cache...']);
          return cacheAPI();
        }),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (result) => {
          console.log(`✅ Fallback result: ${result.data} from ${result.source}`);
          this.strategiesOutput.update(output => [...output, `✅ Fallback: ${result.data} (${result.source})`]);
        }
      });
      
      this.subscriptions.push(fallbackSub);
    }, 3000);
    
    this.subscriptions.push(backoffSub);
  }

  // Example 5: Real-world HTTP Error Handling
  runRealWorldExample() {
    console.log('\n🚀 Example 5: Real-world HTTP Error Handling');
    
    this.realWorldOutput.set([]);
    
    // Simulate different types of HTTP errors
    const httpRequest = (url: string): Observable<any> => {
      console.log(`🌐 HTTP GET ${url}`);
      this.realWorldOutput.update(output => [...output, `🌐 GET ${url}`]);
      
      // Simulate different error scenarios
      if (url.includes('timeout')) {
        return throwError(() => ({ status: 0, message: 'Request timeout' }));
      } else if (url.includes('unauthorized')) {
        return throwError(() => ({ status: 401, message: 'Unauthorized' }));
      } else if (url.includes('notfound')) {
        return throwError(() => ({ status: 404, message: 'Not found' }));
      } else if (url.includes('server-error')) {
        return throwError(() => ({ status: 500, message: 'Internal server error' }));
      } else {
        return of({ data: 'Success data', status: 200 }).pipe(delay(300));
      }
    };
    
    // Comprehensive HTTP error handling
    const handleHttpError = (error: any): Observable<any> => {
      console.log(`❌ HTTP Error ${error.status}: ${error.message}`);
      this.realWorldOutput.update(output => [...output, `❌ ${error.status}: ${error.message}`]);
      
      switch (error.status) {
        case 0: // Network error
          console.log('🔄 Network error, retrying...');
          this.realWorldOutput.update(output => [...output, '🔄 Network error, retrying...']);
          return EMPTY; // Will trigger retry
          
        case 401: // Unauthorized
          console.log('🔐 Unauthorized, redirecting to login...');
          this.realWorldOutput.update(output => [...output, '🔐 Redirecting to login...']);
          return of({ error: 'Please log in again', redirect: '/login' });
          
        case 404: // Not found
          console.log('📭 Resource not found, using empty result...');
          this.realWorldOutput.update(output => [...output, '📭 Resource not found']);
          return of({ data: null, message: 'Resource not found' });
          
        case 500: // Server error
          console.log('🚨 Server error, using cached data...');
          this.realWorldOutput.update(output => [...output, '🚨 Server error, using cache']);
          return of({ data: 'Cached data', fromCache: true });
          
        default:
          console.log('❓ Unknown error, using fallback...');
          this.realWorldOutput.update(output => [...output, '❓ Unknown error']);
          return of({ error: 'Something went wrong', data: null });
      }
    };
    
    // Test different error scenarios
    const testUrls = [
      '/api/success',
      '/api/timeout',
      '/api/unauthorized',
      '/api/notfound',
      '/api/server-error'
    ];
    
    testUrls.forEach((url, index) => {
      setTimeout(() => {
        const request$ = httpRequest(url).pipe(
          retry({ count: 2, delay: 1000 }), // Modern retry with config
          catchError(handleHttpError),
          finalize(() => {
            console.log(`🏁 Request to ${url} completed`);
            this.realWorldOutput.update(output => [...output, `🏁 ${url} completed`]);
          }),
          takeUntil(this.destroy$)
        );
        
        const subscription = request$.subscribe({
          next: (result) => {
            if (result.error) {
              console.log(`⚠️ Handled error for ${url}: ${result.error}`);
              this.realWorldOutput.update(output => [...output, `⚠️ ${url}: ${result.error}`]);
            } else {
              const source = result.fromCache ? ' (cached)' : '';
              console.log(`✅ Success for ${url}: ${result.data}${source}`);
              this.realWorldOutput.update(output => [...output, `✅ ${url}: Success${source}`]);
            }
          }
        });
        
        this.subscriptions.push(subscription);
      }, index * 1000);
    });
    
    setTimeout(() => {
      console.log('✅ Real-world error handling completed');
      this.realWorldOutput.update(output => [...output, 'All HTTP requests completed']);
    }, 6000);
  }

  // Clear all outputs
  clearOutputs() {
    this.catchErrorOutput.set([]);
    this.retryOutput.set([]);
    this.finalizeOutput.set([]);
    this.strategiesOutput.set([]);
    this.realWorldOutput.set([]);
    console.clear();
    console.log('🧹 Outputs cleared');
  }
}
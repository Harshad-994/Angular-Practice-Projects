import { BehaviorSubject } from 'rxjs';

export class LoggingService {
  private logs: string[] = ['temp log'];
  logs$ = new BehaviorSubject<string[]>([]);
  logMessage(msg: string) {
    this.logs.push(msg);
    console.log(msg);
    this.logs$.next(this.logs);
  }

  get allLogs() {
    return [...this.logs];
  }
}

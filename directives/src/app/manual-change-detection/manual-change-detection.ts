import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { loggingToken } from '../app.config';

@Component({
  selector: 'app-manual-change-detection',
  templateUrl: './manual-change-detection.html',
  styleUrl: './manual-change-detection.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualChangeDetection implements OnInit {
  private loggingService = inject(loggingToken);
  allLogs = this.loggingService.allLogs;
  private cdRef = inject(ChangeDetectorRef);
  onDestroy = inject(DestroyRef);
  ngOnInit(): void {
    const subscription = this.loggingService.logs$.subscribe((current) => {
      this.allLogs = current;
      this.cdRef.markForCheck();
    });
    this.onDestroy.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}

import { Component, inject } from '@angular/core';
import { loggingToken } from '../app.config';

@Component({
  selector: 'app-link',
  imports: [],
  templateUrl: './link.html',
  styleUrl: './link.css',
})
export class Link {
  private loggingService = inject(loggingToken);
  allLogs: string[] = this.loggingService.allLogs;
}

import { Component, inject, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { type TypeOfTask } from './task.model';
import { Card } from '../../shared/card/card';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-task',
  imports: [Card, DatePipe],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {
  @Input({ required: true }) task!: TypeOfTask;
  // private destroyRef = inject(DestroyRef);
  private taskService = inject(TasksService);

  constructor() {
    // this.destroyRef.onDestroy(() => {
    //   console.log('the task component removed!');
    // });
  }

  onCompleteTask() {
    this.taskService.deleteTask(this.task.id);
  }
}

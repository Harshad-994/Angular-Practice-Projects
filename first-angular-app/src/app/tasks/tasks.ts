import { Component, Input } from '@angular/core';
import { Task } from './task/task';
import { Addtask } from './addtask/addtask';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  imports: [Task, Addtask],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  @Input({ required: true }) username!: string;
  @Input({ required: true }) userId!: string;
  showAddTaskForm = false;

  constructor(private taskService: TasksService) {}

  get selectedUsersTasks() {
    return this.taskService.getUserTasks(this.userId);
  }

  onClickingAddTask() {
    this.showAddTaskForm = true;
  }

  closeForm() {
    this.showAddTaskForm = false;
  }
}

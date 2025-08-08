import { Component, Input } from '@angular/core';
import { Task } from './task/task';
import { Addtask } from './addtask/addtask';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  imports: [Task, Addtask],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
  // host: {
  //   '(click)': 'onClick()',
  //   class: 'temp',
  // },
})
export class Tasks {
  @Input({ required: true }) username!: string;
  @Input({ required: true }) userId!: string;

  // @HostListener('click') temp() {
  //   console.log('hello');
  // }
  showAddTaskForm = false;

  constructor(private taskService: TasksService) {}
  // ngDoCheck(): void {
  //   if (this.showAddTaskForm) {
  //     console.log('form is visible');
  //   } else {
  //     console.log('form is not visible.');
  //   }
  // }

  get selectedUsersTasks() {
    return this.taskService.getUserTasks(this.userId);
  }

  onClickingAddTask() {
    this.showAddTaskForm = true;
  }

  closeForm() {
    this.showAddTaskForm = false;
  }

  // onClick() {
  //   console.log('clicked!');
  // }

  // ngOnInit() {
  //   console.log('tasks component rendered!');
  // }
}

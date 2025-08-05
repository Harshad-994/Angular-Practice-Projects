import { Injectable } from '@angular/core';
import { type InputTaskData } from './task/task.model';

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.tasks = JSON.parse(tasks);
    }
  }

  private tasks = [
    {
      id: 't1',
      userId: 'u1',
      title: 'reading',
      description: 'Reading a book for a few minutes',
      dueDate: '2025-07-15',
    },
    {
      id: 't2',
      userId: 'u1',
      title: 'writing',
      description: 'Writing a journal entry',
      dueDate: '2025-07-16',
    },
    {
      id: 't3',
      userId: 'u2',
      title: 'exercise',
      description: 'Doing a 30-minute workout',
      dueDate: '2025-07-17',
    },
    {
      id: 't4',
      userId: 'u3',
      title: 'cooking',
      description: 'Preparing a healthy meal',
      dueDate: '2025-07-18',
    },
  ];

  getUserTasks(userId: string) {
    return this.tasks.filter((task) => task.userId === userId);
  }

  addTask(taskData: InputTaskData, userId: string) {
    const task = {
      ...taskData,
      userId: userId,
      id: `${new Date().getTime()}`,
    };
    this.tasks.push(task);
    this.saveTasks();
  }

  deleteTask(taskId: string) {
    this.tasks = this.tasks.filter((task) => task.id != taskId);
    this.saveTasks();
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}

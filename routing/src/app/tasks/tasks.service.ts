import { afterNextRender, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor() {
    afterNextRender(() => {
      const tasks = localStorage.getItem('tasks');
      if (tasks) {
        this.tasks = JSON.parse(tasks);
      }
    });
  }

  private tasks = [
    {
      id: 't1',
      userId: '1',
      title: 'reading',
      description: 'Reading a book for a few minutes',
      dueDate: '2025-07-15',
    },
    {
      id: 't2',
      userId: '1',
      title: 'writing',
      description: 'Writing a journal entry',
      dueDate: '2025-07-16',
    },
    {
      id: 't3',
      userId: '2',
      title: 'exercise',
      description: 'Doing a 30-minute workout',
      dueDate: '2025-07-17',
    },
    {
      id: 't4',
      userId: '3',
      title: 'cooking',
      description: 'Preparing a healthy meal',
      dueDate: '2025-07-18',
    },
  ];

  getUserTasks(userId: string) {
    return this.tasks.filter((task) => task.userId === userId);
  }
}

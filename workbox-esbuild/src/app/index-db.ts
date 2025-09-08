import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class IndexDbService {
  private db: Promise<IDBPDatabase>;

  constructor() {
    this.db = openDB('todo-db', 1, {
      upgrade(db) {
        const store = db.createObjectStore('pendingTodos', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      },
    });
  }

  async addPendingTodo(task: string) {
    try {
      const db = await this.db;
      const tx = db.transaction('pendingTodos', 'readwrite');
      const store = tx.objectStore('pendingTodos');
      await store.add({ task, timestamp: Date.now() });
      await tx.done;
    } catch (error) {
      console.log('Adding failed in IndexDB : ', error);
    }
  }

  async getPendingTodos() {
    try {
      const db = this.db;
      return (await db).getAll('pendingTodos');
    } catch (error) {
      console.log('Retrieving failed in IndexDB : ', error);
      return [];
    }
  }

  async clearPendingTodos() {
    try {
      const db = await this.db;
      await db.clear('pendingTodos');
    } catch (error) {
      console.log('Error in clearing the IndexDB : ', error);
    }
  }

  async getRecentPendingTodos(days: number = 1) {
    try {
      const db = await this.db;
      const tx = db.transaction('pendingTodos', 'readonly');
      const store = tx.objectStore('pendingTodos');
      const index = store.index('timestamp');
      const range = IDBKeyRange.lowerBound(
        Date.now() - days * 24 * 60 * 60 * 1000
      );
      const recent = await index.getAll(range);
      await tx.done;
      return recent;
    } catch (error) {
      console.log('Error in retrieving pending todos : ', error);
      return [];
    }
  }
}

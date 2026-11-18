// Test-only adapter: exposes Node's built-in sqlite through the same Database
// interface the app uses, so repository tests run real SQL in memory.
import { DatabaseSync } from 'node:sqlite';

import type { Database, SQLiteBindValue } from '../types';

export function openTestDatabase(): Database & { close(): void } {
  const db = new DatabaseSync(':memory:');

  return {
    async execAsync(source) {
      db.exec(source);
    },
    async runAsync(source, params: SQLiteBindValue[]) {
      const result = db.prepare(source).run(...params);
      return { changes: Number(result.changes), lastInsertRowId: Number(result.lastInsertRowid) };
    },
    async getFirstAsync<T>(source: string, params: SQLiteBindValue[]) {
      const row = db.prepare(source).get(...params);
      return row === undefined ? null : ({ ...row } as T);
    },
    async getAllAsync<T>(source: string, params: SQLiteBindValue[]) {
      return db.prepare(source).all(...params).map((row: object) => ({ ...row }) as T);
    },
    async withTransactionAsync(task) {
      db.exec('BEGIN');
      try {
        await task();
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
    close() {
      db.close();
    },
  };
}

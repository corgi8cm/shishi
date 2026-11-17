/**
 * The subset of expo-sqlite's SQLiteDatabase that the repositories use.
 * Keeping it narrow lets tests run the same SQL against Node's built-in sqlite.
 */
export type SQLiteBindValue = string | number | null;

export interface RunResult {
  changes: number;
  lastInsertRowId: number;
}

export interface Database {
  execAsync(source: string): Promise<void>;
  runAsync(source: string, params: SQLiteBindValue[]): Promise<RunResult>;
  getFirstAsync<T>(source: string, params: SQLiteBindValue[]): Promise<T | null>;
  getAllAsync<T>(source: string, params: SQLiteBindValue[]): Promise<T[]>;
  withTransactionAsync(task: () => Promise<void>): Promise<void>;
}

import type { Database } from './types';

export const DATABASE_NAME = 'shishi.db';

/**
 * Migrations in order. Migration at index i upgrades user_version i → i + 1.
 * Never edit or reorder a released migration; only append new ones.
 */
export const migrations: readonly string[] = [
  // 1: entries
  `
  CREATE TABLE entries (
    id TEXT PRIMARY KEY NOT NULL,
    occurred_at INTEGER NOT NULL,
    content TEXT NOT NULL,
    mood INTEGER NOT NULL CHECK (mood BETWEEN 1 AND 5),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX idx_entries_occurred_at ON entries (occurred_at);
  `,
];

export const LATEST_VERSION = migrations.length;

export async function getSchemaVersion(db: Database): Promise<number> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version', []);
  return row?.user_version ?? 0;
}

/** Brings the database schema up to LATEST_VERSION. Safe to call on every launch. */
export async function migrate(db: Database): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

  const current = await getSchemaVersion(db);
  if (current > LATEST_VERSION) {
    throw new Error(
      `資料庫版本 ${current} 比 App 支援的版本 ${LATEST_VERSION} 新，請更新 App。`,
    );
  }

  for (let version = current; version < LATEST_VERSION; version++) {
    const sql = migrations[version]!;
    await db.withTransactionAsync(async () => {
      await db.execAsync(sql);
      // PRAGMA cannot take bound parameters; version is a trusted integer.
      await db.execAsync(`PRAGMA user_version = ${version + 1}`);
    });
  }
}

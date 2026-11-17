import { randomUUID } from 'expo-crypto';
import { useSQLiteContext } from 'expo-sqlite';
import { useMemo } from 'react';

import { createEntriesRepository } from './entries';

export { DATABASE_NAME, migrate } from './migrations';
export type { Entry, NewEntry, EntryUpdate, EntriesRepository } from './entries';

/** 在頁面中取得 entries repository；必須在 SQLiteProvider 之內使用。 */
export function useEntriesRepository() {
  const db = useSQLiteContext();
  return useMemo(
    () => createEntriesRepository(db, { newId: randomUUID, now: Date.now }),
    [db],
  );
}

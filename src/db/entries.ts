import { MOOD_MAX, MOOD_MIN, type Mood } from '../theme/tokens';
import type { Database } from './types';

export interface Entry {
  id: string;
  /** 事情發生時間（Unix 毫秒） */
  occurredAt: number;
  content: string;
  mood: Mood;
  createdAt: number;
  updatedAt: number;
}

export interface NewEntry {
  occurredAt: number;
  content: string;
  mood: Mood;
}

export type EntryUpdate = Partial<NewEntry>;

interface EntryRow {
  id: string;
  occurred_at: number;
  content: string;
  mood: number;
  created_at: number;
  updated_at: number;
}

export interface RepositoryDeps {
  newId: () => string;
  now: () => number;
}

const COLUMNS = 'id, occurred_at, content, mood, created_at, updated_at';

function toEntry(row: EntryRow): Entry {
  return {
    id: row.id,
    occurredAt: row.occurred_at,
    content: row.content,
    mood: assertMood(row.mood),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function isMood(value: unknown): value is Mood {
  return Number.isInteger(value) && (value as number) >= MOOD_MIN && (value as number) <= MOOD_MAX;
}

function assertMood(value: number): Mood {
  if (!isMood(value)) throw new RangeError(`心情分數必須是 ${MOOD_MIN}–${MOOD_MAX} 的整數：${value}`);
  return value;
}

function assertTimestamp(value: number): number {
  if (!Number.isSafeInteger(value)) throw new RangeError(`時間必須是整數毫秒：${value}`);
  return value;
}

export function createEntriesRepository(db: Database, deps: RepositoryDeps) {
  async function getById(id: string): Promise<Entry | null> {
    const row = await db.getFirstAsync<EntryRow>(`SELECT ${COLUMNS} FROM entries WHERE id = ?`, [id]);
    return row ? toEntry(row) : null;
  }

  return {
    async create(input: NewEntry): Promise<Entry> {
      const now = deps.now();
      const entry: Entry = {
        id: deps.newId(),
        occurredAt: assertTimestamp(input.occurredAt),
        content: input.content,
        mood: assertMood(input.mood),
        createdAt: now,
        updatedAt: now,
      };
      await db.runAsync(`INSERT INTO entries (${COLUMNS}) VALUES (?, ?, ?, ?, ?, ?)`, [
        entry.id,
        entry.occurredAt,
        entry.content,
        entry.mood,
        entry.createdAt,
        entry.updatedAt,
      ]);
      return entry;
    },

    getById,

    /** 依發生時間查詢，範圍為 [start, end)，結果由新到舊。 */
    async listByRange(start: number, end: number): Promise<Entry[]> {
      const rows = await db.getAllAsync<EntryRow>(
        `SELECT ${COLUMNS} FROM entries
         WHERE occurred_at >= ? AND occurred_at < ?
         ORDER BY occurred_at DESC, created_at DESC`,
        [assertTimestamp(start), assertTimestamp(end)],
      );
      return rows.map(toEntry);
    },

    async count(): Promise<number> {
      const row = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM entries', []);
      return row?.n ?? 0;
    },

    /** 回傳更新後的事記；找不到時回傳 null。 */
    async update(id: string, changes: EntryUpdate): Promise<Entry | null> {
      const existing = await getById(id);
      if (!existing) return null;
      const next: Entry = {
        ...existing,
        occurredAt: changes.occurredAt === undefined ? existing.occurredAt : assertTimestamp(changes.occurredAt),
        content: changes.content ?? existing.content,
        mood: changes.mood === undefined ? existing.mood : assertMood(changes.mood),
        updatedAt: deps.now(),
      };
      await db.runAsync(
        'UPDATE entries SET occurred_at = ?, content = ?, mood = ?, updated_at = ? WHERE id = ?',
        [next.occurredAt, next.content, next.mood, next.updatedAt, id],
      );
      return next;
    },

    /** 回傳是否真的刪除了資料。 */
    async remove(id: string): Promise<boolean> {
      const result = await db.runAsync('DELETE FROM entries WHERE id = ?', [id]);
      return result.changes > 0;
    },
  };
}

export type EntriesRepository = ReturnType<typeof createEntriesRepository>;

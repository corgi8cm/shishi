import dayjs from 'dayjs';

import type { Entry } from '../db/entries';
import { MOOD_MAX, MOOD_MIN, type Mood } from '../theme/tokens';
import { dayKey, dayTitle, startOfDay, weekdayName } from './dates';

export interface DaySection {
  key: string;
  title: string;
  data: Entry[];
}

/** 依當地日期分組，日期新到舊，同一天內依發生時間新到舊。 */
export function groupEntriesByDay(entries: readonly Entry[], now: number): DaySection[] {
  const sorted = [...entries].sort((a, b) => b.occurredAt - a.occurredAt || b.createdAt - a.createdAt);
  const sections: DaySection[] = [];
  for (const entry of sorted) {
    const key = dayKey(entry.occurredAt);
    const last = sections[sections.length - 1];
    if (last && last.key === key) {
      last.data.push(entry);
    } else {
      sections.push({ key, title: dayTitle(entry.occurredAt, now), data: [entry] });
    }
  }
  return sections;
}

/** 平均心情四捨五入到 1–5；沒有資料回傳 null（不是 0）。 */
export function averageMood(moods: readonly number[]): Mood | null {
  if (moods.length === 0) return null;
  const avg = moods.reduce((sum, m) => sum + m, 0) / moods.length;
  return Math.min(MOOD_MAX, Math.max(MOOD_MIN, Math.round(avg))) as Mood;
}

export interface WeekDay {
  key: string;
  weekday: string;
  dayOfMonth: number;
  /** 當天平均心情；沒有記錄為 null */
  mood: Mood | null;
  isToday: boolean;
}

/** 含今天在內的最近 7 天，由舊到新。 */
export function weekMoods(entries: readonly Entry[], now: number): WeekDay[] {
  const byDay = new Map<string, number[]>();
  for (const e of entries) {
    const key = dayKey(e.occurredAt);
    const list = byDay.get(key);
    if (list) list.push(e.mood);
    else byDay.set(key, [e.mood]);
  }

  const today = startOfDay(now);
  return Array.from({ length: 7 }, (_, i) => {
    const day = dayjs(today).subtract(6 - i, 'day').valueOf();
    const key = dayKey(day);
    return {
      key,
      weekday: weekdayName(day),
      dayOfMonth: dayjs(day).date(),
      mood: averageMood(byDay.get(key) ?? []),
      isToday: i === 6,
    };
  });
}

/** 一週心情條需要查詢的範圍 [start, end) */
export function weekRange(now: number): { start: number; end: number } {
  const today = dayjs(startOfDay(now));
  return { start: today.subtract(6, 'day').valueOf(), end: today.add(1, 'day').valueOf() };
}

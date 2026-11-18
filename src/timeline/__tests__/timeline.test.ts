import type { Entry } from '../../db/entries';
import type { Mood } from '../../theme/tokens';
import { averageMood, groupEntriesByDay, weekMoods, weekRange } from '../timeline';

const at = (y: number, m: number, d: number, h = 0, min = 0) => new Date(y, m - 1, d, h, min).getTime();
const NOW = at(2026, 11, 18, 21, 40); // 週三

let seq = 0;
function entry(occurredAt: number, mood: Mood = 3, content = '假資料'): Entry {
  seq += 1;
  return { id: `e${seq}`, occurredAt, content, mood, createdAt: seq, updatedAt: seq };
}

describe('groupEntriesByDay', () => {
  it('沒有事記時回傳空陣列', () => {
    expect(groupEntriesByDay([], NOW)).toEqual([]);
  });

  it('依當地日期分組，日期與同日事記都由新到舊', () => {
    const a = entry(at(2026, 11, 18, 9, 15));
    const b = entry(at(2026, 11, 18, 21, 40));
    const c = entry(at(2026, 11, 17, 22, 10));
    const d = entry(at(2026, 11, 15, 12, 0));

    const sections = groupEntriesByDay([d, a, c, b], NOW);

    expect(sections.map((s) => s.title)).toEqual(['今天', '昨天', '11 月 15 日 週日']);
    expect(sections[0]!.data.map((e) => e.id)).toEqual([b.id, a.id]);
  });

  it('午夜前後分屬不同天', () => {
    const late = entry(at(2026, 11, 17, 23, 59));
    const early = entry(at(2026, 11, 18, 0, 1));

    const sections = groupEntriesByDay([late, early], NOW);

    expect(sections.map((s) => [s.title, s.data.length])).toEqual([
      ['今天', 1],
      ['昨天', 1],
    ]);
  });

  it('補記昨天的事會出現在昨天底下', () => {
    const backfill = entry(at(2026, 11, 17, 20, 0));
    const sections = groupEntriesByDay([entry(NOW), backfill], NOW);
    expect(sections[1]).toMatchObject({ title: '昨天', data: [backfill] });
  });
});

describe('averageMood', () => {
  it('沒有資料回傳 null 而不是 0', () => {
    expect(averageMood([])).toBeNull();
  });

  it('四捨五入到整數分', () => {
    expect(averageMood([4])).toBe(4);
    expect(averageMood([2, 3])).toBe(3);
    expect(averageMood([1, 2, 2])).toBe(2);
    expect(averageMood([5, 4, 4])).toBe(4);
  });
});

describe('weekMoods', () => {
  it('回傳含今天的最近 7 天，由舊到新，今天在最後', () => {
    const week = weekMoods([], NOW);
    expect(week.map((d) => d.dayOfMonth)).toEqual([12, 13, 14, 15, 16, 17, 18]);
    expect(week.map((d) => d.weekday)).toEqual(['四', '五', '六', '日', '一', '二', '三']);
    expect(week.map((d) => d.isToday)).toEqual([false, false, false, false, false, false, true]);
  });

  it('沒有記錄的日子為 null，有記錄的取當天平均', () => {
    const week = weekMoods(
      [
        entry(at(2026, 11, 18, 9), 2),
        entry(at(2026, 11, 18, 21), 3),
        entry(at(2026, 11, 16, 12), 5),
        entry(at(2026, 11, 1, 12), 1), // 範圍外
      ],
      NOW,
    );
    expect(week.map((d) => d.mood)).toEqual([null, null, null, null, 5, null, 3]);
  });

  it('跨月時日期正確', () => {
    const week = weekMoods([], at(2026, 12, 2, 10));
    expect(week.map((d) => d.dayOfMonth)).toEqual([26, 27, 28, 29, 30, 1, 2]);
  });
});

describe('weekRange', () => {
  it('從 6 天前的 0 點到明天 0 點', () => {
    expect(weekRange(NOW)).toEqual({ start: at(2026, 11, 12), end: at(2026, 11, 19) });
  });
});

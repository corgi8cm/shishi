import {
  dayTitle,
  daysAgo,
  formatOccurredAt,
  headerDate,
  withDate,
  withTime,
} from '../dates';

// 測試在 Asia/Taipei 時區執行（見 jest.setup-tz.js）
const at = (y: number, m: number, d: number, h = 0, min = 0) => new Date(y, m - 1, d, h, min).getTime();
const NOW = at(2026, 11, 18, 21, 40); // 週三

describe('時區設定', () => {
  it('測試以台北時間執行', () => {
    expect(new Date(NOW).getTimezoneOffset()).toBe(-480);
  });
});

describe('daysAgo', () => {
  it('以日曆天計算，而非 24 小時', () => {
    expect(daysAgo(at(2026, 11, 18, 0, 0), NOW)).toBe(0);
    expect(daysAgo(at(2026, 11, 17, 23, 59), at(2026, 11, 18, 0, 1))).toBe(1);
    expect(daysAgo(at(2026, 11, 11, 23, 0), NOW)).toBe(7);
  });
});

describe('headerDate', () => {
  it('顯示月日與星期', () => {
    expect(headerDate(NOW)).toBe('11 月 18 日・週三');
  });
});

describe('dayTitle', () => {
  it('今天與昨天用文字', () => {
    expect(dayTitle(at(2026, 11, 18, 8), NOW)).toBe('今天');
    expect(dayTitle(at(2026, 11, 17, 23, 59), NOW)).toBe('昨天');
  });

  it('更早的日子顯示月日與星期', () => {
    expect(dayTitle(at(2026, 11, 15, 12), NOW)).toBe('11 月 15 日 週日');
  });

  it('不是今年時加上年份', () => {
    expect(dayTitle(at(2025, 12, 31, 12), NOW)).toBe('2025 年 12 月 31 日 週三');
  });
});

describe('formatOccurredAt', () => {
  it('依日期顯示今天、昨天或月日，加上時間', () => {
    expect(formatOccurredAt(NOW, NOW)).toBe('今天 21:40');
    expect(formatOccurredAt(at(2026, 11, 17, 8, 5), NOW)).toBe('昨天 08:05');
    expect(formatOccurredAt(at(2026, 11, 2, 9, 0), NOW)).toBe('11 月 2 日 09:00');
  });
});

describe('withDate / withTime', () => {
  it('換日期時保留時間', () => {
    expect(withDate(NOW, at(2026, 11, 17))).toBe(at(2026, 11, 17, 21, 40));
  });

  it('換時間時保留日期，秒歸零', () => {
    const base = at(2026, 11, 17, 10, 0) + 45_000;
    expect(withTime(base, at(2000, 1, 1, 7, 30))).toBe(at(2026, 11, 17, 7, 30));
  });
});

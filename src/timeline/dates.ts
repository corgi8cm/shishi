import dayjs from 'dayjs';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'] as const;

/** 星期幾的單字，例如「三」 */
export function weekdayName(ts: number): string {
  return WEEKDAYS[dayjs(ts).day()]!;
}

/** 當地日期的 key，例如 2026-11-18 */
export function dayKey(ts: number): string {
  return dayjs(ts).format('YYYY-MM-DD');
}

export function startOfDay(ts: number): number {
  return dayjs(ts).startOf('day').valueOf();
}

/** 與 now 相差幾個「日曆天」：今天 0、昨天 1；未來為負數 */
export function daysAgo(ts: number, now: number): number {
  return dayjs(startOfDay(now)).diff(dayjs(startOfDay(ts)), 'day');
}

/** 「11 月 18 日」；不是今年時加上年份 */
function monthDay(ts: number, now: number): string {
  const d = dayjs(ts);
  const md = `${d.month() + 1} 月 ${d.date()} 日`;
  return d.year() === dayjs(now).year() ? md : `${d.year()} 年 ${md}`;
}

/** 首頁頂部的日期：「11 月 18 日・週三」 */
export function headerDate(now: number): string {
  const d = dayjs(now);
  return `${d.month() + 1} 月 ${d.date()} 日・週${weekdayName(now)}`;
}

/** 時間軸分組標題：今天、昨天、「11 月 15 日 週日」 */
export function dayTitle(ts: number, now: number): string {
  const diff = daysAgo(ts, now);
  if (diff === 0) return '今天';
  if (diff === 1) return '昨天';
  return `${monthDay(ts, now)} 週${weekdayName(ts)}`;
}

/** 「21:40」 */
export function formatTime(ts: number): string {
  return dayjs(ts).format('HH:mm');
}

/** 時間按鈕的文字：「今天 21:40」、「昨天 08:05」、「11 月 15 日 21:40」 */
export function formatOccurredAt(ts: number, now: number): string {
  const diff = daysAgo(ts, now);
  const day = diff === 0 ? '今天' : diff === 1 ? '昨天' : monthDay(ts, now);
  return `${day} ${formatTime(ts)}`;
}

/** 保留 base 的時間（時、分），把日期換成 date 的日期 */
export function withDate(base: number, date: number): number {
  const d = dayjs(date);
  return dayjs(base).year(d.year()).month(d.month()).date(d.date()).valueOf();
}

/** 保留 base 的日期，把時、分換成 time 的時、分，秒歸零 */
export function withTime(base: number, time: number): number {
  const t = dayjs(time);
  return dayjs(base).hour(t.hour()).minute(t.minute()).second(0).millisecond(0).valueOf();
}

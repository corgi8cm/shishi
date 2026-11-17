import { createEntriesRepository, isMood, type EntriesRepository } from '../entries';
import { migrate } from '../migrations';
import { openTestDatabase } from '../testing/nodeDatabase';

const DAY = 24 * 60 * 60 * 1000;
const BASE = Date.UTC(2026, 0, 10); // 測試用固定時間

async function setup() {
  const db = openTestDatabase();
  await migrate(db);
  let nextId = 0;
  let clock = BASE;
  const repo = createEntriesRepository(db, {
    newId: () => `id-${++nextId}`,
    now: () => clock,
  });
  return {
    db,
    repo,
    advanceClock: (ms: number) => {
      clock += ms;
    },
  };
}

describe('entries repository', () => {
  let ctx: Awaited<ReturnType<typeof setup>>;
  let repo: EntriesRepository;

  beforeEach(async () => {
    ctx = await setup();
    repo = ctx.repo;
  });

  afterEach(() => ctx.db.close());

  it('新增後可用 id 查回，並記錄建立與更新時間', async () => {
    const created = await repo.create({ occurredAt: BASE - DAY, content: '去公園散步', mood: 4 });

    expect(created).toEqual({
      id: 'id-1',
      occurredAt: BASE - DAY,
      content: '去公園散步',
      mood: 4,
      createdAt: BASE,
      updatedAt: BASE,
    });
    expect(await repo.getById('id-1')).toEqual(created);
    expect(await repo.count()).toBe(1);
  });

  it('查不到的 id 回傳 null', async () => {
    expect(await repo.getById('nope')).toBeNull();
  });

  it('依發生時間範圍查詢，包含起點、不含終點，由新到舊排序', async () => {
    await repo.create({ occurredAt: BASE - 2 * DAY, content: '前天', mood: 3 });
    await repo.create({ occurredAt: BASE - DAY, content: '昨天', mood: 2 });
    await repo.create({ occurredAt: BASE, content: '今天', mood: 5 });

    const result = await repo.listByRange(BASE - 2 * DAY, BASE);

    expect(result.map((e) => e.content)).toEqual(['昨天', '前天']);
  });

  it('範圍內沒有資料時回傳空陣列', async () => {
    await repo.create({ occurredAt: BASE, content: '今天', mood: 3 });
    expect(await repo.listByRange(BASE + DAY, BASE + 2 * DAY)).toEqual([]);
  });

  it('更新只改變指定欄位並刷新 updatedAt', async () => {
    const created = await repo.create({ occurredAt: BASE, content: '原本內容', mood: 3 });
    ctx.advanceClock(1000);

    const updated = await repo.update(created.id, { mood: 1 });

    expect(updated).toEqual({ ...created, mood: 1, updatedAt: BASE + 1000 });
    expect(await repo.getById(created.id)).toEqual(updated);
  });

  it('更新發生時間後會出現在新的範圍內', async () => {
    const created = await repo.create({ occurredAt: BASE, content: '補記', mood: 3 });
    await repo.update(created.id, { occurredAt: BASE - DAY });

    expect(await repo.listByRange(BASE - DAY, BASE)).toHaveLength(1);
    expect(await repo.listByRange(BASE, BASE + DAY)).toHaveLength(0);
  });

  it('更新不存在的事記回傳 null', async () => {
    expect(await repo.update('nope', { content: 'x' })).toBeNull();
  });

  it('刪除後查不到，重複刪除回傳 false', async () => {
    const created = await repo.create({ occurredAt: BASE, content: '要刪的', mood: 3 });

    expect(await repo.remove(created.id)).toBe(true);
    expect(await repo.getById(created.id)).toBeNull();
    expect(await repo.remove(created.id)).toBe(false);
  });

  it('拒絕不合法的心情分數與時間', async () => {
    await expect(repo.create({ occurredAt: BASE, content: 'x', mood: 0 as never })).rejects.toThrow(RangeError);
    await expect(repo.create({ occurredAt: BASE, content: 'x', mood: 2.5 as never })).rejects.toThrow(RangeError);
    await expect(repo.create({ occurredAt: Number.NaN, content: 'x', mood: 3 })).rejects.toThrow(RangeError);
    expect(await repo.count()).toBe(0);
  });
});

describe('isMood', () => {
  it.each([1, 2, 3, 4, 5])('%d 是合法心情', (n) => expect(isMood(n)).toBe(true));
  it.each([0, 6, 3.5, '3', null])('%p 不是合法心情', (n) => expect(isMood(n)).toBe(false));
});

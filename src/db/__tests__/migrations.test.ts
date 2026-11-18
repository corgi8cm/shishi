import { getSchemaVersion, LATEST_VERSION, migrate } from '../migrations';
import { openTestDatabase } from '../testing/nodeDatabase';

describe('migrate', () => {
  it('從空資料庫升級到最新版本並建立 entries 表', async () => {
    const db = openTestDatabase();
    expect(await getSchemaVersion(db)).toBe(0);

    await migrate(db);

    expect(await getSchemaVersion(db)).toBe(LATEST_VERSION);
    const table = await db.getFirstAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'entries'",
      [],
    );
    expect(table?.name).toBe('entries');
    db.close();
  });

  it('重複執行不會出錯也不會改變版本', async () => {
    const db = openTestDatabase();
    await migrate(db);
    await migrate(db);
    expect(await getSchemaVersion(db)).toBe(LATEST_VERSION);
    db.close();
  });

  it('資料庫版本比 App 新時拒絕執行', async () => {
    const db = openTestDatabase();
    await db.execAsync(`PRAGMA user_version = ${LATEST_VERSION + 1}`);
    await expect(migrate(db)).rejects.toThrow('請更新 App');
    db.close();
  });

  it('資料表層級拒絕超出 1–5 的心情分數', async () => {
    const db = openTestDatabase();
    await migrate(db);
    await expect(
      db.runAsync(
        'INSERT INTO entries (id, occurred_at, content, mood, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        ['x', 0, '假資料', 6, 0, 0],
      ),
    ).rejects.toThrow(/CHECK/);
    db.close();
  });
});

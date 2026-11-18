import { useEffect, useState } from 'react';

import { EmptyState } from '@/components/EmptyState';
import { useEntriesRepository } from '@/db';

export default function EntriesScreen() {
  const entries = useEntriesRepository();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    entries.count().then(setCount);
  }, [entries]);

  if (count === null) return null;

  return count === 0 ? (
    <EmptyState title="還沒有事記" description="記錄功能即將推出" />
  ) : (
    <EmptyState title={`共 ${count} 則事記`} />
  );
}

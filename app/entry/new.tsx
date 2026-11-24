import { router } from 'expo-router';
import { useState } from 'react';

import { EntryForm } from '@/components/EntryForm';
import { useEntriesRepository } from '@/db';

export default function NewEntryScreen() {
  const repo = useEntriesRepository();
  const [initial] = useState(() => ({ occurredAt: Date.now(), content: '', mood: 3 as const }));

  return (
    <EntryForm
      title="新增事記"
      initial={initial}
      onCancel={() => router.back()}
      onSave={async (value) => {
        await repo.create(value);
        router.back();
      }}
    />
  );
}

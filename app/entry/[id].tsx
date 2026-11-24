import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { EntryForm } from '@/components/EntryForm';
import { type Entry, useEntriesRepository } from '@/db';
import { colors, fonts, minTouchSize } from '@/theme/tokens';

export default function EditEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const repo = useEntriesRepository();
  // undefined = 載入中，null = 找不到
  const [entry, setEntry] = useState<Entry | null | undefined>(undefined);

  useEffect(() => {
    repo.getById(id).then(setEntry);
  }, [repo, id]);

  if (entry === undefined) return <SafeAreaView style={styles.screen} />;

  if (entry === null) {
    return (
      <SafeAreaView style={styles.screen}>
        <EmptyState title="找不到這則事記" description="它可能已經被刪除了" />
        <View style={styles.backRow}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" style={styles.back}>
            <Text style={styles.backText}>返回</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const confirmDelete = () => {
    Alert.alert('刪除這則事記？', '刪除後無法復原。', [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        style: 'destructive',
        onPress: async () => {
          await repo.remove(entry.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <EntryForm
      title="編輯事記"
      initial={entry}
      onCancel={() => router.back()}
      onSave={async (value) => {
        await repo.update(entry.id, value);
        router.back();
      }}
      onDelete={confirmDelete}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backRow: {
    alignItems: 'center',
    paddingBottom: 48,
  },
  back: {
    minWidth: 120,
    height: minTouchSize,
    borderRadius: minTouchSize / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: '#FFFFFF',
  },
});

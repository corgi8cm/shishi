import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { EntryCard } from '@/components/EntryCard';
import { WeekMoodStrip } from '@/components/WeekMoodStrip';
import { type Entry, useEntriesRepository } from '@/db';
import { headerDate } from '@/timeline/dates';
import { groupEntriesByDay, weekMoods } from '@/timeline/timeline';
import { colors, fonts, spacing } from '@/theme/tokens';

export default function TimelineScreen() {
  const repo = useEntriesRepository();
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // 每次回到這個分頁（例如新增或編輯完）都重新載入
  useFocusEffect(
    useCallback(() => {
      let active = true;
      repo.listAll().then((list) => {
        if (!active) return;
        setNow(Date.now());
        setEntries(list);
      });
      return () => {
        active = false;
      };
    }, [repo]),
  );

  const sections = useMemo(() => groupEntriesByDay(entries ?? [], now), [entries, now]);
  const week = useMemo(() => weekMoods(entries ?? [], now), [entries, now]);

  if (entries === null) return <SafeAreaView style={styles.screen} edges={['top']} />;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <SectionList
        sections={sections}
        keyExtractor={(e) => e.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.date}>{headerDate(now)}</Text>
            <Text style={styles.title} accessibilityRole="header">
              事記
            </Text>
            <View style={styles.week}>
              <WeekMoodStrip days={week} />
            </View>
          </View>
        }
        renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title}</Text>}
        renderItem={({ item }) => (
          <EntryCard
            entry={item}
            onPress={() => router.push({ pathname: '/entry/[id]', params: { id: item.id } })}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <EmptyState title="還沒有事記" description="按下方的 ＋ 記下第一件事" />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: spacing.xl + spacing.lg,
  },
  header: {
    paddingTop: spacing.lg,
    gap: 2,
  },
  date: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.text,
  },
  week: {
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 12,
  },
  gap: {
    height: 12,
  },
  empty: {
    paddingTop: 80,
  },
});

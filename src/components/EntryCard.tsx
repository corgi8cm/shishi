import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Entry } from '@/db';
import { formatTime } from '@/timeline/dates';
import { colors, fonts, moodColors, radius } from '@/theme/tokens';

interface Props {
  entry: Entry;
  onPress: () => void;
}

export function EntryCard({ entry, onPress }: Props) {
  const time = formatTime(entry.occurredAt);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${time}，心情 ${entry.mood} 分，${entry.content}`}
      accessibilityHint="編輯這則事記"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.meta}>
        <Text style={styles.time}>{time}</Text>
        <View style={styles.moodChip}>
          <View style={[styles.dot, { backgroundColor: moodColors[entry.mood] }]} />
          <Text style={styles.moodText}>心情 {entry.mood}</Text>
        </View>
      </View>
      <Text style={styles.content}>{entry.content}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  moodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.background,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  moodText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.text,
  },
  content: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
  },
});

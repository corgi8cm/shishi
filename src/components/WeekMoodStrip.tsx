import { StyleSheet, Text, View } from 'react-native';

import type { WeekDay } from '@/timeline/timeline';
import { colors, fonts, moodColors, moodLabels, radius } from '@/theme/tokens';

export function WeekMoodStrip({ days }: { days: WeekDay[] }) {
  return (
    <View style={styles.strip}>
      {days.map((d) => (
        <View
          key={d.key}
          accessible
          accessibilityLabel={`${d.dayOfMonth} 日 週${d.weekday}，${d.mood ? `心情 ${d.mood} 分 ${moodLabels[d.mood]}` : '沒有記錄'}`}
          style={[styles.day, d.isToday && styles.today]}
        >
          <Text style={styles.weekday}>{d.weekday}</Text>
          <Text style={styles.date}>{d.dayOfMonth}</Text>
          <View
            style={[
              styles.dot,
              d.mood ? { backgroundColor: moodColors[d.mood] } : styles.emptyDot,
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.card,
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 4,
  },
  day: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    borderRadius: 10,
  },
  today: {
    backgroundColor: colors.primaryTint,
  },
  weekday: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  date: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyDot: {
    borderWidth: 1,
    borderColor: colors.emptyDot,
  },
});

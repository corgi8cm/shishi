import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, MOODS, moodColors, moodLabels, type Mood } from '@/theme/tokens';

interface Props {
  value: Mood;
  onChange: (mood: Mood) => void;
}

export function MoodPicker({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>這件事讓你心情如何？</Text>
        <Text style={styles.selected}>
          {value} 分・{moodLabels[value]}
        </Text>
      </View>
      <View style={styles.row} accessibilityRole="radiogroup">
        {MOODS.map((m) => {
          const on = m === value;
          return (
            <Pressable
              key={m}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              accessibilityLabel={`心情 ${m} 分 ${moodLabels[m]}`}
              onPress={() => onChange(m)}
              style={[styles.choice, on ? styles.choiceOn : styles.choiceOff]}
            >
              <View style={[styles.dot, { backgroundColor: moodColors[m] }]} />
              <Text style={styles.number}>{m}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.scale}>
        <Text style={styles.scaleText}>很糟</Text>
        <Text style={styles.scaleText}>普通</Text>
        <Text style={styles.scaleText}>很棒</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  selected: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  choice: {
    flex: 1,
    height: 64,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  choiceOn: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
  },
  choiceOff: {
    backgroundColor: colors.moodChoiceIdle,
    borderColor: 'transparent',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  number: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.text,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
});

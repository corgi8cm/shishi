import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing } from '@/theme/tokens';

interface Props {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 18,
    color: colors.text,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

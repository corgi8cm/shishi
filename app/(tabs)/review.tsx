import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/theme/tokens';

export default function ReviewScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <EmptyState title="回顧" description="回顧功能即將推出" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

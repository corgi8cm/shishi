import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, minTouchSize } from '@/theme/tokens';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'book-outline',
  review: 'stats-chart-outline',
};

const FAB_SIZE = 64;

/** 設計稿的底部列：左右兩個分頁，中間是新增事記的圓形按鈕。 */
export function ShishiTabBar({ state, descriptors, navigateToTab, insets }: BottomTabBarProps) {
  const [left, right] = state.routes;

  const renderTab = (route: (typeof state.routes)[number] | undefined) => {
    if (!route) return <View style={styles.tab} />;
    const focused = state.routes[state.index]?.key === route.key;
    const title = descriptors[route.key]?.options.title ?? route.name;
    const color = focused ? colors.primary : colors.textSecondary;
    return (
      <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={title}
        onPress={() => {
          if (!focused) navigateToTab(route.key);
        }}
        style={styles.tab}
      >
        <Ionicons name={ICONS[route.name] ?? 'ellipse-outline'} size={24} color={color} />
        <Text style={[styles.label, { color, fontFamily: focused ? fonts.bold : fonts.regular }]}>{title}</Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {renderTab(left)}
      <View style={styles.fabSlot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="新增事記"
          onPress={() => router.push('/entry/new')}
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </Pressable>
      </View>
      {renderTab(right)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    minHeight: minTouchSize + 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 12,
  },
  fabSlot: {
    flex: 1,
    alignItems: 'center',
  },
  fab: {
    marginTop: -FAB_SIZE / 2,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  fabPressed: {
    backgroundColor: colors.primaryDark,
  },
});

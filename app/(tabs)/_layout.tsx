import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { colors, fonts } from '@/theme/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: fonts.bold, color: colors.text },
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontFamily: fonts.medium },
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.divider },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '事記',
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: '回顧',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" color={color as string} size={size} />,
        }}
      />
    </Tabs>
  );
}

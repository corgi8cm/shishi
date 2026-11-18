import { Tabs } from 'expo-router';

import { ShishiTabBar } from '@/components/ShishiTabBar';
import { colors } from '@/theme/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <ShishiTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: '事記' }} />
      <Tabs.Screen name="review" options={{ title: '回顧' }} />
    </Tabs>
  );
}

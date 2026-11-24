export const colors = {
  background: '#F6F5F1',
  card: '#FFFFFF',
  text: '#1E2226',
  textSecondary: '#5F6670',
  divider: '#E4E2DC',
  primary: '#2C6E8F',
  primaryDark: '#1F5570',
  primaryTint: '#E8F0F4',
  moodChoiceIdle: '#EFEDE8',
  emptyDot: '#E4E2DC',
  danger: '#B3261E',
} as const;

export type Mood = 1 | 2 | 3 | 4 | 5;

export const MOOD_MIN = 1;
export const MOOD_MAX = 5;

export const moodColors: Record<Mood, string> = {
  1: '#3E4C6E',
  2: '#7486A8',
  3: '#9A9A8E',
  4: '#E3A455',
  5: '#D9682E',
};

export const moodLabels: Record<Mood, string> = {
  1: '很糟',
  2: '不太好',
  3: '普通',
  4: '不錯',
  5: '很棒',
};

export const MOODS: readonly Mood[] = [1, 2, 3, 4, 5];

export const fonts = {
  regular: 'NotoSansTC_400Regular',
  medium: 'NotoSansTC_500Medium',
  bold: 'NotoSansTC_700Bold',
} as const;

export const radius = {
  card: 16,
} as const;

/** 可點擊區域的最小邊長 */
export const minTouchSize = 44;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

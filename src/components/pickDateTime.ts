import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { withDate, withTime } from '@/timeline/dates';

function openAndroid(mode: 'date' | 'time', value: number): Promise<number | null> {
  return new Promise((resolve) => {
    DateTimePickerAndroid.open({
      mode,
      value: new Date(value),
      is24Hour: true,
      onValueChange: (_event, date) => resolve(date ? date.getTime() : null),
      onDismiss: () => resolve(null),
      onError: () => resolve(null),
    });
  });
}

/**
 * 先選日期、再選時間（Android 系統對話框）。
 * 任一步取消就回傳 null，不改變原本的時間。
 */
export async function pickDateTime(value: number): Promise<number | null> {
  const date = await openAndroid('date', value);
  if (date === null) return null;
  const withNewDate = withDate(value, date);
  const time = await openAndroid('time', withNewDate);
  if (time === null) return null;
  return withTime(withNewDate, time);
}

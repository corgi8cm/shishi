import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { NewEntry } from '@/db';
import { formatOccurredAt } from '@/timeline/dates';
import { colors, fonts, minTouchSize, radius, spacing } from '@/theme/tokens';

import { MoodPicker } from './MoodPicker';
import { pickDateTime } from './pickDateTime';

interface Props {
  title: string;
  initial: NewEntry;
  onCancel: () => void;
  onSave: (value: NewEntry) => Promise<void>;
  /** 有提供時顯示刪除按鈕（編輯模式） */
  onDelete?: () => void;
}

export function EntryForm({ title, initial, onCancel, onSave, onDelete }: Props) {
  const [occurredAt, setOccurredAt] = useState(initial.occurredAt);
  const [content, setContent] = useState(initial.content);
  const [mood, setMood] = useState(initial.mood);
  const [saving, setSaving] = useState(false);

  const canSave = content.trim().length > 0 && !saving;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave({ occurredAt, content: content.trim(), mood });
    } finally {
      setSaving(false);
    }
  };

  const changeTime = async () => {
    const next = await pickDateTime(occurredAt);
    if (next !== null) setOccurredAt(next);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={onCancel} accessibilityRole="button" style={styles.cancel}>
          <Text style={styles.cancelText}>取消</Text>
        </Pressable>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        <Pressable
          onPress={save}
          disabled={!canSave}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSave }}
          hitSlop={4}
          style={[styles.save, !canSave && styles.saveDisabled]}
        >
          <Text style={styles.saveText}>儲存</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Pressable
            onPress={changeTime}
            accessibilityRole="button"
            accessibilityLabel={`發生時間 ${formatOccurredAt(occurredAt, Date.now())}，點兩下修改`}
            style={styles.timeButton}
          >
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.timeText}>{formatOccurredAt(occurredAt, Date.now())}</Text>
          </Pressable>

          <View style={styles.field}>
            <Text style={styles.fieldLabel} nativeID="entry-content-label">
              發生了什麼事？
            </Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              autoFocus={initial.content === ''}
              accessibilityLabelledBy="entry-content-label"
              style={styles.input}
            />
          </View>

          <MoodPicker value={mood} onChange={setMood} />

          {onDelete ? (
            <Pressable onPress={onDelete} accessibilityRole="button" style={styles.delete}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
              <Text style={styles.deleteText}>刪除這則事記</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  cancel: {
    minWidth: 64,
    height: minTouchSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.text,
  },
  save: {
    minWidth: 64,
    height: minTouchSize,
    paddingHorizontal: 16,
    borderRadius: minTouchSize / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDisabled: {
    opacity: 0.4,
  },
  saveText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  body: {
    padding: 20,
    gap: 22,
  },
  timeButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: minTouchSize,
    paddingHorizontal: 16,
    borderRadius: minTouchSize / 2,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.card,
  },
  timeText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.textSecondary,
  },
  input: {
    minHeight: 150,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.card,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 26,
    color: colors.text,
  },
  delete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: minTouchSize + 4,
    marginTop: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.card,
  },
  deleteText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.danger,
  },
});

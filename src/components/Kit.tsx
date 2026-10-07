import React, { useEffect, useRef } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { TextInputProps, ViewStyle, StyleProp } from 'react-native';
import { s, useTheme } from '../theme';

export function Label({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  const t = useTheme();
  return (
    <Text style={[s.body, { color: muted ? t.muted : t.text }]}>
      {children}
    </Text>
  );
}
export function Note({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={[s.card, { backgroundColor: t.soft, borderColor: t.border }]}>
      <Text style={[s.body, { color: t.text }]}>{children}</Text>
    </View>
  );
}
export function Action({
  title,
  onPress,
  secondary,
  disabled,
  testID,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  testID?: string;
}) {
  const t = useTheme();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        {
          backgroundColor: secondary ? t.soft : t.primary,
          opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text
        style={{
          color: secondary ? t.primary : t.onPrimary,
          fontWeight: '700',
          fontSize: 14,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
export function Chip({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected?: boolean;
  onPress: () => void;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={[
        s.chip,
        {
          backgroundColor: selected ? t.primary : t.surface,
          borderColor: selected ? t.primary : t.border,
        },
      ]}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: '600',
          color: selected ? t.onPrimary : t.muted,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
export function Field(props: TextInputProps) {
  const t = useTheme();
  return (
    <TextInput
      placeholderTextColor={t.muted}
      selectionColor={t.primary}
      {...props}
      style={[
        s.input,
        { color: t.text, borderColor: t.border, backgroundColor: t.surface },
        props.style,
      ]}
    />
  );
}
export function Panel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  return (
    <View
      style={[
        s.card,
        { backgroundColor: t.surface, borderColor: t.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}
// Giữ timer của demo trong vòng đời component, tránh setState sau khi rời màn hình.
export function useDemoTimeout() {
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return (callback: () => void, delay = 1000) => {
    const timer = setTimeout(() => {
      timers.current = timers.current.filter(item => item !== timer);
      callback();
    }, delay);
    timers.current.push(timer);
  };
}

import React, { useState } from 'react';
import {
  Button,
  Keyboard,
  Platform,
  Pressable,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Action, Field, Label, Note } from '../components/Kit';
import { s, useTheme } from '../theme';

export function ButtonDemo() {
  const t = useTheme();
  const [count, setCount] = useState(0);
  return (
    <View style={s.demo}>
      <Button
        title="Button native"
        color={t.primary}
        onPress={() => setCount(v => v + 1)}
      />
      <Button title="Button disabled" disabled onPress={() => {}} />
      <Note>Đã bấm {count} lần. Diện mạo khác nhau giữa Android và iOS.</Note>
    </View>
  );
}
export function PressableDemo() {
  const t = useTheme();
  const [event, setEvent] = useState('Chưa có thao tác');
  return (
    <View style={s.demo}>
      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => setEvent('onPress')}
        onLongPress={() => setEvent('onLongPress')}
        android_ripple={{ color: '#C8BEFF' }}
        style={({ pressed }) => [
          s.button,
          {
            backgroundColor: pressed ? t.success : t.primary,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        {({ pressed }) => (
          <Text style={{ color: t.onPrimary, fontWeight: '700' }}>
            {pressed ? 'Đang giữ…' : 'Bấm hoặc giữ lâu'}
          </Text>
        )}
      </Pressable>
      <Note>Sự kiện: {event}</Note>
    </View>
  );
}
export function OpacityDemo() {
  const t = useTheme();
  const [count, setCount] = useState(0);
  return (
    <View style={s.demo}>
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.25}
        onPress={() => setCount(v => v + 1)}
        style={[s.button, { backgroundColor: t.primary }]}
      >
        <Text style={{ color: t.onPrimary }}>activeOpacity: 0.25</Text>
      </TouchableOpacity>
      <Label>Đã bấm {count} lần</Label>
    </View>
  );
}
export function HighlightDemo() {
  const t = useTheme();
  const [count, setCount] = useState(0);
  return (
    <View style={s.demo}>
      <TouchableHighlight
        accessibilityRole="button"
        underlayColor={t.success}
        onPress={() => setCount(v => v + 1)}
        style={[s.button, { backgroundColor: t.primary }]}
      >
        <Text style={{ color: t.onPrimary }}>Giữ để thấy underlay</Text>
      </TouchableHighlight>
      <Label>Đã bấm {count} lần</Label>
    </View>
  );
}
export function WithoutFeedbackDemo() {
  return (
    <View style={s.demo}>
      <Field
        accessibilityLabel="Input để thử đóng bàn phím"
        placeholder="Focus để mở bàn phím"
      />
      <TouchableWithoutFeedback
        accessibilityRole="button"
        accessibilityLabel="Đóng bàn phím"
        onPress={Keyboard.dismiss}
      >
        <View style={{ height: 180, padding: 24, justifyContent: 'center' }}>
          <Note>
            Bấm vùng này để Keyboard.dismiss(). Không có hiệu ứng khi chạm.
          </Note>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
export function NativeFeedbackDemo() {
  const t = useTheme();
  const [count, setCount] = useState(0);
  const content = (
    <View style={[s.button, { backgroundColor: t.soft }]}>
      <Label>Ripple native</Label>
    </View>
  );
  return (
    <View style={s.demo}>
      {Platform.OS === 'android' ? (
        <TouchableNativeFeedback
          accessibilityRole="button"
          background={TouchableNativeFeedback.Ripple(t.primary, false)}
          onPress={() => setCount(v => v + 1)}
        >
          {content}
        </TouchableNativeFeedback>
      ) : (
        <Action
          title="Pressable fallback iOS"
          onPress={() => setCount(v => v + 1)}
        />
      )}
      <Note>
        Đã bấm {count} lần · {Platform.OS}
      </Note>
    </View>
  );
}
export function FABDemo() {
  const t = useTheme();
  const [count, setCount] = useState(0);
  return (
    <View style={[s.demo, s.fill]}>
      <Label>Đã tạo {count} ghi chú demo.</Label>
      <Note>Nút nằm ở góc dưới phải của vùng preview.</Note>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Tạo ghi chú demo"
        onPress={() => setCount(v => v + 1)}
        style={[
          s.center,
          {
            position: 'absolute',
            right: 24,
            bottom: 24,
            width: 60,
            height: 60,
            borderRadius: 22,
            backgroundColor: t.primary,
          },
        ]}
      >
        <Text style={{ color: t.onPrimary, fontSize: 32 }}>+</Text>
      </Pressable>
    </View>
  );
}

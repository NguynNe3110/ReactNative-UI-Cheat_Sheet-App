import React, { useState } from 'react';
import {
  I18nManager,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Action, Chip, Label, Note } from '../components/Kit';
import { s, useTheme } from '../theme';

export function ViewDemo() {
  const t = useTheme();
  const [rounded, setRounded] = useState(true);
  const [size, setSize] = useState('');
  return (
    <View style={s.demo}>
      <View
        onLayout={({ nativeEvent: { layout } }) =>
          setSize(
            `${Math.round(layout.width)} × ${Math.round(layout.height)} dp`,
          )
        }
        style={{
          padding: 28,
          borderRadius: rounded ? 24 : 0,
          backgroundColor: t.soft,
          borderWidth: 2,
          borderColor: t.primary,
        }}
      >
        <Label>View cha</Label>
        <View
          style={{
            padding: 16,
            marginTop: 12,
            backgroundColor: t.primary,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: t.onPrimary }}>View con</Text>
        </View>
      </View>
      <Label muted>onLayout: {size}</Label>
      <Action title="Đổi borderRadius" onPress={() => setRounded(v => !v)} />
    </View>
  );
}
export function FlexDemo() {
  const t = useTheme();
  const [row, setRow] = useState(true);
  return (
    <View style={s.demo}>
      <View
        style={{ height: 220, flexDirection: row ? 'row' : 'column', gap: 12 }}
      >
        {[1, 2, 1].map((flex, i) => (
          <View
            key={i}
            style={[
              s.center,
              {
                flex,
                borderRadius: 14,
                backgroundColor: i === 1 ? t.primary : t.soft,
              },
            ]}
          >
            <Text style={{ color: i === 1 ? t.onPrimary : t.primary }}>
              flex: {flex}
            </Text>
          </View>
        ))}
      </View>
      <Action
        title={`flexDirection: ${row ? 'row' : 'column'}`}
        onPress={() => setRow(v => !v)}
      />
      <Note>
        alignItems điều khiển trục phụ. justifyContent điều khiển trục chính.
      </Note>
    </View>
  );
}
export function SpacingDemo() {
  const t = useTheme();
  const [padding, setPadding] = useState(12);
  return (
    <View style={s.demo}>
      <View
        style={{
          backgroundColor: t.soft,
          padding,
          borderWidth: 1,
          borderColor: t.primary,
          borderRadius: 16,
        }}
      >
        <View style={[s.row, { gap: padding, backgroundColor: t.surface }]}>
          {['A', 'B', 'C'].map(x => (
            <View
              key={x}
              style={[
                s.tile,
                { flex: 1, minWidth: 0, backgroundColor: t.primary },
              ]}
            >
              <Text style={{ color: t.onPrimary }}>{x}</Text>
            </View>
          ))}
        </View>
      </View>
      <Label>padding & gap: {padding} dp</Label>
      <View style={s.wrap}>
        {[4, 12, 24, 36].map(x => (
          <Chip
            key={x}
            title={`${x} dp`}
            selected={x === padding}
            onPress={() => setPadding(x)}
          />
        ))}
      </View>
    </View>
  );
}
export function PositionDemo() {
  const t = useTheme();
  const [top, setTop] = useState(true);
  return (
    <View style={s.demo}>
      <View
        style={[
          s.center,
          { height: 220, backgroundColor: t.soft, borderRadius: 20 },
        ]}
      >
        <Label>position: relative (mặc định)</Label>
        <View
          style={{
            position: 'absolute',
            right: 12,
            top: top ? 12 : undefined,
            bottom: top ? undefined : 12,
            backgroundColor: t.primary,
            borderRadius: 20,
            padding: 10,
          }}
        >
          <Text style={{ color: t.onPrimary }}>absolute</Text>
        </View>
      </View>
      <Action title="Đổi vị trí overlay" onPress={() => setTop(v => !v)} />
    </View>
  );
}
export function WrapDemo() {
  const [selected, setSelected] = useState('View');
  return (
    <View style={s.demo}>
      <View style={s.wrap}>
        {[
          'View',
          'Text',
          'TextInput',
          'Pressable',
          'FlatList',
          'Modal',
          'Animated',
          'Switch',
          'SafeAreaProvider',
        ].map(x => (
          <Chip
            key={x}
            title={x}
            selected={selected === x}
            onPress={() => setSelected(x)}
          />
        ))}
      </View>
      <Note>flexDirection: row + flexWrap: wrap + gap: 10</Note>
      <Label>Đang chọn: {selected}</Label>
    </View>
  );
}
export function AspectDemo() {
  const t = useTheme();
  const [ratio, setRatio] = useState(16 / 9);
  return (
    <View style={s.demo}>
      <View
        style={[
          s.center,
          {
            width: '100%',
            aspectRatio: ratio,
            backgroundColor: t.soft,
            borderRadius: 20,
          },
        ]}
      >
        <Text style={{ color: t.primary, fontSize: 24, fontWeight: '800' }}>
          {ratio.toFixed(2)}
        </Text>
      </View>
      <View style={s.wrap}>
        {[
          ['1:1', 1],
          ['4:3', 4 / 3],
          ['16:9', 16 / 9],
        ].map(([name, value]) => (
          <Chip
            key={name}
            title={String(name)}
            selected={ratio === value}
            onPress={() => setRatio(Number(value))}
          />
        ))}
      </View>
    </View>
  );
}
export function SafeAreaDemo() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={s.demo}>
      <View
        style={[
          s.card,
          {
            borderColor: t.primary,
            backgroundColor: t.soft,
            paddingTop: Math.max(insets.top, 12),
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <Label>Vùng nội dung an toàn</Label>
        <Label muted>Provider của app lấy inset thực từ thiết bị.</Label>
      </View>
      {Object.entries(insets).map(([edge, value]) => (
        <View key={edge} style={s.between}>
          <Label>{edge}</Label>
          <Label>{value} dp</Label>
        </View>
      ))}
      <Note>
        Minh họa inset trong một khối. Màn hình app đã áp dụng safe area ở cấp
        root.
      </Note>
    </View>
  );
}
export function ResponsiveDemo() {
  const t = useTheme();
  const { width, height, fontScale } = useWindowDimensions();
  const columns = width >= 600 ? 3 : 2;
  return (
    <View style={s.demo}>
      <Label>
        {Math.round(width)} × {Math.round(height)} dp · {columns} cột
      </Label>
      <View style={s.wrap}>
        {Array.from({ length: 6 }, (_, i) => (
          <View
            key={i}
            style={[
              s.tile,
              { width: `${100 / columns - 3}%`, backgroundColor: t.soft },
            ]}
          >
            <Label>0{i + 1}</Label>
          </View>
        ))}
      </View>
      <Note>
        fontScale: {fontScale.toFixed(2)}. Xoay màn hình để hook cập nhật
        layout.
      </Note>
    </View>
  );
}
export function StyleSheetDemo() {
  const t = useTheme();
  const [active, setActive] = useState(false);
  const base = { padding: 24, borderRadius: 16, backgroundColor: t.soft };
  const override = { borderWidth: 2, borderColor: t.primary };
  const merged = StyleSheet.flatten([base, active && override]);
  return (
    <View style={s.demo}>
      <View style={merged}>
        <Label>StyleSheet.flatten([base, active &amp;&amp; override])</Label>
      </View>
      <Action
        title={active ? 'Tắt style bổ sung' : 'Thêm border'}
        onPress={() => setActive(v => !v)}
      />
      <Label muted>hairlineWidth = {StyleSheet.hairlineWidth.toFixed(3)}</Label>
    </View>
  );
}
export function RTLDemo() {
  const t = useTheme();
  const [rtl, setRtl] = useState(false);
  return (
    <View style={s.demo}>
      <View
        style={[
          s.row,
          {
            direction: rtl ? 'rtl' : 'ltr',
            paddingStart: 24,
            backgroundColor: t.soft,
            borderRadius: 16,
            height: 100,
          },
        ]}
      >
        {['1', '2', '3'].map(x => (
          <View key={x} style={[s.tile, { backgroundColor: t.primary }]}>
            <Text style={{ color: t.onPrimary }}>{x}</Text>
          </View>
        ))}
      </View>
      <Action
        title={`Khối demo: ${rtl ? 'RTL' : 'LTR'}`}
        onPress={() => setRtl(v => !v)}
      />
      <Label>Hệ thống isRTL: {String(I18nManager.isRTL)}</Label>
      <Note>Chỉ thay direction của khối; không forceRTL toàn app.</Note>
    </View>
  );
}
export function SafeAreaLegacyDemo() {
  return (
    <View style={s.demo}>
      <Note>
        SafeAreaView từ react-native đã deprecated. Dùng SafeAreaProvider +
        SafeAreaView hoặc useSafeAreaInsets từ react-native-safe-area-context.
      </Note>
      <SafeAreaDemo />
    </View>
  );
}

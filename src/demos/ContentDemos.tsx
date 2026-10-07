import React, { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Image,
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native';
import type { ImageResizeMode } from 'react-native';
import { Action, Chip, Label, Note, Panel } from '../components/Kit';
import { s, useTheme } from '../theme';

const landscape = require('../assets/landscape.png');

export function TextDemo() {
  const t = useTheme();
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={s.demo}>
      <Text selectable style={[s.body, { color: t.text }]}>
        Một Text có thể chứa{' '}
        <Text style={{ color: t.primary, fontWeight: '800' }}>
          Text lồng nhau
        </Text>
        , <Text style={{ fontStyle: 'italic' }}>chữ nghiêng</Text> và{' '}
        <Text style={{ textDecorationLine: 'underline' }}>gạch chân</Text>.
      </Text>
      <Text
        numberOfLines={expanded ? undefined : 2}
        ellipsizeMode="tail"
        style={[s.body, { color: t.muted }]}
      >
        React Native giúp xây dựng ứng dụng native bằng React. Trong ví dụ này,
        đoạn văn dài được giới hạn hai dòng. Bạn có thể chạm nút bên dưới để xem
        toàn bộ, hoặc nhấn giữ đoạn phía trên để thử chọn và sao chép văn bản.
      </Text>
      <Action
        title={expanded ? 'Thu gọn về 2 dòng' : 'Xem toàn bộ'}
        onPress={() => setExpanded(v => !v)}
      />
    </View>
  );
}
export function TypographyDemo() {
  const t = useTheme();
  return (
    <View style={s.demo}>
      {[32, 24, 18, 14, 12].map((size, i) => (
        <Text
          key={size}
          style={{
            color: t.text,
            fontSize: size,
            lineHeight: size * 1.5,
            fontWeight: i < 2 ? '800' : '400',
          }}
        >
          React Native · {size}sp
        </Text>
      ))}
      <Text style={{ color: t.primary, fontSize: 12, letterSpacing: 3 }}>
        LETTER SPACING
      </Text>
      <Note>
        Hãy thử tăng cỡ chữ hệ thống. Text mặc định hỗ trợ allowFontScaling.
      </Note>
    </View>
  );
}
export function ImageDemo() {
  const [mode, setMode] = useState<ImageResizeMode>('cover');
  return (
    <View style={s.demo}>
      <Image
        accessibilityLabel="Minh họa núi màu tím và mặt trời"
        source={landscape}
        resizeMode={mode}
        style={{ width: '100%', height: 220, borderRadius: 18 }}
      />
      <View style={s.wrap}>
        {(['cover', 'contain', 'stretch', 'center'] as ImageResizeMode[]).map(
          x => (
            <Chip
              key={x}
              title={x}
              selected={mode === x}
              onPress={() => setMode(x)}
            />
          ),
        )}
      </View>
      <Note>
        Ảnh nằm trong src/assets, không cần mạng. source=require(...) cho Metro
        biết asset tại build time.
      </Note>
    </View>
  );
}
export function ImageBackgroundDemo() {
  const [dark, setDark] = useState(true);
  return (
    <View style={s.demo}>
      <View
        style={{
          height: 240,
          borderRadius: 20,
          overflow: 'hidden',
          justifyContent: 'flex-end',
        }}
      >
        <Image
          source={landscape}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: dark ? 'rgba(10,15,36,0.45)' : 'transparent',
          }}
        />
        <View style={{ padding: 24 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '800' }}>
            Explore the native.
          </Text>
          <Text style={{ color: '#FFFFFF', marginTop: 6 }}>
            Image absolute + nội dung View
          </Text>
        </View>
      </View>
      <Action title="Đổi lớp phủ" onPress={() => setDark(v => !v)} />
      <Note>
        ImageBackground core đã deprecated trong 0.87. Thay thế trên vẫn có thể
        đặt nội dung lên ảnh.
      </Note>
    </View>
  );
}
export function CardDemo() {
  const t = useTheme();
  const [saved, setSaved] = useState(false);
  return (
    <View style={s.demo}>
      <Panel>
        <Image
          source={landscape}
          style={{ width: '100%', height: 150, borderRadius: 12 }}
        />
        <Text style={[s.heading, { color: t.text }]}>
          Thiết kế bằng composition
        </Text>
        <Label muted>
          View + Image + Text + Pressable tạo nên một card hoàn chỉnh.
        </Label>
        <Action
          title={saved ? '✓ Đã lưu thẻ' : 'Lưu thẻ'}
          onPress={() => setSaved(v => !v)}
        />
      </Panel>
    </View>
  );
}
export function AvatarDemo() {
  const t = useTheme();
  const [large, setLarge] = useState(false);
  const size = large ? 88 : 56;
  return (
    <View style={s.demo}>
      <View style={s.row}>
        {['RN', 'KT', 'FL'].map((name, i) => (
          <View
            key={name}
            accessibilityLabel={`Avatar ${name}`}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: i === 0 ? t.primary : t.soft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: i === 0 ? t.onPrimary : t.primary,
                fontSize: size / 3,
                fontWeight: '700',
              }}
            >
              {name}
            </Text>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 15,
                height: 15,
                borderRadius: 8,
                backgroundColor: t.success,
                borderWidth: 2,
                borderColor: t.surface,
              }}
            />
          </View>
        ))}
      </View>
      <Action title="Đổi kích thước" onPress={() => setLarge(v => !v)} />
    </View>
  );
}
export function BadgeDemo() {
  const t = useTheme();
  const [selected, setSelected] = useState<string[]>(['React']);
  return (
    <View style={s.demo}>
      <View style={s.between}>
        <Label>Chủ đề đã chọn</Label>
        <View
          style={{
            backgroundColor: t.primary,
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
        >
          <Text style={{ color: t.onPrimary }}>{selected.length}</Text>
        </View>
      </View>
      <View style={s.wrap}>
        {['React', 'Native', 'TypeScript', 'Android', 'iOS'].map(x => (
          <Chip
            key={x}
            title={x}
            selected={selected.includes(x)}
            onPress={() =>
              setSelected(prev =>
                prev.includes(x) ? prev.filter(v => v !== x) : [...prev, x],
              )
            }
          />
        ))}
      </View>
    </View>
  );
}
export function DividerDemo() {
  const t = useTheme();
  return (
    <View style={s.demo}>
      <Panel>
        <Label>Nội dung phía trên</Label>
        <View style={[s.line, { backgroundColor: t.border }]} />
        <Label>Nội dung phía dưới</Label>
      </Panel>
      <View style={[s.row, { height: 60 }]}>
        <Label>Trái</Label>
        <View
          style={{
            width: 1,
            alignSelf: 'stretch',
            backgroundColor: t.primary,
            marginHorizontal: 16,
          }}
        />
        <Label>Phải</Label>
      </View>
      <Note>
        Đường ngang dùng StyleSheet.hairlineWidth; đường dọc cần chiều cao từ
        cha.
      </Note>
    </View>
  );
}
export function EmptyDemo() {
  const t = useTheme();
  const [items, setItems] = useState<number[]>([]);
  return (
    <View style={s.demo}>
      {items.length ? (
        <Panel>
          {items.map(x => (
            <Label key={x}>Ghi chú #{x}</Label>
          ))}
          <Action secondary title="Xóa toàn bộ" onPress={() => setItems([])} />
        </Panel>
      ) : (
        <Panel style={{ alignItems: 'center', paddingVertical: 32 }}>
          <Text style={{ fontSize: 42, color: t.primary }}>□</Text>
          <Text style={[s.heading, { color: t.text }]}>Chưa có ghi chú</Text>
          <Label muted>Thêm ghi chú đầu tiên để bắt đầu.</Label>
        </Panel>
      )}
      <Action
        title="Thêm ghi chú"
        onPress={() => setItems(prev => [...prev, prev.length + 1])}
      />
    </View>
  );
}
export function AccessibilityDemo() {
  const [enabled, setEnabled] = useState(false);
  const [reader, setReader] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isScreenReaderEnabled()
      .then(value => {
        if (active) {
          setReader(value);
        }
      })
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setReader,
    );
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return (
    <View style={s.demo}>
      <View style={s.between}>
        <Label>Thông báo bài học</Label>
        <Switch
          accessibilityLabel="Thông báo bài học"
          value={enabled}
          onValueChange={value => {
            setEnabled(value);
            AccessibilityInfo.announceForAccessibility(
              value ? 'Đã bật thông báo' : 'Đã tắt thông báo',
            );
          }}
        />
      </View>
      <Label>
        Screen reader:{' '}
        {reader === null ? 'đang kiểm tra' : reader ? 'đang bật' : 'đang tắt'}
      </Label>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Đọc thông báo ví dụ"
        accessibilityHint="Phát lời nhắc bằng screen reader"
        onPress={() =>
          AccessibilityInfo.announceForAccessibility(
            'Bạn đang học accessibility trong React Native.',
          )
        }
      >
        <Note>Chạm để thử announceForAccessibility.</Note>
      </Pressable>
      <Note>
        Thông báo là demo accessibility; không đăng ký push notification thật.
      </Note>
    </View>
  );
}

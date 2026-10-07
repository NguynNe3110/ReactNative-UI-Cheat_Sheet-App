import React, { useEffect, useState } from 'react';
import { BackHandler, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Action, Label, Note, Panel } from '../components/Kit';
import { s, useTheme } from '../theme';

export function TabsDemo() {
  const t = useTheme();
  const [tab, setTab] = useState('Demo');
  return (
    <View style={s.demo}>
      <View style={s.row}>
        {['Demo', 'Code', 'Ghi chú'].map(x => (
          <Pressable
            key={x}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === x }}
            onPress={() => setTab(x)}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 14,
              borderBottomWidth: 3,
              borderBottomColor: tab === x ? t.primary : t.border,
            }}
          >
            <Text
              style={{
                color: tab === x ? t.primary : t.muted,
                fontWeight: '700',
              }}
            >
              {x}
            </Text>
          </Pressable>
        ))}
      </View>
      <Panel>
        <Label>Nội dung tab: {tab}</Label>
        <Label muted>Giống các tab của màn hình bài học này.</Label>
      </Panel>
    </View>
  );
}
export function BottomNavDemo() {
  const t = useTheme();
  const [tab, setTab] = useState('Home');
  return (
    <View style={[s.demo, { minHeight: 330 }]}>
      <Panel style={{ flex: 1 }}>
        <Label>Màn hình {tab}</Label>
        <Label muted>State điều khiển nội dung và selected state.</Label>
      </Panel>
      <View
        style={[
          s.row,
          { borderTopWidth: 1, borderColor: t.border, paddingTop: 12 },
        ]}
      >
        {[
          ['⌂', 'Home'],
          ['♡', 'Saved'],
          ['○', 'Profile'],
        ].map(([icon, x]) => (
          <Pressable
            key={x}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === x }}
            onPress={() => setTab(x)}
            style={{ flex: 1, alignItems: 'center', padding: 10, gap: 4 }}
          >
            <Text
              style={{ fontSize: 24, color: tab === x ? t.primary : t.muted }}
            >
              {icon}
            </Text>
            <Text style={{ color: tab === x ? t.primary : t.muted }}>{x}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
export function DrawerDemo() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('Home');
  return (
    <View style={s.demo}>
      <Action title="☰ Mở Drawer" onPress={() => setOpen(true)} />
      <Note>Trang đã chọn: {tab}</Note>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: 'rgba(7,10,22,0.6)',
          }}
        >
          <View
            accessibilityViewIsModal
            style={{
              width: '78%',
              maxWidth: 340,
              backgroundColor: t.surface,
              padding: 24,
              paddingTop: insets.top + 24,
              gap: 18,
            }}
          >
            <Text style={[s.title, { color: t.text }]}>Menu</Text>
            {['Home', 'Components', 'Saved'].map(x => (
              <Action
                key={x}
                secondary
                title={x}
                onPress={() => {
                  setTab(x);
                  setOpen(false);
                }}
              />
            ))}
            <Action title="Đóng" onPress={() => setOpen(false)} />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Đóng drawer"
            onPress={() => setOpen(false)}
            style={s.fill}
          />
        </View>
      </Modal>
    </View>
  );
}
export function StackDemo() {
  const [stack, setStack] = useState(['Home']);
  useEffect(() => {
    if (stack.length < 2) {
      return;
    }
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        setStack(prev => prev.slice(0, -1));
        return true;
      },
    );
    return () => subscription.remove();
  }, [stack.length]);
  return (
    <View style={s.demo}>
      <Note>Màn hình: {stack[stack.length - 1]}</Note>
      <Label muted>Stack: {stack.join(' → ')}</Label>
      <Action
        title="Push màn hình mới"
        onPress={() => setStack(prev => [...prev, `Detail ${prev.length}`])}
      />
      <Action
        secondary
        disabled={stack.length < 2}
        title="Pop / Quay lại"
        onPress={() =>
          setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev))
        }
      />
    </View>
  );
}
export function BreadcrumbDemo() {
  const t = useTheme();
  const [depth, setDepth] = useState(3);
  return (
    <View style={s.demo}>
      <View style={s.wrap}>
        {['Home', 'Components', 'Input'].slice(0, depth).map((x, i) => (
          <Pressable
            key={x}
            accessibilityRole="button"
            onPress={() => setDepth(i + 1)}
            style={{ paddingVertical: 12 }}
          >
            <Text style={{ color: i === depth - 1 ? t.text : t.primary }}>
              {i ? '›  ' : ''}
              {x}
            </Text>
          </Pressable>
        ))}
      </View>
      <Note>Đang ở cấp {depth}</Note>
      <Action title="Đi sâu đến Input" onPress={() => setDepth(3)} />
    </View>
  );
}
export function DrawerLegacyDemo() {
  return (
    <View style={s.demo}>
      <Note>
        DrawerLayoutAndroid core đã deprecated. Dùng react-native-drawer-layout
        cho drawer có gesture/snap. Bên dưới là pattern Modal đơn giản để thử
        menu.
      </Note>
      <DrawerDemo />
    </View>
  );
}

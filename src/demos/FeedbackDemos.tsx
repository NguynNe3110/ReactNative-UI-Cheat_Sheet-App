import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Action,
  Chip,
  Label,
  Note,
  Panel,
  useDemoTimeout,
} from '../components/Kit';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { s, useTheme } from '../theme';

export function ActivityDemo() {
  const t = useTheme();
  const [loading, setLoading] = useState(true);
  return (
    <View style={s.demo}>
      <Panel>
        <View style={s.row}>
          <ActivityIndicator
            size="large"
            color={t.primary}
            animating={loading}
          />
          <Label>{loading ? 'Đang tải dữ liệu…' : '✓ Tải xong'}</Label>
        </View>
      </Panel>
      <View style={s.between}>
        <Label>animating</Label>
        <Switch value={loading} onValueChange={setLoading} />
      </View>
      <ActivityIndicator size="small" color={t.success} animating={loading} />
    </View>
  );
}
export function ProgressDemo() {
  const t = useTheme();
  const [value, setValue] = useState(30);
  return (
    <View style={s.demo}>
      <View style={s.between}>
        <Label>Tiến độ bài học</Label>
        <Label>{value}%</Label>
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Tiến độ demo"
        accessibilityValue={{ min: 0, max: 100, now: value }}
        style={{
          height: 12,
          backgroundColor: t.border,
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${value}%`,
            height: '100%',
            backgroundColor: t.primary,
          }}
        />
      </View>
      <View style={s.wrap}>
        <Action
          title="+10%"
          disabled={value >= 100}
          onPress={() => setValue(v => Math.min(100, v + 10))}
        />
        <Action secondary title="Reset" onPress={() => setValue(0)} />
      </View>
    </View>
  );
}
export function SkeletonDemo() {
  const t = useTheme();
  const [loading, setLoading] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;
  const reduced = useReduceMotion();
  useEffect(() => {
    if (!loading || reduced) {
      opacity.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [loading, opacity, reduced]);
  return (
    <View style={s.demo}>
      {loading ? (
        <Animated.View style={[s.card, { opacity, borderColor: t.border }]}>
          <View
            style={{ height: 130, backgroundColor: t.border, borderRadius: 12 }}
          />
          <View
            style={{
              height: 20,
              width: '75%',
              backgroundColor: t.border,
              borderRadius: 6,
            }}
          />
          <View
            style={{
              height: 14,
              width: '50%',
              backgroundColor: t.border,
              borderRadius: 6,
            }}
          />
        </Animated.View>
      ) : (
        <Panel>
          <Label>✓ Nội dung đã tải</Label>
          <Label muted>Placeholder được thay bằng nội dung thật.</Label>
        </Panel>
      )}
      <Action
        title={loading ? 'Hiện dữ liệu' : 'Hiện skeleton'}
        onPress={() => setLoading(v => !v)}
      />
      <Label muted>Reduce Motion: {String(reduced)}</Label>
    </View>
  );
}
export function AlertDemo() {
  const [result, setResult] = useState('Chưa chọn');
  return (
    <View style={s.demo}>
      <Action
        title="Mở Alert native"
        onPress={() =>
          Alert.alert(
            'Xóa ghi chú demo?',
            'Thao tác này chỉ thay đổi state trong preview.',
            [
              {
                text: 'Hủy',
                style: 'cancel',
                onPress: () => setResult('Đã hủy'),
              },
              {
                text: 'Xóa',
                style: 'destructive',
                onPress: () => setResult('Đã xác nhận xóa'),
              },
            ],
            {
              cancelable: true,
              onDismiss: () => setResult('Đã đóng hộp thoại'),
            },
          )
        }
      />
      <Note>{result}</Note>
    </View>
  );
}
export function ModalDemo() {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <View style={s.demo}>
      <Action title="Mở Modal" onPress={() => setOpen(true)} />
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={s.overlay}>
          <View
            accessibilityViewIsModal
            style={[
              s.card,
              { backgroundColor: t.surface, borderColor: t.border },
            ]}
          >
            <Text style={[s.heading, { color: t.text }]}>
              Xin chào từ Modal
            </Text>
            <Label muted>Nội dung được render trên màn hình hiện tại.</Label>
            <Action title="Đóng" onPress={() => setOpen(false)} />
          </View>
        </View>
      </Modal>
      <Note>onRequestClose xử lý nút Back Android.</Note>
    </View>
  );
}
export function BottomSheetDemo() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState('Chưa chọn');
  return (
    <View style={s.demo}>
      <Action title="Mở Bottom sheet" onPress={() => setOpen(true)} />
      <Note>{choice}</Note>
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(7,10,22,0.6)',
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Đóng sheet"
            onPress={() => setOpen(false)}
            style={{ flex: 1 }}
          />
          <View
            accessibilityViewIsModal
            style={{
              padding: 24,
              paddingBottom: 24 + insets.bottom,
              gap: 16,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              backgroundColor: t.surface,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: t.border,
                alignSelf: 'center',
              }}
            />
            <Label>Bạn muốn học gì tiếp?</Label>
            {['Layout', 'Input', 'Animation'].map(x => (
              <Action
                key={x}
                secondary
                title={x}
                onPress={() => {
                  setChoice(x);
                  setOpen(false);
                }}
              />
            ))}
            <Action title="Đóng" onPress={() => setOpen(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
export function SnackbarDemo() {
  const t = useTheme();
  const [exists, setExists] = useState(true);
  const [visible, setVisible] = useState(false);
  const generation = useRef(0);
  const delay = useDemoTimeout();
  return (
    <View style={s.demo}>
      <Panel>
        <Label>
          {exists ? 'Một ghi chú có thể xóa.' : 'Ghi chú đã bị xóa.'}
        </Label>
        <Action
          disabled={!exists}
          title="Xóa ghi chú"
          onPress={() => {
            setExists(false);
            setVisible(true);
            const current = ++generation.current;
            delay(() => {
              if (generation.current === current) {
                setVisible(false);
              }
            }, 5000);
          }}
        />
      </Panel>
      {visible && (
        <View
          style={[
            s.between,
            { padding: 14, backgroundColor: t.soft, borderRadius: 14 },
          ]}
        >
          <Text
            accessibilityLiveRegion="polite"
            style={{ color: t.text, flex: 1 }}
          >
            Đã xóa ghi chú
          </Text>
          <Action
            secondary
            title="Hoàn tác"
            onPress={() => {
              generation.current++;
              setExists(true);
              setVisible(false);
            }}
          />
        </View>
      )}
      <Label muted>Thông báo tự đóng sau 5 giây.</Label>
    </View>
  );
}
export function TooltipDemo() {
  const t = useTheme();
  const [visible, setVisible] = useState(false);
  return (
    <View style={s.demo}>
      <View style={s.row}>
        <Label>useState là gì?</Label>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Giải thích useState"
          accessibilityState={{ expanded: visible }}
          onPress={() => setVisible(v => !v)}
          style={[
            s.center,
            {
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: t.soft,
            },
          ]}
        >
          <Text style={{ color: t.primary, fontSize: 20 }}>?</Text>
        </Pressable>
      </View>
      {visible && (
        <Note>
          useState giữ giá trị giữa các lần render. Gọi setter để cập nhật và
          render lại giao diện.
        </Note>
      )}
    </View>
  );
}
export function BannerDemo() {
  const t = useTheme();
  const [type, setType] = useState('success');
  const [visible, setVisible] = useState(true);
  const color =
    type === 'success' ? t.success : type === 'warning' ? t.warning : t.danger;
  return (
    <View style={s.demo}>
      <View style={s.wrap}>
        {['success', 'warning', 'error'].map(x => (
          <Chip
            key={x}
            title={x}
            selected={type === x}
            onPress={() => {
              setType(x);
              setVisible(true);
            }}
          />
        ))}
      </View>
      {visible && (
        <View
          style={[s.card, { borderColor: color, backgroundColor: t.surface }]}
        >
          <Text accessibilityLiveRegion="polite" style={[s.heading, { color }]}>
            {type === 'success'
              ? '✓ Đã lưu thay đổi'
              : type === 'warning'
              ? '⚠ Bạn chưa hoàn thành form'
              : '⚠ Chưa thể tải dữ liệu'}
          </Text>
          <Label muted>
            {type === 'error'
              ? 'Kiểm tra kết nối rồi thử lại.'
              : 'Thông báo trạng thái trong luồng giao diện.'}
          </Label>
          <Action
            secondary
            title="Đóng banner"
            onPress={() => setVisible(false)}
          />
        </View>
      )}
    </View>
  );
}
export function AccordionDemo() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <View style={s.demo}>
      {[
        [
          'Component là gì?',
          'Một hàm trả về giao diện React, có thể nhận props và quản lý state.',
        ],
        [
          'Props khác state thế nào?',
          'Props do cha truyền vào. State do component hoặc store quản lý.',
        ],
        [
          'Khi nào render lại?',
          'Khi state, props hoặc context liên quan thay đổi.',
        ],
      ].map(([question, answer], i) => (
        <Panel key={question}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: open === i }}
            onPress={() => setOpen(v => (v === i ? null : i))}
            style={s.between}
          >
            <Label>{question}</Label>
            <Label>{open === i ? '−' : '+'}</Label>
          </Pressable>
          {open === i && <Label muted>{answer}</Label>}
        </Panel>
      ))}
    </View>
  );
}

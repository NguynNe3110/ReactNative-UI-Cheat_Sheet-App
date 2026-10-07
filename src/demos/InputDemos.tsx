import React, { useMemo, useState } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import {
  Action,
  Field,
  Label,
  Note,
  Panel,
  useDemoTimeout,
} from '../components/Kit';
import { normalizeSearch } from '../data/catalog';
import { s, useTheme } from '../theme';

export function TextInputDemo() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState('');
  return (
    <View style={s.demo}>
      <Label>Tên của bạn</Label>
      <Field
        accessibilityLabel="Tên của bạn"
        placeholder="Nhập tên…"
        value={name}
        onChangeText={setName}
        returnKeyType="done"
        onSubmitEditing={() => {
          setSubmitted(name.trim());
          Keyboard.dismiss();
        }}
      />
      <Action
        title="Submit"
        onPress={() => {
          setSubmitted(name.trim());
          Keyboard.dismiss();
        }}
      />
      <Note>
        {submitted
          ? `Xin chào ${submitted}!`
          : 'Chưa submit. onChangeText cập nhật state theo mỗi ký tự.'}
      </Note>
    </View>
  );
}
export function MultilineDemo() {
  const [text, setText] = useState('');
  return (
    <View style={s.demo}>
      <Field
        accessibilityLabel="Ghi chú tối đa 160 ký tự"
        multiline
        maxLength={160}
        value={text}
        onChangeText={setText}
        placeholder="Ghi chú của bạn…"
        style={{ minHeight: 140, textAlignVertical: 'top' }}
      />
      <Label muted>{text.length}/160 ký tự</Label>
      <Action secondary title="Xóa nội dung" onPress={() => setText('')} />
    </View>
  );
}
export function PasswordDemo() {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);
  return (
    <View style={s.demo}>
      <Field
        accessibilityLabel="Mật khẩu demo"
        placeholder="Nhập mật khẩu demo"
        value={value}
        onChangeText={setValue}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
      />
      <Action
        secondary
        title={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        onPress={() => setVisible(v => !v)}
      />
      <Label muted>{value.length} ký tự · Nội dung chỉ ở trong state.</Label>
    </View>
  );
}
export function SearchDemo() {
  const [query, setQuery] = useState('');
  const items = useMemo(
    () =>
      ['Táo', 'Cam', 'Chuối', 'Dâu', 'Dưa hấu', 'Xoài'].filter(x =>
        normalizeSearch(x).includes(normalizeSearch(query)),
      ),
    [query],
  );
  return (
    <View style={s.demo}>
      <Field
        accessibilityLabel="Tìm trái cây"
        placeholder="Tìm trái cây, có hoặc không dấu…"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
      />
      <Panel>
        {items.length ? (
          items.map(x => <Label key={x}>{x}</Label>)
        ) : (
          <Label>Không có kết quả.</Label>
        )}
      </Panel>
      <Label muted>{items.length} kết quả</Label>
    </View>
  );
}
export function FormDemo() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const delay = useDemoTimeout();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  return (
    <View style={s.demo}>
      <Label>Email</Label>
      <Field
        accessibilityLabel="Email"
        placeholder="ban@example.com"
        inputMode="email"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={value => {
          setEmail(value);
          setStatus('');
        }}
        onBlur={() => setTouched(true)}
        editable={!loading}
      />
      {touched && !valid && (
        <Label>⚠ Nhập email có dạng ten@example.com.</Label>
      )}
      <Action
        disabled={loading}
        title={loading ? 'Đang xử lý…' : 'Submit form'}
        onPress={() => {
          setTouched(true);
          Keyboard.dismiss();
          if (!valid) {
            return;
          }
          setLoading(true);
          delay(() => {
            setLoading(false);
            setStatus(
              '✓ Form hợp lệ. Đây là submit mô phỏng, không gửi dữ liệu.',
            );
          });
        }}
      />
      <Text accessibilityLiveRegion="polite">
        <Label>{status}</Label>
      </Text>
    </View>
  );
}
export function SwitchDemo() {
  const t = useTheme();
  const [value, setValue] = useState(true);
  return (
    <View style={s.demo}>
      <Panel>
        <View style={s.between}>
          <Label>Nhắc học mỗi ngày (demo)</Label>
          <Switch
            accessibilityLabel="Nhắc học mỗi ngày"
            value={value}
            onValueChange={setValue}
            trackColor={{ false: t.border, true: t.primary }}
          />
        </View>
      </Panel>
      <Note>value = {String(value)}. Switch chuyển giữa true và false.</Note>
      <View style={s.between}>
        <Label muted>Switch disabled</Label>
        <Switch value={false} disabled />
      </View>
    </View>
  );
}
export function CheckboxDemo() {
  const t = useTheme();
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <View style={s.demo}>
      {['Layout', 'Input', 'Animation'].map(x => {
        const checked = selected.includes(x);
        return (
          <Pressable
            key={x}
            accessibilityRole="checkbox"
            accessibilityLabel={x}
            accessibilityState={{ checked }}
            onPress={() =>
              setSelected(prev =>
                checked ? prev.filter(v => v !== x) : [...prev, x],
              )
            }
            style={[s.row, { paddingVertical: 10 }]}
          >
            <View
              style={[
                s.center,
                {
                  height: 28,
                  width: 28,
                  borderRadius: 7,
                  borderWidth: 2,
                  borderColor: t.primary,
                  backgroundColor: checked ? t.primary : 'transparent',
                },
              ]}
            >
              <Text style={{ color: t.onPrimary }}>{checked ? '✓' : ''}</Text>
            </View>
            <Label>{x}</Label>
          </Pressable>
        );
      })}
      <Note>Đã chọn: {selected.join(', ') || 'chưa chọn'}</Note>
    </View>
  );
}
export function RadioDemo() {
  const t = useTheme();
  const [value, setValue] = useState('Cơ bản');
  return (
    <View style={s.demo}>
      {['Cơ bản', 'Trung cấp', 'Nâng cao'].map(x => (
        <Pressable
          key={x}
          accessibilityRole="radio"
          accessibilityLabel={x}
          accessibilityState={{ checked: value === x }}
          onPress={() => setValue(x)}
          style={[s.row, { paddingVertical: 12 }]}
        >
          <View
            style={[
              s.center,
              {
                width: 28,
                height: 28,
                borderRadius: 14,
                borderWidth: 2,
                borderColor: t.primary,
              },
            ]}
          >
            {value === x && (
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: t.primary,
                }}
              />
            )}
          </View>
          <Label>{x}</Label>
        </Pressable>
      ))}
      <Note>Một state duy nhất: {value}</Note>
    </View>
  );
}
export function SegmentedDemo() {
  const t = useTheme();
  const [value, setValue] = useState('Ngày');
  return (
    <View style={s.demo}>
      <View
        style={[
          s.row,
          { backgroundColor: t.soft, padding: 6, borderRadius: 16 },
        ]}
      >
        {['Ngày', 'Tuần', 'Tháng'].map(x => (
          <Pressable
            key={x}
            accessibilityRole="tab"
            accessibilityState={{ selected: value === x }}
            onPress={() => setValue(x)}
            style={[
              s.button,
              {
                flex: 1,
                paddingHorizontal: 6,
                backgroundColor: value === x ? t.primary : 'transparent',
              },
            ]}
          >
            <Text style={{ color: value === x ? t.onPrimary : t.muted }}>
              {x}
            </Text>
          </Pressable>
        ))}
      </View>
      <Panel>
        <Label>Thống kê theo {value.toLowerCase()}</Label>
        <Label muted>UI thay đổi theo selected value.</Label>
      </Panel>
    </View>
  );
}
export function StepperDemo() {
  const [value, setValue] = useState(1);
  return (
    <View style={s.demo}>
      <View style={s.between}>
        <Action
          title="−"
          disabled={value === 0}
          onPress={() => setValue(v => Math.max(0, v - 1))}
        />
        <Label>Số lượng: {value}</Label>
        <Action
          title="+"
          disabled={value === 10}
          onPress={() => setValue(v => Math.min(10, v + 1))}
        />
      </View>
      <Note>Giới hạn [0, 10]. Nút bị disabled ở hai đầu.</Note>
    </View>
  );
}
export function RatingDemo() {
  const t = useTheme();
  const [value, setValue] = useState(3);
  return (
    <View style={s.demo}>
      <View style={s.wrap}>
        {[1, 2, 3, 4, 5].map(x => (
          <Pressable
            key={x}
            accessibilityRole="button"
            accessibilityLabel={`${x} sao`}
            accessibilityState={{ selected: value === x }}
            onPress={() => setValue(x)}
            style={{ padding: 6, minWidth: 44, minHeight: 48 }}
          >
            <Text
              style={{ fontSize: 32, color: x <= value ? t.warning : t.border }}
            >
              ★
            </Text>
          </Pressable>
        ))}
      </View>
      <Note>Điểm của bạn: {value}/5</Note>
    </View>
  );
}
export function OTPDemo() {
  const t = useTheme();
  const [value, setValue] = useState('');
  return (
    <View style={s.demo}>
      <Field
        accessibilityLabel="Mã OTP sáu số"
        placeholder="Nhập hoặc paste mã sáu số"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={value}
        onChangeText={text => setValue(text.replace(/\D/g, ''))}
      />
      <View style={[s.row, { gap: 6 }]}>
        {Array.from({ length: 6 }, (_, i) => (
          <View
            key={i}
            style={[
              s.center,
              {
                flex: 1,
                height: 52,
                borderRadius: 10,
                backgroundColor: t.soft,
                borderWidth: 1,
                borderColor: value[i] ? t.primary : t.border,
              },
            ]}
          >
            <Label>{value[i] || '·'}</Label>
          </View>
        ))}
      </View>
      <Note>
        {value.length === 6
          ? '✓ Đã nhập đủ mã (chưa xác thực).'
          : `Còn ${6 - value.length} chữ số.`}
      </Note>
    </View>
  );
}
export function SliderDemo() {
  const t = useTheme();
  const [value, setValue] = useState(40);
  return (
    <View style={s.demo}>
      <Label>Âm lượng: {Math.round(value)}%</Label>
      <Slider
        accessibilityLabel="Âm lượng demo"
        style={{ height: 50, width: '100%' }}
        value={value}
        minimumValue={0}
        maximumValue={100}
        step={5}
        minimumTrackTintColor={t.primary}
        maximumTrackTintColor={t.border}
        thumbTintColor={t.primary}
        onValueChange={setValue}
      />
      <Note>
        Slider native · step = 5. Đây là state demo, không đổi âm lượng hệ
        thống.
      </Note>
    </View>
  );
}
export function PickerDemo() {
  const t = useTheme();
  const [value, setValue] = useState('React Native');
  return (
    <View style={s.demo}>
      <Panel>
        <Picker
          accessibilityLabel="Chọn framework"
          selectedValue={value}
          style={{ color: t.text }}
          dropdownIconColor={t.primary}
          onValueChange={item => setValue(String(item))}
        >
          <Picker.Item label="React Native" value="React Native" />
          <Picker.Item label="Kotlin / Compose" value="Kotlin / Compose" />
          <Picker.Item label="Flutter" value="Flutter" />
        </Picker>
      </Panel>
      <Note>selectedValue = {value}</Note>
    </View>
  );
}
function DateTimeDemo({ mode }: { mode: 'date' | 'time' }) {
  const [date, setDate] = useState(new Date(2026, 9, 7, 9, 30));
  const [open, setOpen] = useState(false);
  return (
    <View style={s.demo}>
      <Note>
        {mode === 'date'
          ? date.toLocaleDateString('vi-VN')
          : date.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
      </Note>
      <Action
        title={mode === 'date' ? 'Chọn ngày' : 'Chọn giờ'}
        onPress={() => setOpen(true)}
      />
      {open && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, next) => {
            if (Platform.OS !== 'ios') {
              setOpen(false);
            }
            if (event.type === 'set' && next) {
              setDate(next);
            }
          }}
        />
      )}
      {open && Platform.OS === 'ios' && (
        <Action secondary title="Xong" onPress={() => setOpen(false)} />
      )}
      <Label muted>Hủy picker giữ giá trị cũ.</Label>
    </View>
  );
}
export function DatePickerDemo() {
  return <DateTimeDemo mode="date" />;
}
export function TimePickerDemo() {
  return <DateTimeDemo mode="time" />;
}

import React, { useEffect, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  AppState,
  BackHandler,
  Dimensions,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  PermissionsAndroid,
  PixelRatio,
  Platform,
  Share,
  StatusBar,
  ToastAndroid,
  Vibration,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { Action, Field, Label, Note, Panel } from '../components/Kit';
import { s, useTheme } from '../theme';

export function KeyboardDemo() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setVisible(true),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return (
    <View style={s.demo}>
      <Field
        accessibilityLabel="Input mở bàn phím"
        placeholder="Chạm để mở bàn phím"
      />
      <Action title="Keyboard.dismiss()" onPress={Keyboard.dismiss} />
      <Note>keyboardDidShow/Hide: {visible ? 'Đang hiện' : 'Đang ẩn'}</Note>
    </View>
  );
}
export function KeyboardAvoidingDemo() {
  return (
    <KeyboardAvoidingView
      style={s.fill}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 180 : 0}
    >
      <View style={[s.demo, s.fill, { justifyContent: 'space-between' }]}>
        <Note>Input ở cuối vùng preview. Mở bàn phím để thử layout.</Note>
        <View style={s.stack}>
          <Field
            accessibilityLabel="Input cuối màn hình"
            placeholder="Nhập nội dung…"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
          <Action title="Đóng bàn phím" onPress={Keyboard.dismiss} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
export function InputAccessoryDemo() {
  const t = useTheme();
  const [value, setValue] = useState('');
  return (
    <View style={s.demo}>
      <Field
        accessibilityLabel="Input có toolbar"
        placeholder="Input với toolbar iOS"
        value={value}
        onChangeText={setValue}
        inputAccessoryViewID={
          Platform.OS === 'ios' ? 'cheat-sheet-toolbar' : undefined
        }
      />
      {Platform.OS === 'ios' ? (
        <InputAccessoryView nativeID="cheat-sheet-toolbar">
          <View style={{ padding: 12, backgroundColor: t.surface }}>
            <Action title="Xong" onPress={Keyboard.dismiss} />
          </View>
        </InputAccessoryView>
      ) : (
        <Panel>
          <Label muted>Android: toolbar trong layout thường.</Label>
          <Action title="Xong" onPress={Keyboard.dismiss} />
        </Panel>
      )}
    </View>
  );
}
export function StatusBarDemo() {
  const [light, setLight] = useState(true);
  return (
    <View style={s.demo}>
      <StatusBar barStyle={light ? 'light-content' : 'dark-content'} animated />
      <Action
        title={`barStyle: ${light ? 'light-content' : 'dark-content'}`}
        onPress={() => setLight(v => !v)}
      />
      <Note>
        Quan sát thanh trạng thái thiết bị. Thử cả hai kiểu chữ để thấy độ tương
        phản. Khi rời demo, StatusBar của app được khôi phục.
      </Note>
    </View>
  );
}
export function PlatformDemo() {
  return (
    <View style={s.demo}>
      <Panel>
        <Label>Platform.OS: {Platform.OS}</Label>
        <Label>Platform.Version: {String(Platform.Version)}</Label>
        <Label>
          Platform.select:{' '}
          {Platform.select({
            android: 'Android branch',
            ios: 'iOS branch',
            default: 'Other platform',
          })}
        </Label>
      </Panel>
      <Note>Chọn hành vi phù hợp nền tảng trong cùng component.</Note>
    </View>
  );
}
export function DimensionsDemo() {
  const { width, height, scale, fontScale } = useWindowDimensions();
  const screen = Dimensions.get('screen');
  return (
    <View style={s.demo}>
      <Panel>
        <Label>
          Window: {Math.round(width)} × {Math.round(height)} dp
        </Label>
        <Label>
          Screen: {Math.round(screen.width)} × {Math.round(screen.height)} dp
        </Label>
        <Label>
          scale: {scale} · fontScale: {fontScale}
        </Label>
        <Label>PixelRatio.get(): {PixelRatio.get()}</Label>
        <Label>
          24 dp ≈ {PixelRatio.getPixelSizeForLayoutSize(24)} physical px
        </Label>
      </Panel>
      <Note>
        Hook cập nhật khi cửa sổ đổi kích thước. Không dùng physical px làm
        layout size.
      </Note>
    </View>
  );
}
export function AppStateDemo() {
  const [current, setCurrent] = useState<string>(
    AppState.currentState || 'chưa xác định',
  );
  const [changes, setChanges] = useState(0);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', next => {
      setCurrent(next);
      setChanges(v => v + 1);
    });
    return () => subscription.remove();
  }, []);
  return (
    <View style={s.demo}>
      <Note>AppState: {current}</Note>
      <Label>Đã nhận {changes} sự kiện change.</Label>
      <Label muted>Về màn hình Home hệ thống rồi mở app lại.</Label>
    </View>
  );
}
export function LinkingDemo() {
  const [message, setMessage] = useState('');
  return (
    <View style={s.demo}>
      <Action
        title="Mở reactnative.dev"
        onPress={() => {
          Linking.openURL('https://reactnative.dev/docs/components-and-apis')
            .then(() => setMessage('Đã yêu cầu mở trình duyệt.'))
            .catch(() =>
              setMessage('Không có ứng dụng xử lý URL hoặc không mở được.'),
            );
        }}
      />
      <Note>{message || 'openURL trả Promise; luôn xử lý lỗi.'}</Note>
    </View>
  );
}
export function ShareDemo() {
  const [message, setMessage] = useState('');
  return (
    <View style={s.demo}>
      <Action
        title="Mở bảng chia sẻ"
        onPress={() => {
          Share.share({
            title: 'RN UI Cheat Sheet',
            message:
              'Mình đang học component React Native với RN UI Cheat Sheet!',
          })
            .then(result =>
              setMessage(
                result.action === Share.sharedAction
                  ? 'Share sheet trả về sharedAction.'
                  : 'Đã đóng share sheet.',
              ),
            )
            .catch(() => setMessage('Không mở được share sheet.'));
        }}
      />
      <Note>
        {message || 'Bạn chọn đích và hoàn tất chia sẻ trong bảng native.'}
      </Note>
    </View>
  );
}
export function VibrationDemo() {
  useEffect(() => () => Vibration.cancel(), []);
  return (
    <View style={s.demo}>
      <Action title="Rung một lần" onPress={() => Vibration.vibrate(120)} />
      <Action secondary title="Dừng rung" onPress={Vibration.cancel} />
      <Note>
        Thiết bị phải hỗ trợ rung. Android dùng duration 120 ms; iOS dùng rung
        hệ thống.
      </Note>
    </View>
  );
}
export function ToastDemo() {
  const [message, setMessage] = useState('');
  return (
    <View style={s.demo}>
      <Action
        title="Hiện toast"
        onPress={() => {
          if (Platform.OS === 'android') {
            ToastAndroid.show('Xin chào từ React Native!', ToastAndroid.SHORT);
          } else {
            setMessage(
              'iOS: ToastAndroid không khả dụng. Đây là feedback trong layout.',
            );
          }
        }}
      />
      <Note>{message || 'ToastAndroid.show(message, ToastAndroid.SHORT)'}</Note>
    </View>
  );
}
export function PermissionsDemo() {
  const [message, setMessage] = useState('Chưa kiểm tra');
  return (
    <View style={s.demo}>
      <Action
        title="Kiểm tra quyền CAMERA"
        onPress={() => {
          if (Platform.OS !== 'android') {
            setMessage('PermissionsAndroid chỉ dùng Android.');
            return;
          }
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
            .then(granted =>
              setMessage(
                granted
                  ? 'Đã cấp quyền'
                  : 'Chưa cấp quyền. Demo không yêu cầu cấp quyền.',
              ),
            )
            .catch(() => setMessage('Không kiểm tra được quyền.'));
        }}
      />
      <Note>{message}</Note>
      <Label muted>
        Không mở camera và không yêu cầu quyền. Để request khi phát triển camera
        thật, cần khai báo manifest.
      </Label>
    </View>
  );
}
export function ActionSheetDemo() {
  const [value, setValue] = useState('Chưa chọn');
  const open = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Hủy', 'Lưu demo', 'Xóa demo'],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 2,
        },
        index => setValue(['Hủy', 'Lưu demo', 'Xóa demo'][index]),
      );
    } else {
      Alert.alert(
        'Android fallback',
        'ActionSheetIOS không khả dụng trên Android.',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Lưu demo', onPress: () => setValue('Lưu demo') },
          { text: 'Xóa demo', onPress: () => setValue('Xóa demo') },
        ],
      );
    }
  };
  return (
    <View style={s.demo}>
      <Action title="Mở action sheet" onPress={open} />
      <Note>{value}</Note>
    </View>
  );
}
export function BackDemo() {
  const [enabled, setEnabled] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!enabled || Platform.OS !== 'android') {
      return;
    }
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        setCount(v => v + 1);
        setEnabled(false);
        return true;
      },
    );
    return () => subscription.remove();
  }, [enabled]);
  return (
    <View style={s.demo}>
      <Action
        title={enabled ? 'Tắt handler' : 'Bắt một lần nút Back'}
        onPress={() => setEnabled(v => !v)}
      />
      <Note>
        {Platform.OS === 'android'
          ? `Đã bắt ${count} lần. ${
              enabled
                ? 'Bấm Back hệ thống để thử.'
                : 'Back bình thường sẽ thoát bài học.'
            }`
          : 'BackHandler hardware chỉ áp dụng Android.'}
      </Note>
    </View>
  );
}
export function AppearanceDemo() {
  const scheme = useColorScheme();
  const t = useTheme();
  return (
    <View style={s.demo}>
      <Panel>
        <Label>Theme hệ thống: {scheme || 'không xác định'}</Label>
        <Label>
          Theme app: {t.background === '#101321' ? 'dark' : 'light'}
        </Label>
      </Panel>
      <Note>
        useColorScheme tự cập nhật theo hệ thống. Nút theme trong app có thể
        override bằng lựa chọn của bạn.
      </Note>
    </View>
  );
}
export function ClipboardDemo() {
  const [value, setValue] = useState('Hello React Native');
  const [message, setMessage] = useState('');
  return (
    <View style={s.demo}>
      <Field
        accessibilityLabel="Nội dung copy"
        value={value}
        onChangeText={setValue}
      />
      <Action
        title="Copy vào clipboard"
        onPress={() => {
          Clipboard.setString(value);
          setMessage('Đã copy.');
        }}
      />
      <Action
        secondary
        title="Đọc clipboard"
        onPress={() => {
          Clipboard.getString()
            .then(text => setMessage(`Clipboard: ${text || '(trống)'}`))
            .catch(() => setMessage('Không đọc được clipboard.'));
        }}
      />
      <Note>{message || 'Chỉ đọc clipboard khi bạn bấm nút.'}</Note>
    </View>
  );
}
const localHTML =
  '<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="background:#eeeefc;color:#242338;font:16px sans-serif;padding:24px"><h2>Hello from WebView.</h2><p>Đây là HTML local trong một native WebView.</p><button style="background:#6955e8;color:white;border:0;border-radius:12px;padding:16px" onclick="window.ReactNativeWebView.postMessage(\'Xin chào từ HTML!\')">Gửi message về React Native</button></body></html>';
export function WebViewDemo() {
  const [message, setMessage] = useState('Chưa nhận message');
  return (
    <View style={[s.demo, s.fill]}>
      <Label>HTML local · hoạt động offline</Label>
      <View style={{ height: 280, borderRadius: 18, overflow: 'hidden' }}>
        <WebView
          source={{ html: localHTML, baseUrl: 'about:blank' }}
          originWhitelist={['*']}
          onShouldStartLoadWithRequest={request =>
            request.url === 'about:blank' ||
            request.url.startsWith('data:text/html')
          }
          javaScriptEnabled
          onMessage={event => setMessage(event.nativeEvent.data)}
        />
      </View>
      <Note>{message}</Note>
    </View>
  );
}
const DEMO_STORAGE_KEY = '@rn-cheat-sheet/demo-note';
export function StorageDemo() {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(DEMO_STORAGE_KEY)
      .then(saved => {
        if (active) {
          setValue(saved || '');
        }
      })
      .catch(() => {
        if (active) {
          setMessage('Không đọc được ghi chú đã lưu.');
        }
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <View style={s.demo}>
      <Field
        accessibilityLabel="Ghi chú lưu local"
        placeholder="Ghi chú sẽ lưu trên thiết bị…"
        value={value}
        onChangeText={setValue}
      />
      <Action
        title="Lưu ghi chú"
        onPress={() => {
          AsyncStorage.setItem(DEMO_STORAGE_KEY, value)
            .then(() =>
              setMessage('✓ Đã lưu. Rời màn hình rồi quay lại để kiểm tra.'),
            )
            .catch(() => setMessage('Không lưu được.'));
        }}
      />
      <Action
        secondary
        title="Đọc lại"
        onPress={() => {
          AsyncStorage.getItem(DEMO_STORAGE_KEY)
            .then(saved => {
              setValue(saved || '');
              setMessage(
                saved === null ? 'Chưa có dữ liệu.' : 'Đã đọc dữ liệu local.',
              );
            })
            .catch(() => setMessage('Không đọc được.'));
        }}
      />
      <Action
        secondary
        title="Xóa ghi chú đã lưu"
        onPress={() => {
          AsyncStorage.removeItem(DEMO_STORAGE_KEY)
            .then(() => {
              setValue('');
              setMessage('Đã xóa ghi chú demo.');
            })
            .catch(() => setMessage('Không xóa được.'));
        }}
      />
      <Note>
        {message || 'Không mã hóa. Không lưu token hoặc mật khẩu ở đây.'}
      </Note>
    </View>
  );
}

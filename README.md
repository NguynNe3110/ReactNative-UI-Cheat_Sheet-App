# React Native UI Cheat Sheet App

**90 mục trong 9 nhóm**, gồm demo tương tác, source code thật, props/API, lưu ý, bài tập nhỏ và liên kết tài liệu. App dùng React Native **0.87.1**, React **19.2.3**, TypeScript và New Architecture.

## Chạy trên Windows / Android

```powershell
cd D:\AppData\Code\ReactNative\RN_ui_cheat_sheet_app
npm.cmd install
npm.cmd start
```

Giữ Metro trong terminal này. Mở máy ảo hoặc kết nối điện thoại, rồi ở terminal thứ hai:

```powershell
cd D:\AppData\Code\ReactNative\RN_ui_cheat_sheet_app
adb devices
npm.cmd run android
```

Nếu điện thoại chưa kết nối Metro: `adb reverse tcp:8081 tcp:8081`. Sau khi thêm/sửa dependency native cần build lại bằng `npm.cmd run android`; sửa TSX thường chỉ cần Fast Refresh.

Tên folder: `RN_ui_cheat_sheet_app`. Tên hiển thị: **RN UI Cheat Sheet**. Tên module đăng ký cho Android/iOS: `RNUICheatSheet`. Android applicationId giữ `com.firsttestcli` để cập nhật bản app đã cài. Target/scheme Xcode đã đổi thành `RNUICheatSheet`.

## Sử dụng

- **Tra cứu:** tìm theo tên, props hoặc mô tả; hỗ trợ tiếng Việt có/không dấu và nhiều từ khóa. Lọc theo 9 nhóm.
- **Thử trực tiếp:** thao tác trong preview. Nút ↻ reset state của demo.
- **Code:** source trích tự động từ file đang chạy. Copy bằng Clipboard native. Import/helper dùng chung được ghi rõ.
- **Ghi chú:** props/API cần nhớ, giới hạn nền tảng, lưu ý và một bài tập để tự sửa code.
- **★ Đã lưu:** đánh dấu component muốn quay lại.
- **Đánh dấu đã học:** tiến độ lưu bằng AsyncStorage, vẫn còn khi đóng/mở app.
- **Lộ trình:** 5 chặng học, tiến độ theo nhóm, bảng liên hệ Kotlin Compose / Flutter.
- **Theme:** sáng, tối hoặc theo hệ thống; lựa chọn được lưu local.

Phần lớn demo chạy offline. Ảnh được bundle local, WebView dùng HTML local. Mở tài liệu cần mạng. Share, Clipboard, Vibration và Linking chỉ thực hiện sau khi bạn bấm nút. Demo quyền camera chỉ kiểm tra trạng thái, không xin quyền hay mở camera.

## Nội dung

| Nhóm | Số mục | Điểm chính |
| --- | ---: | --- |
| Layout | 11 | View, Flexbox, spacing, position, wrap, aspect ratio, safe area, responsive, StyleSheet, RTL, migration |
| Hiển thị | 10 | Text, typography, Image, ảnh nền, card, avatar, badge/chip, divider, empty state, accessibility |
| Nhập liệu | 16 | TextInput, multiline, password, search, form, Switch, checkbox, radio, segmented, stepper, rating, OTP, Slider, Picker, ngày/giờ |
| Tương tác | 7 | Button, Pressable, các Touchable, FAB |
| Danh sách | 8 | ScrollView, cuộn ngang, FlatList, SectionList, VirtualizedList, grid, refresh, pagination |
| Phản hồi | 10 | ActivityIndicator, progress, skeleton, Alert, Modal, sheet, snackbar, tooltip, banner, accordion |
| Điều hướng | 6 | Tabs, bottom navigation, drawer, stack, breadcrumbs, migration DrawerLayoutAndroid |
| Chuyển động | 4 | Animated timing/spring, interpolation, LayoutAnimation, PanResponder |
| Thiết bị | 18 | Keyboard, keyboard avoiding/accessory, StatusBar, Platform, Dimensions/PixelRatio, AppState, Linking, Share, Vibration, Toast, permissions, action sheet, BackHandler, Appearance, Clipboard, WebView, AsyncStorage |

Danh sách từng bài và đường dẫn file: [COMPONENT_INDEX.md](docs/COMPONENT_INDEX.md). Hướng dẫn đọc/sửa component: [HOC-COMPONENT.md](docs/HOC-COMPONENT.md).

Phạm vi gồm các component UI core ổn định được tài liệu RN 0.87 liệt kê, API liên quan giao diện, thư viện native phổ biến và các pattern tự ghép. **ImageBackground, SafeAreaView core và DrawerLayoutAndroid** có bài giải thích deprecated và demo cách thay thế. Không dùng các export experimental/unstable để làm nền tảng bài học.

React Native không có sẵn Card, Checkbox, Radio, BottomSheet hay router hoàn chỉnh như một bộ Material UI. Nhãn mỗi bài chỉ rõ **RN core / API-Hook / UI tự ghép / Thư viện / Deprecated**. Drawer, sheet và navigation trong app là demo composition đơn giản; gesture snapping, router deep link, camera, maps, video và toàn bộ hệ sinh thái thư viện không thuộc phạm vi triển khai này. Các hướng học tiếp được ghi trong tab Lộ trình.

## Cấu trúc để học và mở rộng

```text
App.tsx                    Root, theme, safe area, navigation và Android Back
src/components/Kit.tsx     Label, Action, Field, Chip, Panel, timer cleanup
src/theme.tsx              Màu sáng/tối và các style dùng chung
src/data/catalog.ts        Metadata, props, bài tập, docs, tìm kiếm
src/data/demoSources.json  Code hiển thị trong app (được sinh tự động)
src/demos/*Demos.tsx        9 file nhóm: mỗi demo là một hàm export
src/demos/index.ts         Registry và danh sách demo có vùng cuộn riêng
src/screens/               Tra cứu, bài học và lộ trình
src/hooks/                 Preferences persistence và Reduce Motion
src/assets/landscape.png   Ảnh local cho demo Image
scripts/sync-examples.cjs  Đồng bộ code và chỉ mục bài học
__tests__/                 Smoke test demo và luồng học/lưu/tìm kiếm
```

Muốn thêm bài: export hàm trong file `*Demos.tsx`, thêm metadata tương ứng vào `catalog.ts`, rồi chạy `npm.cmd run sync-examples`. Nếu demo dùng list dọc, thêm tên vào `fullScreenDemos` để không lồng trong ScrollView dọc.

## Kiểm tra

```powershell
npm.cmd run sync-examples
npm.cmd run check
```

`check` kiểm tra code mẫu đã đồng bộ, TypeScript, ESLint, Jest. Tests có native mocks; chỉ xác minh render/logic JS, không thay thế việc thử gesture, bàn phím, TalkBack và picker trên thiết bị thật.

Build Android độc lập:

```powershell
cd android
.\gradlew.bat assembleDebug
```

APK: `android/app/build/outputs/apk/debug/app-debug.apk`. Bản debug cần Metro. Thư mục `artifacts/` chỉ chứa log và ảnh xác minh local, được Git bỏ qua.

Build iOS cần macOS/Xcode; trên máy Mac chạy `bundle install`, `cd ios`, `bundle exec pod install`, rồi `npm run ios` ở project root. iOS-specific examples có chú thích/fallback trên Android; chưa thể xác minh native iOS từ Windows.

## Tài liệu gốc

- [React Native 0.87 components & APIs](https://reactnative.dev/docs/0.87/components-and-apis)
- [React fundamentals](https://reactnative.dev/docs/intro-react)
- [React Native accessibility](https://reactnative.dev/docs/accessibility)
- [React Native Safe Area Context](https://appandflow.github.io/react-native-safe-area-context/)
- [AsyncStorage 2.x usage](https://react-native-async-storage.github.io/async-storage/docs/usage/)
- [Slider](https://github.com/callstack/react-native-slider), [Picker](https://github.com/react-native-picker/picker), [DateTimePicker](https://github.com/react-native-datetimepicker/datetimepicker)
- [WebView](https://github.com/react-native-webview/react-native-webview), [Clipboard](https://github.com/react-native-clipboard/clipboard)

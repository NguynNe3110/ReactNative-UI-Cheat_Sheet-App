# Học component bằng app này

## 1. Component là một hàm trả về UI

```tsx
import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';

function Counter({label}: {label: string}) {
  const [count, setCount] = useState(0);
  return (
    <View style={{padding: 20, gap: 12}}>
      <Text>{label}: {count}</Text>
      <Pressable onPress={() => setCount(previous => previous + 1)}>
        <Text>Tăng</Text>
      </Pressable>
    </View>
  );
}
```

`label` là **prop**, do component cha truyền. `count` là **state**, được Counter quản lý. `setCount` yêu cầu React render lại. `View`, `Text`, `Pressable` là các component native core được ghép thành một component tự tạo.

Mỗi bài trong `src/demos` dùng cùng cách này. Bạn có thể sửa demo ngay trong file của nhóm và quan sát Fast Refresh.

## 2. JSX, composition và children

JSX có dạng `<View><Text>Xin chào</Text></View>`. Biểu thức JavaScript được đặt trong `{}`. Điều kiện hiển thị dùng `condition && <Text>...</Text>` hoặc toán tử ba ngôi. Khi `map()` tạo danh sách con, cần `key` ổn định.

Các helper trong `Kit.tsx` nhận `children`, là UI mà bạn truyền vào giữa hai tag. Ví dụ `<Panel><Label>Nội dung</Label></Panel>` cho phép tái sử dụng khung mà không cố định nội dung.

Trong RN, chuỗi hiển thị phải ở trong `Text`. Không dùng các tag web như `div`, `span`, `input` trong app native.

## 3. State và callback

TextInput và Switch là **controlled** khi `value` lấy từ state và callback cập nhật state. Nếu chỉ truyền `value` mà không cập nhật khi thao tác, UI sẽ quay về giá trị cũ.

Khi giá trị mới phụ thuộc giá trị cũ, dùng functional update: `setCount(prev => prev + 1)`. Không mutate array/object trong state; tạo array/object mới để React thấy thay đổi.

## 4. Hook và vòng đời

- `useState`: giữ state và cập nhật UI.
- `useEffect`: đăng ký listener hoặc bắt đầu công việc bên ngoài render; trả cleanup để bỏ listener/timer.
- `useRef`: giữ giá trị không cần render lại, như Animated.Value hoặc cờ đang nạp dữ liệu.
- `useMemo`: tính lại dữ liệu khi dependency thay đổi; không thay thế correctness của logic.
- `useContext`: lấy theme được Provider truyền xuống.

Hook phải gọi ở cấp đầu của component/custom hook, không gọi trong vòng lặp hay điều kiện. Xem `AppStateDemo`, `KeyboardDemo`, `SkeletonDemo` và `usePreferences` để hiểu cleanup.

## 5. Style khác CSS web

Style là object JavaScript hoặc mảng object, dùng tên camelCase. Mặc định Flexbox là `column`. Đơn vị kích thước thường là số dp, không phải chuỗi `"16px"`. Dùng `gap`, `padding` và `margin` có mục đích riêng. Style đứng sau trong mảng sẽ ghi đè style trước.

Một số thuộc tính phụ thuộc phiên bản và nền tảng. Không giả định CSS web có thể copy nguyên sang RN.

## 6. Cách đọc một demo

1. Mở tab **Thử trực tiếp** và thực hiện bài tập nhỏ.
2. Mở **Code**, tìm state đầu hàm và callback cập nhật nó.
3. Xem các native component được ghép lại.
4. Mở file được ghi phía trên đoạn code. Helper `Action/Field/Note` nằm trong `Kit.tsx`; style và theme nằm trong `theme.tsx`.
5. Sửa một prop, lưu file và quan sát. Bấm ↻ để reset demo.
6. Chạy `npm.cmd run sync-examples` sau khi sửa, để tab Code lấy đúng source mới. `npm start` cũng chạy bước này tự động trước khi mở Metro.

## 7. Những lỗi nên chủ động thử

- Bỏ `onChangeText` của controlled input để thấy vì sao không nhập được.
- Đổi `flexDirection` mà giữ `alignItems/justifyContent` để phân biệt hai trục.
- Thử font hệ thống lớn và xoay màn hình.
- Tạo danh sách ngắn bằng ScrollView rồi so với FlatList 100 item.
- Quên cleanup listener sẽ gây callback lặp sau khi mở/rời màn hình nhiều lần.
- Khi thêm package native, Fast Refresh không thay thế bước build native.

## 8. Nền tảng và phạm vi

InputAccessoryView và ActionSheetIOS chỉ có trên iOS. ToastAndroid, PermissionsAndroid, TouchableNativeFeedback và hardware BackHandler dành cho Android. Các bài có nhãn nền tảng và fallback/giải thích rõ.

Các bài deprecated minh họa cách chuyển sang API hiện tại thay vì khuyến khích code mới dựa trên API cũ. Các pattern navigation/BottomSheet là bài học composition; khi làm sản phẩm có router, deep link và gesture phức tạp, hãy dùng thư viện chuyên dụng và đọc tài liệu của thư viện.

# Kết quả kiểm tra

Kiểm tra ngày 07/10/2026, trên Windows và thiết bị Android thật V2352A.

| Kiểm tra | Kết quả |
| --- | --- |
| Đồng bộ code mẫu và chỉ mục | 90 demo source đầy đủ, `sync-examples --check` pass |
| TypeScript | `tsc --noEmit` pass |
| ESLint | Pass, không còn warning/error trong code app |
| Jest | 95 tests pass: 90 demo render/cleanup, catalog/search/storage và luồng học/lưu |
| Android native build | `clean :app:assembleDebug` thành công với Java 21 |
| Cài trên thiết bị thật | APK cài thành công, app RNUICheatSheet mở bằng Fabric |
| Log khởi động app | Không có lỗi JavaScript hoặc AndroidRuntime của app |
| Giao diện trên thiết bị thật | Màn tra cứu, bài View và tab Code hiển thị đúng |
| Slider native | Kéo thanh trượt cập nhật giá trị tới 100% |
| WebView native | HTML local tải thành công, postMessage cập nhật nội dung React Native |

APK debug ở `android/app/build/outputs/apk/debug/app-debug.apk`; cần Metro để tải JS. Metro đã được mở từ đường dẫn project mới và kết nối thiết bị qua `adb reverse tcp:8081 tcp:8081`.

Jest sử dụng mock cho native modules nên kết quả render không đồng nghĩa mọi hành vi native đã được thử trên thiết bị. Keyboard, TalkBack, picker và gesture có thể khác giữa thiết bị/OS. iOS chưa build/test trên Windows; các bài chỉ dùng iOS có nhãn nền tảng và giải thích/fallback trên Android.

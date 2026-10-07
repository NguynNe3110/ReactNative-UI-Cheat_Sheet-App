import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Action, Label, Note, Panel } from '../components/Kit';
import { categories, kindLabels } from '../data/catalog';
import type { Lesson } from '../data/catalog';
import demoSources from '../data/demoSources.json';
import { demos, fullScreenDemos } from '../demos';
import { s, useTheme } from '../theme';

class DemoBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <View style={s.demo}>
        <Note>
          Demo chưa chạy được trên thiết bị này. Kiểm tra đã rebuild app sau khi
          thêm thư viện native, hoặc xem code và ghi chú.
        </Note>
      </View>
    ) : (
      this.props.children
    );
  }
}
type Props = {
  lesson: Lesson;
  favorite: boolean;
  learned: boolean;
  onBack: () => void;
  onFavorite: () => void;
  onLearned: () => void;
};
export function LessonScreen({
  lesson,
  favorite,
  learned,
  onBack,
  onFavorite,
  onLearned,
}: Props) {
  const t = useTheme();
  const [tab, setTab] = useState<'demo' | 'code' | 'notes'>('demo');
  const [message, setMessage] = useState('');
  const [revision, setRevision] = useState(0);
  const Demo = demos[lesson.demo];
  const source = (
    demoSources as Record<string, { file: string; code: string }>
  )[lesson.demo];
  return (
    <View style={s.fill}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, gap: 14 }}>
        <View style={s.between}>
          <Pressable
            testID="lesson-back"
            accessibilityRole="button"
            accessibilityLabel="Quay lại thư viện"
            onPress={onBack}
            style={[s.row, { minHeight: 44 }]}
          >
            <Text style={{ color: t.primary, fontSize: 24 }}>‹</Text>
            <Text style={{ color: t.primary, fontSize: 13, fontWeight: '700' }}>
              Thư viện
            </Text>
          </Pressable>
          <View style={s.row}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset demo"
              onPress={() => setRevision(v => v + 1)}
              style={{ padding: 10 }}
            >
              <Text style={{ color: t.primary, fontSize: 20 }}>↻</Text>
            </Pressable>
            <Pressable
              testID="lesson-favorite"
              accessibilityRole="button"
              accessibilityLabel={favorite ? 'Bỏ lưu bài học' : 'Lưu bài học'}
              accessibilityState={{ selected: favorite }}
              onPress={onFavorite}
              style={{ padding: 10 }}
            >
              <Text style={{ fontSize: 25, color: t.primary }}>
                {favorite ? '★' : '☆'}
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={{ gap: 6 }}>
          <Text
            style={{
              color: t.primary,
              fontWeight: '700',
              fontSize: 10,
              letterSpacing: 1.5,
            }}
          >
            {categories
              .find(c => c.id === lesson.category)
              ?.title.toUpperCase()}{' '}
            / {kindLabels[lesson.kind].toUpperCase()}
          </Text>
          <Text style={[s.title, { color: t.text }]}>{lesson.title}</Text>
          <Text style={[s.caption, { color: t.muted }]}>
            {lesson.description} · {lesson.platform}
          </Text>
        </View>
        <View style={s.row}>
          {(
            [
              { id: 'demo', title: 'Thử trực tiếp' },
              { id: 'code', title: 'Code' },
              { id: 'notes', title: 'Ghi chú' },
            ] as const
          ).map(item => (
            <Pressable
              key={item.id}
              testID={`lesson-tab-${item.id}`}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === item.id }}
              onPress={() => {
                setTab(item.id);
                setMessage('');
              }}
              style={{
                flex: 1,
                minHeight: 44,
                alignItems: 'center',
                justifyContent: 'center',
                borderBottomWidth: 3,
                borderColor: tab === item.id ? t.primary : t.border,
              }}
            >
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 13,
                  color: tab === item.id ? t.primary : t.muted,
                }}
              >
                {item.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View
        style={[
          s.fill,
          {
            margin: 16,
            borderWidth: 1,
            borderColor: t.border,
            borderRadius: 22,
            overflow: 'hidden',
            backgroundColor: t.surface,
          },
        ]}
      >
        {tab === 'demo' ? (
          <DemoBoundary key={revision}>
            {fullScreenDemos.has(lesson.demo) ? (
              <Demo />
            ) : (
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <Demo />
              </ScrollView>
            )}
          </DemoBoundary>
        ) : tab === 'code' ? (
          <ScrollView contentContainerStyle={{ padding: 18, gap: 14 }}>
            <Label>Code đang chạy trong demo</Label>
            <Text selectable style={[s.caption, { color: t.primary }]}>
              {source?.file}
            </Text>
            <Text style={[s.caption, { color: t.muted }]}>
              Trích từ file thật, kèm import và helper tại chỗ. Các helper dùng
              chung (Kit/theme) nằm trong src/components và src/theme. Mở file
              gốc khi muốn sửa hoặc chạy riêng.
            </Text>
            <Action
              title="Copy code"
              onPress={() => {
                Clipboard.setString(source?.code || '');
                setMessage('✓ Đã copy code vào clipboard.');
              }}
            />
            <View style={{ backgroundColor: t.code, borderRadius: 14 }}>
              <ScrollView horizontal contentContainerStyle={{ padding: 16 }}>
                <Text selectable style={s.code}>
                  {source?.code || 'Không tìm thấy source.'}
                </Text>
              </ScrollView>
            </View>
            {message ? <Label>{message}</Label> : null}
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 18, gap: 18 }}>
            <Panel>
              <Text style={[s.heading, { color: t.text }]}>
                Props / API cần nhớ
              </Text>
              {lesson.props.split(' · ').map(prop => (
                <Text
                  key={prop}
                  selectable
                  style={{
                    fontFamily: 'monospace',
                    color: t.primary,
                    fontSize: 14,
                    lineHeight: 24,
                  }}
                >
                  • {prop}
                </Text>
              ))}
            </Panel>
            <Note>{lesson.tip}</Note>
            <Panel>
              <Text style={[s.heading, { color: t.text }]}>Bài tập nhỏ</Text>
              <Label>{lesson.exercise}</Label>
            </Panel>
            <Action
              secondary
              title="Mở tài liệu chính thức ↗"
              onPress={() => {
                Linking.openURL(lesson.docs).catch(() =>
                  setMessage(
                    'Không mở được tài liệu. Thử lại bằng trình duyệt.',
                  ),
                );
              }}
            />
            <Text selectable style={[s.caption, { color: t.muted }]}>
              {lesson.docs}
            </Text>
            {message ? <Label>{message}</Label> : null}
          </ScrollView>
        )}
      </View>
      <View style={{ paddingHorizontal: 20, paddingBottom: 12, gap: 8 }}>
        {tab === 'demo' && (
          <Text numberOfLines={3} style={[s.caption, { color: t.muted }]}>
            Thử: {lesson.exercise}
          </Text>
        )}
        <Action
          testID="lesson-learned"
          secondary={learned}
          title={learned ? '✓ Đã học · chạm để bỏ đánh dấu' : 'Đánh dấu đã học'}
          onPress={onLearned}
        />
      </View>
    </View>
  );
}

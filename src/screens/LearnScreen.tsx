import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Action, Label, Note, Panel } from '../components/Kit';
import { categories, lessons } from '../data/catalog';
import type { Lesson } from '../data/catalog';
import { s, useTheme } from '../theme';

const stages = [
  {
    title: 'Dựng giao diện đầu tiên',
    category: 'layout',
    first: 'view',
    text: 'View → Flexbox → Text → Image. Hiểu composition trước khi thêm thư viện.',
  },
  {
    title: 'Cho giao diện phản ứng',
    category: 'input',
    first: 'textinput',
    text: 'useState, props, controlled input. Thử form, button, checkbox và picker.',
  },
  {
    title: 'Xử lý nhiều nội dung',
    category: 'list',
    first: 'flatlist',
    text: 'ScrollView cho ít nội dung. FlatList/SectionList cho dữ liệu dài và refresh.',
  },
  {
    title: 'Hoàn thiện trải nghiệm',
    category: 'feedback',
    first: 'modal',
    text: 'Loading, empty state, validation, modal, safe area và accessibility.',
  },
  {
    title: 'Chuyển động & nền tảng',
    category: 'motion',
    first: 'animated',
    text: 'Animated, gesture, bàn phím và API native. Thử trên thiết bị thật.',
  },
];
const comparisons = [
  ['View / flexDirection', 'Row, Column, Box', 'Row, Column, Container'],
  ['Text', 'Text', 'Text'],
  ['TextInput', 'TextField', 'TextField'],
  ['Pressable / Button', 'Button / clickable', 'Button / GestureDetector'],
  ['FlatList', 'LazyColumn', 'ListView.builder'],
  ['FlatList numColumns', 'LazyVerticalGrid', 'GridView.builder'],
  ['useState', 'remember + mutableStateOf', 'State + setState'],
  ['Props', 'Tham số composable', 'Tham số widget'],
  ['StyleSheet', 'Modifier', 'Style / decoration / padding'],
  ['Modal', 'Dialog', 'showDialog'],
  ['Animated', 'animate*AsState', 'AnimationController'],
];
export function LearnScreen({
  learned,
  onOpen,
  onCategory,
}: {
  learned: string[];
  onOpen: (item: Lesson) => void;
  onCategory: (id: string) => void;
}) {
  const t = useTheme();
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
      <Text
        style={{
          color: t.primary,
          fontSize: 11,
          letterSpacing: 2,
          fontWeight: '800',
        }}
      >
        YOUR LEARNING PATH
      </Text>
      <Text style={[s.title, { color: t.text }]}>Học từ những khối nhỏ.</Text>
      <Label muted>
        Mở demo → chạm thử → đọc code → sửa một giá trị → đánh dấu đã học. Tiến
        độ được lưu trên thiết bị.
      </Label>
      {stages.map((stage, i) => (
        <Panel key={stage.title}>
          <View style={s.row}>
            <View
              style={[
                s.center,
                {
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: t.soft,
                },
              ]}
            >
              <Text style={{ color: t.primary, fontWeight: '800' }}>
                0{i + 1}
              </Text>
            </View>
            <Text style={[s.heading, s.fill, { color: t.text }]}>
              {stage.title}
            </Text>
          </View>
          <Label muted>{stage.text}</Label>
          <Action
            secondary
            title="Bắt đầu bài đầu tiên ↗"
            onPress={() =>
              onOpen(lessons.find(item => item.id === stage.first)!)
            }
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => onCategory(stage.category)}
            style={{ paddingVertical: 8 }}
          >
            <Text style={{ color: t.primary, fontWeight: '600' }}>
              Xem cả nhóm →
            </Text>
          </Pressable>
        </Panel>
      ))}
      <Text style={[s.heading, { color: t.text }]}>Tiến độ theo nhóm</Text>
      <Panel>
        {categories.map(category => {
          const group = lessons.filter(item => item.category === category.id);
          const complete = group.filter(item =>
            learned.includes(item.id),
          ).length;
          return (
            <Pressable
              key={category.id}
              accessibilityRole="button"
              onPress={() => onCategory(category.id)}
              style={[s.between, { paddingVertical: 8 }]}
            >
              <Label>
                {category.icon} {category.title}
              </Label>
              <Text style={{ color: t.primary, fontWeight: '700' }}>
                {complete}/{group.length}
              </Text>
            </Pressable>
          );
        })}
      </Panel>
      <Text style={[s.heading, { color: t.text }]}>
        Từ Kotlin / Flutter sang React Native
      </Text>
      <Label muted>
        So sánh khái niệm để bạn liên hệ với app cheat sheet trước. Cách hoạt
        động giữa các framework có khác biệt.
      </Label>
      <ScrollView horizontal>
        <View style={{ width: 750 }}>
          <View style={[s.row, { backgroundColor: t.soft, padding: 14 }]}>
            {['React Native', 'Jetpack Compose', 'Flutter'].map(name => (
              <Text
                key={name}
                style={{ flex: 1, color: t.primary, fontWeight: '800' }}
              >
                {name}
              </Text>
            ))}
          </View>
          {comparisons.map(row => (
            <View
              key={row[0]}
              style={[
                s.row,
                {
                  padding: 14,
                  borderBottomWidth: 1,
                  borderColor: t.border,
                  alignItems: 'flex-start',
                },
              ]}
            >
              {row.map((cell, i) => (
                <Text
                  key={i}
                  style={{
                    flex: 1,
                    color: t.text,
                    fontSize: 13,
                    lineHeight: 20,
                  }}
                >
                  {cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <Note>
        RN core cung cấp các khối UI cơ bản. Card, Checkbox, Tabs, BottomSheet
        trong app là các ví dụ tự ghép. Slider, Picker, DateTimePicker, WebView,
        Clipboard, AsyncStorage và Safe Area dùng thư viện đã cài.
      </Note>
      <Panel>
        <Text style={[s.heading, { color: t.text }]}>Nên học gì tiếp?</Text>
        <Label muted>
          React Navigation cho router/deep link. Gesture Handler + Reanimated
          cho gesture phức tạp. FlashList cho list lớn. SVG, camera, maps và
          media là các nhánh thư viện riêng; không được giả lập thành native
          component trong app này.
        </Label>
      </Panel>
    </ScrollView>
  );
}

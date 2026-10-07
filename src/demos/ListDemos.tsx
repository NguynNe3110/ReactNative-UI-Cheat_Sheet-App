import React, { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  SectionList,
  Text,
  View,
  VirtualizedList,
} from 'react-native';
import { Action, Chip, Label, Note, useDemoTimeout } from '../components/Kit';
import { s, useTheme } from '../theme';

const initialItems = Array.from({ length: 100 }, (_, i) => ({
  id: String(i + 1),
  title: `Component item ${i + 1}`,
}));
export function ScrollDemo() {
  const t = useTheme();
  const [offset, setOffset] = useState(0);
  return (
    <View style={s.fill}>
      <View style={s.pad}>
        <Label>scrollY: {offset} dp</Label>
      </View>
      <ScrollView
        onScroll={event =>
          setOffset(Math.round(event.nativeEvent.contentOffset.y))
        }
        scrollEventThrottle={16}
        contentContainerStyle={s.demo}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <View
            key={i}
            style={[
              s.card,
              { height: 100, backgroundColor: t.soft, borderColor: t.border },
            ]}
          >
            <Label>Khối {i + 1}</Label>
            <Label muted>ScrollView render tất cả các khối.</Label>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
export function HorizontalDemo() {
  const t = useTheme();
  return (
    <View style={s.demo}>
      <Label>Vuốt ngang để xem thẻ</Label>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={232}
        decelerationRate="fast"
        contentContainerStyle={{ gap: 12 }}
      >
        {['View', 'Text', 'Image', 'Input', 'Modal'].map((x, i) => (
          <View
            key={x}
            style={[
              s.card,
              {
                width: 220,
                height: 200,
                backgroundColor: i % 2 ? t.primary : t.soft,
                borderColor: t.border,
                justifyContent: 'space-between',
              },
            ]}
          >
            <Text
              style={{
                color: i % 2 ? t.onPrimary : t.primary,
                fontSize: 44,
                fontWeight: '800',
              }}
            >
              0{i + 1}
            </Text>
            <Text
              style={{
                color: i % 2 ? t.onPrimary : t.text,
                fontSize: 22,
                fontWeight: '700',
              }}
            >
              {x}
            </Text>
          </View>
        ))}
      </ScrollView>
      <Note>Item 220 dp + gap 12 dp = snapToInterval 232 dp.</Note>
    </View>
  );
}
export function FlatListDemo() {
  const t = useTheme();
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <View style={s.fill}>
      <View style={s.pad}>
        <Label>100 item · Đang chọn: {selected || 'chưa chọn'}</Label>
      </View>
      <FlatList
        data={initialItems}
        extraData={selected}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          gap: 8,
        }}
        initialNumToRender={10}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: selected === item.id }}
            onPress={() => setSelected(item.id)}
            style={[
              s.card,
              {
                borderColor: selected === item.id ? t.primary : t.border,
                backgroundColor: selected === item.id ? t.soft : t.surface,
              },
            ]}
          >
            <Label>{item.title}</Label>
          </Pressable>
        )}
      />
    </View>
  );
}
export function SectionListDemo() {
  const t = useTheme();
  const sections = [
    { title: 'LAYOUT', data: ['View', 'Flexbox', 'SafeArea'] },
    { title: 'INPUT', data: ['TextInput', 'Switch', 'Slider', 'Picker'] },
    { title: 'FEEDBACK', data: ['Modal', 'Alert', 'ActivityIndicator'] },
    {
      title: 'ANIMATION',
      data: ['Animated', 'LayoutAnimation', 'PanResponder'],
    },
  ];
  return (
    <SectionList
      style={s.fill}
      sections={sections}
      stickySectionHeadersEnabled
      keyExtractor={item => item}
      contentContainerStyle={{ padding: 20 }}
      renderSectionHeader={({ section }) => (
        <View
          style={{ backgroundColor: t.soft, padding: 14, borderRadius: 10 }}
        >
          <Text
            style={{ color: t.primary, fontWeight: '800', letterSpacing: 2 }}
          >
            {section.title}
          </Text>
        </View>
      )}
      renderItem={({ item }) => (
        <View
          style={{ padding: 22, borderBottomWidth: 1, borderColor: t.border }}
        >
          <Label>{item}</Label>
        </View>
      )}
    />
  );
}
export function VirtualizedDemo() {
  const t = useTheme();
  const data = { size: 200, prefix: 'Record' };
  return (
    <View style={s.fill}>
      <View style={s.pad}>
        <Label>Data = {'{size: 200, prefix: "Record"}'}</Label>
      </View>
      <VirtualizedList
        data={data}
        getItemCount={collection => collection.size}
        getItem={(collection, index) => ({
          id: String(index),
          title: `${collection.prefix} ${index + 1}`,
        })}
        keyExtractor={item => item.id}
        initialNumToRender={8}
        contentContainerStyle={s.demo}
        renderItem={({ item }) => (
          <View
            style={[s.card, { backgroundColor: t.soft, borderColor: t.border }]}
          >
            <Label>{item.title}</Label>
          </View>
        )}
      />
    </View>
  );
}
export function GridDemo() {
  const t = useTheme();
  const [columns, setColumns] = useState(2);
  return (
    <View style={s.fill}>
      <View style={[s.row, s.pad]}>
        <Chip
          title="2 cột"
          selected={columns === 2}
          onPress={() => setColumns(2)}
        />
        <Chip
          title="3 cột"
          selected={columns === 3}
          onPress={() => setColumns(3)}
        />
      </View>
      <FlatList
        key={columns}
        numColumns={columns}
        data={initialItems.slice(0, 30)}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20, gap: 10 }}
        columnWrapperStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <View
            style={[
              s.center,
              {
                flex: 1,
                height: 100,
                backgroundColor: t.soft,
                borderRadius: 16,
              },
            ]}
          >
            <Text style={{ color: t.primary, fontSize: 24, fontWeight: '800' }}>
              {item.id}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
export function RefreshDemo() {
  const t = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [round, setRound] = useState(0);
  const delay = useDemoTimeout();
  const refresh = () => {
    if (refreshing) {
      return;
    }
    setRefreshing(true);
    delay(() => {
      setRound(v => v + 1);
      setRefreshing(false);
    }, 900);
  };
  return (
    <View style={s.fill}>
      <View style={s.pad}>
        <Label>Đã refresh {round} lần. Kéo từ đầu danh sách.</Label>
      </View>
      <FlatList
        data={initialItems.slice(0, 15)}
        keyExtractor={item => item.id}
        contentContainerStyle={s.demo}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[t.primary]}
            tintColor={t.primary}
          />
        }
        renderItem={({ item }) => (
          <View
            style={[s.card, { backgroundColor: t.soft, borderColor: t.border }]}
          >
            <Label>
              {item.title} · phiên {round}
            </Label>
          </View>
        )}
      />
    </View>
  );
}
export function PaginationDemo() {
  const t = useTheme();
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const busy = useRef(false);
  const delay = useDemoTimeout();
  const more = () => {
    if (busy.current || count >= 50) {
      return;
    }
    busy.current = true;
    setLoading(true);
    delay(() => {
      setCount(v => Math.min(50, v + 10));
      setLoading(false);
      busy.current = false;
    }, 800);
  };
  return (
    <View style={s.fill}>
      <View style={s.pad}>
        <Label>{count}/50 item · dữ liệu local mô phỏng</Label>
      </View>
      <FlatList
        data={initialItems.slice(0, count)}
        keyExtractor={item => item.id}
        onEndReached={more}
        onEndReachedThreshold={0.15}
        contentContainerStyle={s.demo}
        renderItem={({ item }) => (
          <View
            style={[s.card, { backgroundColor: t.soft, borderColor: t.border }]}
          >
            <Label>{item.title}</Label>
          </View>
        )}
        ListFooterComponent={
          <Action
            secondary
            disabled={loading || count >= 50}
            title={
              loading
                ? 'Đang nạp…'
                : count >= 50
                ? 'Đã hết dữ liệu'
                : 'Nạp thêm 10 item'
            }
            onPress={more}
          />
        }
      />
    </View>
  );
}

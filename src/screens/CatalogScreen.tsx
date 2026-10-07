import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Chip, Field, Label } from '../components/Kit';
import {
  categories,
  filterLessons,
  kindLabels,
  lessons,
} from '../data/catalog';
import type { Lesson } from '../data/catalog';
import { s, useTheme } from '../theme';

type Props = {
  savedOnly: boolean;
  favorites: string[];
  learned: string[];
  category: string;
  onCategory: (id: string) => void;
  onOpen: (lesson: Lesson) => void;
  onFavorite: (id: string) => void;
};
export function CatalogScreen({
  savedOnly,
  favorites,
  learned,
  category,
  onCategory,
  onOpen,
  onFavorite,
}: Props) {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 2 : 1;
  const [query, setQuery] = useState('');
  const items = useMemo(
    () => filterLessons(query, category, savedOnly ? favorites : undefined),
    [query, category, savedOnly, favorites],
  );
  const progress = Math.round((100 * learned.length) / lessons.length);
  return (
    <FlatList
      key={columns}
      testID="catalog-list"
      style={s.fill}
      numColumns={columns}
      data={items}
      keyExtractor={item => item.id}
      extraData={{ favorites, learned }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        padding: 20,
        paddingTop: 10,
        gap: 10,
        paddingBottom: 28,
      }}
      columnWrapperStyle={columns > 1 ? { gap: 12 } : undefined}
      ListHeaderComponent={
        <View style={{ gap: 18, paddingBottom: 8 }}>
          <View
            style={{
              backgroundColor: t.soft,
              borderRadius: 26,
              padding: 24,
              gap: 14,
              overflow: 'hidden',
            }}
          >
            <Text
              style={{
                color: t.primary,
                fontSize: 10,
                fontWeight: '800',
                letterSpacing: 2.4,
              }}
            >
              REACT NATIVE 0.87 · FIELD GUIDE
            </Text>
            <Text
              style={{
                color: t.text,
                fontSize: 34,
                lineHeight: 41,
                fontWeight: '800',
                letterSpacing: -1.5,
              }}
            >
              {savedOnly ? 'Sổ tay của bạn.' : 'Chạm thử.\nHiểu component.'}
            </Text>
            <Text style={[s.body, { color: t.muted }]}>
              {savedOnly
                ? 'Những ví dụ bạn muốn quay lại. Chạm dấu sao để lưu hoặc bỏ lưu.'
                : `${lessons.length} ví dụ thực hành. Từ khối View đầu tiên đến tương tác native.`}
            </Text>
            <View style={[s.between, { paddingTop: 4 }]}>
              <Text
                style={{ color: t.primary, fontSize: 12, fontWeight: '700' }}
              >
                {learned.length}/{lessons.length} bài đã học
              </Text>
              <Text style={{ color: t.primary, fontWeight: '800' }}>
                {progress}%
              </Text>
            </View>
            <View
              style={{
                height: 5,
                backgroundColor: t.border,
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: t.primary,
                }}
              />
            </View>
          </View>
          <View style={s.row}>
            <Field
              testID="catalog-search"
              accessibilityLabel="Tìm component"
              placeholder="Tìm component, props, chủ đề…"
              value={query}
              onChangeText={setQuery}
              style={s.fill}
              returnKeyType="search"
            />
            {query ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Xóa tìm kiếm"
                onPress={() => setQuery('')}
                style={{ padding: 12 }}
              >
                <Text style={{ color: t.primary, fontSize: 20 }}>×</Text>
              </Pressable>
            ) : null}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 8 }}
          >
            <Chip
              title="Tất cả"
              selected={category === 'all'}
              onPress={() => onCategory('all')}
            />
            {categories.map(item => (
              <Chip
                key={item.id}
                title={`${item.icon} ${item.title}`}
                selected={category === item.id}
                onPress={() => onCategory(item.id)}
              />
            ))}
          </ScrollView>
          <View style={s.between}>
            <Text style={[s.heading, { color: t.text }]}>
              {savedOnly
                ? 'Mục đã lưu'
                : category === 'all'
                ? 'Thư viện component'
                : categories.find(item => item.id === category)?.subtitle}
            </Text>
            <Text style={{ fontSize: 12, color: t.muted }}>
              {items.length} mục
            </Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View
          style={[
            s.card,
            {
              backgroundColor: t.surface,
              borderColor: t.border,
              paddingVertical: 36,
              alignItems: 'center',
            },
          ]}
        >
          <Text style={{ fontSize: 36, color: t.primary }}>◇</Text>
          <Label>
            {savedOnly && !favorites.length
              ? 'Chưa có mục đã lưu'
              : 'Không tìm thấy component'}
          </Label>
          <Text style={[s.caption, { color: t.muted, textAlign: 'center' }]}>
            {savedOnly && !favorites.length
              ? 'Chạm dấu ☆ bên cạnh một component để thêm vào đây.'
              : 'Thử từ ngắn hơn hoặc đổi nhóm. Tìm kiếm hỗ trợ tiếng Việt không dấu.'}
          </Text>
        </View>
      }
      renderItem={({ item, index }) => {
        const group = categories.find(c => c.id === item.category);
        return (
          <View
            style={[
              s.card,
              {
                flex: 1,
                padding: 16,
                backgroundColor: t.surface,
                borderColor: t.border,
              },
            ]}
          >
            <View style={s.row}>
              <Pressable
                testID={`lesson-${item.id}`}
                accessibilityRole="button"
                accessibilityLabel={`Mở ${item.title}`}
                onPress={() => onOpen(item)}
                style={[s.row, s.fill]}
              >
                <View
                  style={[
                    s.center,
                    {
                      width: 48,
                      height: 48,
                      backgroundColor: t.soft,
                      borderRadius: 15,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: t.primary,
                      fontSize: 19,
                      fontWeight: '700',
                    }}
                  >
                    {group?.icon}
                  </Text>
                </View>
                <View style={[s.fill, { gap: 4 }]}>
                  <Text
                    style={{ color: t.text, fontSize: 16, fontWeight: '700' }}
                  >
                    {item.title}
                  </Text>
                  <Text style={{ color: t.muted, fontSize: 11 }}>
                    {kindLabels[item.kind]} · {item.platform}
                    {learned.includes(item.id) ? ' · ✓ Đã học' : ''}
                  </Text>
                </View>
              </Pressable>
              <Pressable
                testID={`favorite-${item.id}`}
                accessibilityRole="button"
                accessibilityLabel={
                  favorites.includes(item.id)
                    ? `Bỏ lưu ${item.title}`
                    : `Lưu ${item.title}`
                }
                accessibilityState={{ selected: favorites.includes(item.id) }}
                onPress={() => onFavorite(item.id)}
                style={[s.center, { width: 44, height: 44 }]}
              >
                <Text style={{ color: t.primary, fontSize: 25 }}>
                  {favorites.includes(item.id) ? '★' : '☆'}
                </Text>
              </Pressable>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Xem demo ${item.title}`}
              onPress={() => onOpen(item)}
              style={s.between}
            >
              <Text
                numberOfLines={2}
                style={[s.caption, s.fill, { color: t.muted }]}
              >
                {item.description}
              </Text>
              <Text style={{ color: t.primary, fontSize: 20 }}>↗</Text>
            </Pressable>
            <Text style={{ color: t.muted, fontSize: 10 }}>
              #{String(index + 1).padStart(2, '0')} / {group?.title}
            </Text>
          </View>
        );
      }}
    />
  );
}

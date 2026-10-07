import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { Action, Label } from './src/components/Kit';
import { ThemeContext, darkTheme, lightTheme, s } from './src/theme';
import { usePreferences } from './src/hooks/usePreferences';
import type { Lesson } from './src/data/catalog';
import { CatalogScreen } from './src/screens/CatalogScreen';
import { LessonScreen } from './src/screens/LessonScreen';
import { LearnScreen } from './src/screens/LearnScreen';

function CheatSheet() {
  const system = useColorScheme();
  const { preferences, ready, error, clearError, toggle, setTheme } =
    usePreferences();
  const isDark =
    preferences.theme === 'system'
      ? system === 'dark'
      : preferences.theme === 'dark';
  const t = isDark ? darkTheme : lightTheme;
  const [tab, setTab] = useState<'catalog' | 'learn' | 'saved'>('catalog');
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [category, setCategory] = useState('all');
  const [themeOpen, setThemeOpen] = useState(false);
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (selected) {
          setSelected(null);
          return true;
        }
        if (tab !== 'catalog') {
          setTab('catalog');
          return true;
        }
        return false;
      },
    );
    return () => subscription.remove();
  }, [selected, tab]);
  return (
    <ThemeContext.Provider value={t}>
      <SafeAreaView
        edges={['top', 'bottom', 'left', 'right']}
        style={[s.fill, { backgroundColor: t.background }]}
      >
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        {!ready ? (
          <View style={[s.fill, s.center]}>
            <ActivityIndicator size="large" color={t.primary} />
            <Text style={[s.body, { color: t.muted, marginTop: 16 }]}>
              Đang mở sổ tay component…
            </Text>
          </View>
        ) : (
          <>
            {selected ? (
              <LessonScreen
                key={selected.id}
                lesson={selected}
                favorite={preferences.favorites.includes(selected.id)}
                learned={preferences.learned.includes(selected.id)}
                onBack={() => setSelected(null)}
                onFavorite={() => toggle('favorites', selected.id)}
                onLearned={() => toggle('learned', selected.id)}
              />
            ) : (
              <>
                <View
                  style={[
                    s.between,
                    { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 8 },
                  ]}
                >
                  <View style={s.row}>
                    <View
                      style={[
                        s.center,
                        {
                          width: 35,
                          height: 35,
                          borderRadius: 11,
                          backgroundColor: t.primary,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: t.onPrimary,
                          fontSize: 16,
                          fontWeight: '800',
                        }}
                      >
                        RN
                      </Text>
                    </View>
                    <Text
                      style={{ color: t.text, fontWeight: '800', fontSize: 16 }}
                    >
                      UI Cheat Sheet
                    </Text>
                  </View>
                  <Pressable
                    testID="theme-button"
                    accessibilityRole="button"
                    accessibilityLabel="Chọn giao diện sáng tối"
                    onPress={() => setThemeOpen(true)}
                    style={[
                      s.center,
                      {
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        backgroundColor: t.surface,
                      },
                    ]}
                  >
                    <Text style={{ color: t.primary, fontSize: 22 }}>
                      {isDark ? '☾' : '☀'}
                    </Text>
                  </Pressable>
                </View>
                {tab === 'learn' ? (
                  <LearnScreen
                    learned={preferences.learned}
                    onOpen={setSelected}
                    onCategory={id => {
                      setCategory(id);
                      setTab('catalog');
                    }}
                  />
                ) : (
                  <CatalogScreen
                    savedOnly={tab === 'saved'}
                    favorites={preferences.favorites}
                    learned={preferences.learned}
                    category={category}
                    onCategory={setCategory}
                    onOpen={setSelected}
                    onFavorite={id => toggle('favorites', id)}
                  />
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 12,
                    paddingTop: 8,
                    paddingBottom: 4,
                    borderTopWidth: 1,
                    borderColor: t.border,
                    backgroundColor: t.surface,
                  }}
                >
                  {(
                    [
                      { id: 'catalog', title: 'Tra cứu', icon: '▦' },
                      { id: 'learn', title: 'Lộ trình', icon: '↗' },
                      { id: 'saved', title: 'Đã lưu', icon: '♡' },
                    ] as const
                  ).map(item => (
                    <Pressable
                      key={item.id}
                      testID={`tab-${item.id}`}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: tab === item.id }}
                      onPress={() => {
                        setTab(item.id);
                        setCategory('all');
                      }}
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        gap: 4,
                        paddingVertical: 7,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 23,
                          color: tab === item.id ? t.primary : t.muted,
                        }}
                      >
                        {item.icon}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '700',
                          color: tab === item.id ? t.primary : t.muted,
                        }}
                      >
                        {item.title}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}
            {error ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Đóng thông báo lưu dữ liệu"
                onPress={clearError}
                style={{ padding: 14, backgroundColor: t.soft }}
              >
                <Text
                  accessibilityLiveRegion="polite"
                  style={{ color: t.danger }}
                >
                  {error} · Đóng
                </Text>
              </Pressable>
            ) : null}
          </>
        )}
        <Modal
          visible={themeOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setThemeOpen(false)}
        >
          <View style={s.overlay}>
            <ScrollView
              style={{ maxHeight: '70%', flexGrow: 0 }}
              contentContainerStyle={[
                s.card,
                { backgroundColor: t.surface, borderColor: t.border },
              ]}
            >
              <Label>Giao diện của bạn</Label>
              {(
                [
                  { id: 'system', title: 'Theo hệ thống' },
                  { id: 'light', title: 'Sáng' },
                  { id: 'dark', title: 'Tối' },
                ] as const
              ).map(item => (
                <Action
                  key={item.id}
                  title={`${preferences.theme === item.id ? '✓ ' : ''}${
                    item.title
                  }`}
                  secondary={preferences.theme !== item.id}
                  onPress={() => {
                    setTheme(item.id);
                    setThemeOpen(false);
                  }}
                />
              ))}
              <Action
                secondary
                title="Đóng"
                onPress={() => setThemeOpen(false)}
              />
            </ScrollView>
          </View>
        </Modal>
      </SafeAreaView>
    </ThemeContext.Provider>
  );
}
export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <CheatSheet />
    </SafeAreaProvider>
  );
}

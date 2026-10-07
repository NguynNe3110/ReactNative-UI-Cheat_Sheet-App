import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lessons } from '../data/catalog';

export type Preferences = {
  favorites: string[];
  learned: string[];
  theme: 'system' | 'light' | 'dark';
};
export const PREFERENCES_KEY = '@rn-cheat-sheet/preferences-v1';
const initial: Preferences = { favorites: [], learned: [], theme: 'system' };
const validIds = new Set(lessons.map(item => item.id));
export function parsePreferences(raw: string | null): Preferences {
  if (!raw) {
    return { ...initial };
  }
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid preferences');
  }
  const value = parsed as Record<string, unknown>;
  const ids = (candidate: unknown) =>
    Array.isArray(candidate)
      ? [
          ...new Set(
            candidate.filter(
              (id): id is string => typeof id === 'string' && validIds.has(id),
            ),
          ),
        ]
      : [];
  return {
    favorites: ids(value.favorites),
    learned: ids(value.learned),
    theme:
      value.theme === 'light' || value.theme === 'dark'
        ? value.theme
        : 'system',
  };
}
export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(initial);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const alive = useRef(true);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    alive.current = true;
    AsyncStorage.getItem(PREFERENCES_KEY)
      .then(raw => {
        if (!alive.current) {
          return;
        }
        try {
          setPreferences(parsePreferences(raw));
        } catch {
          setError(
            'Dữ liệu học cũ không đọc được. Đã dùng thiết lập mặc định.',
          );
        }
      })
      .catch(() => {
        if (alive.current) {
          setError('Không đọc được dữ liệu local. Bạn vẫn có thể học.');
        }
      })
      .finally(() => {
        if (alive.current) {
          setReady(true);
        }
      });
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    if (!ready) {
      return;
    }
    const serialized = JSON.stringify(preferences);
    queue.current = queue.current
      .then(() => AsyncStorage.setItem(PREFERENCES_KEY, serialized))
      .catch(() => {
        if (alive.current) {
          setError(
            'Không lưu được tiến độ. Hãy thử lại khi thiết bị còn dung lượng.',
          );
        }
      });
  }, [preferences, ready]);
  const toggle = useCallback((key: 'favorites' | 'learned', id: string) => {
    if (!validIds.has(id)) {
      return;
    }
    setPreferences(prev => ({
      ...prev,
      [key]: prev[key].includes(id)
        ? prev[key].filter(x => x !== id)
        : [...prev[key], id],
    }));
  }, []);
  const setTheme = useCallback(
    (theme: Preferences['theme']) =>
      setPreferences(prev => ({ ...prev, theme })),
    [],
  );
  return {
    preferences,
    ready,
    error,
    clearError: () => setError(''),
    toggle,
    setTheme,
  };
}

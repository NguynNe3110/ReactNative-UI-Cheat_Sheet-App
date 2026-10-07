import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import type { ReactTestRenderer as Renderer } from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { categories, filterLessons, lessons } from '../src/data/catalog';
import { demos } from '../src/demos';
import sources from '../src/data/demoSources.json';
import { parsePreferences } from '../src/hooks/usePreferences';

test('catalog entries point to working demos and actual code sources', () => {
  expect(new Set(lessons.map(item => item.id)).size).toBe(lessons.length);
  for (const item of lessons) {
    expect(categories.some(category => category.id === item.category)).toBe(
      true,
    );
    expect(demos[item.demo]).toBeDefined();
    expect(
      (sources as Record<string, { code: string }>)[item.demo].code,
    ).toContain(`function ${item.demo}`);
    expect(item.docs).toMatch(/^https:\/\//);
  }
});
test('combines category, saved-only and normalized word searches', () => {
  expect(
    filterLessons('danh sach', 'list').some(item => item.id === 'flatlist'),
  ).toBe(true);
  expect(filterLessons('', 'all', ['view']).map(item => item.id)).toEqual([
    'view',
  ]);
  expect(filterLessons('', 'input', ['view'])).toEqual([]);
});
test('rejects corrupt storage and removes stale or duplicate lesson IDs', () => {
  expect(() => parsePreferences('{broken')).toThrow();
  expect(
    parsePreferences(
      '{"favorites":["view","view","obsolete",2],"learned":["text"],"theme":"invalid"}',
    ),
  ).toEqual({ favorites: ['view'], learned: ['text'], theme: 'system' });
});
test.each(lessons.map(item => [item.title, item.demo]))(
  'renders and cleans up %s',
  async (_, demoName) => {
    const Demo = demos[demoName];
    let renderer!: Renderer;
    await act(async () => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider>
          <Demo />
        </SafeAreaProvider>,
      );
    });
    expect(renderer.toJSON()).not.toBeNull();
    await act(async () => renderer.unmount());
  },
);

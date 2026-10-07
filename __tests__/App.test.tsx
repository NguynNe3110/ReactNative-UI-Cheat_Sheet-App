/**
 * @format
 */

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import type { ReactTestRenderer as Renderer } from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../App';
import { PREFERENCES_KEY } from '../src/hooks/usePreferences';

let renderer: Renderer;
function renderedText() {
  return renderer.root
    .findAll(node => node.children.some(child => typeof child === 'string'))
    .flatMap(node => node.children.filter(child => typeof child === 'string'))
    .join(' ');
}
afterEach(async () => {
  if (renderer) {
    await act(async () => renderer.unmount());
  }
});

async function press(tree: Renderer, testID: string) {
  const control = tree.root
    .findAllByProps({ testID })
    .find(node => typeof node.props.onPress === 'function');
  expect(control).toBeDefined();
  await act(async () => control!.props.onPress());
}
beforeEach(async () => {
  await AsyncStorage.clear();
});
test('opens a lesson, switches between live demo/source/notes and saves learning progress', async () => {
  await act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  await press(renderer, 'lesson-view');
  await press(renderer, 'lesson-tab-code');
  expect(renderedText()).toContain('ViewDemo');
  await press(renderer, 'lesson-tab-notes');
  expect(renderedText()).toContain('Props / API cần nhớ');
  await press(renderer, 'lesson-favorite');
  await press(renderer, 'lesson-learned');
  await press(renderer, 'lesson-back');
  await press(renderer, 'tab-saved');
  expect(
    renderer.root.findAllByProps({ testID: 'lesson-view' }).length,
  ).toBeGreaterThan(0);
  const saved = JSON.parse((await AsyncStorage.getItem(PREFERENCES_KEY))!);
  expect(saved.favorites).toEqual(['view']);
  expect(saved.learned).toEqual(['view']);
  await act(async () => renderer.unmount());
  await act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  await press(renderer, 'lesson-view');
  const learnedButton = renderer.root.findAllByProps({
    testID: 'lesson-learned',
  })[0];
  expect(learnedButton.props.title).toContain('Đã học');
  await act(async () => renderer.unmount());
});
test('searches Vietnamese without accents and shows empty results', async () => {
  await act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  const search = () =>
    renderer.root
      .findAllByProps({ testID: 'catalog-search' })
      .find(node => typeof node.props.onChangeText === 'function')!;
  await act(async () => search().props.onChangeText('ban phim'));
  expect(renderedText()).toContain('Keyboard');
  await act(async () => search().props.onChangeText('xyz-no-component'));
  expect(renderedText()).toContain('Không tìm thấy component');
  await act(async () => renderer.unmount());
});

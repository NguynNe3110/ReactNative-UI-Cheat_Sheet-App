import type { ComponentType } from 'react';
import * as Layout from './LayoutDemos';
import * as Content from './ContentDemos';
import * as Input from './InputDemos';
import * as Touch from './TouchDemos';
import * as List from './ListDemos';
import * as Feedback from './FeedbackDemos';
import * as Navigation from './NavigationDemos';
import * as Motion from './MotionDemos';
import * as Device from './DeviceDemos';

export const demos: Record<string, ComponentType> = {
  ...Layout,
  ...Content,
  ...Input,
  ...Touch,
  ...List,
  ...Feedback,
  ...Navigation,
  ...Motion,
  ...Device,
};
// Các list có vùng cuộn riêng để tránh lồng VirtualizedList trong ScrollView dọc.
export const fullScreenDemos = new Set([
  'ScrollDemo',
  'FlatListDemo',
  'SectionListDemo',
  'VirtualizedDemo',
  'GridDemo',
  'RefreshDemo',
  'PaginationDemo',
  'FABDemo',
  'KeyboardAvoidingDemo',
]);

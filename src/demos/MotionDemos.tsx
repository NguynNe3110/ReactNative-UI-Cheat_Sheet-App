import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutAnimation,
  PanResponder,
  Text,
  View,
} from 'react-native';
import { Action, Chip, Label, Note } from '../components/Kit';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { s, useTheme } from '../theme';

export function AnimatedDemo() {
  const t = useTheme();
  const value = useRef(new Animated.Value(0)).current;
  const target = useRef(false);
  const [mode, setMode] = useState('timing');
  const reduced = useReduceMotion();
  useEffect(() => () => value.stopAnimation(), [value]);
  const play = () => {
    target.current = !target.current;
    const toValue = target.current ? 1 : 0;
    if (reduced) {
      value.setValue(toValue);
      return;
    }
    value.stopAnimation();
    if (mode === 'spring') {
      Animated.spring(value, {
        toValue,
        friction: 5,
        tension: 70,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(value, {
        toValue,
        duration: 700,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <View style={s.demo}>
      <View style={[s.center, { height: 200 }]}>
        <Animated.View
          style={[
            s.tile,
            {
              backgroundColor: t.primary,
              width: 90,
              height: 90,
              opacity: value.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
              transform: [
                {
                  translateX: value.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-60, 60],
                  }),
                },
                {
                  scale: value.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={{ color: t.onPrimary, fontWeight: '800' }}>RN</Text>
        </Animated.View>
      </View>
      <View style={s.row}>
        {['timing', 'spring'].map(x => (
          <Chip
            key={x}
            title={x}
            selected={mode === x}
            onPress={() => setMode(x)}
          />
        ))}
      </View>
      <Action title="Phát animation" onPress={play} />
      <Label muted>Reduce Motion: {String(reduced)}</Label>
    </View>
  );
}
export function InterpolationDemo() {
  const t = useTheme();
  const value = useRef(new Animated.Value(0)).current;
  const target = useRef(false);
  const reduced = useReduceMotion();
  useEffect(() => () => value.stopAnimation(), [value]);
  return (
    <View style={s.demo}>
      <View style={[s.center, { height: 220 }]}>
        <Animated.View
          style={{
            height: 110,
            width: 110,
            backgroundColor: t.primary,
            borderRadius: value.interpolate({
              inputRange: [0, 1],
              outputRange: [12, 55],
              extrapolate: 'clamp',
            }),
            transform: [
              {
                rotate: value.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }}
        />
      </View>
      <Action
        title="Interpolate 0 ↔ 1"
        onPress={() => {
          target.current = !target.current;
          value.stopAnimation();
          Animated.timing(value, {
            toValue: target.current ? 1 : 0,
            duration: reduced ? 0 : 900,
            useNativeDriver: false,
          }).start();
        }}
      />
      <Note>
        borderRadius dùng JS driver. Một Animated.Value điều khiển cả góc xoay
        và bo tròn.
      </Note>
    </View>
  );
}
export function LayoutAnimationDemo() {
  const t = useTheme();
  const [count, setCount] = useState(3);
  const reduced = useReduceMotion();
  const update = (next: number) => {
    if (!reduced) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setCount(next);
  };
  return (
    <View style={s.demo}>
      <View style={s.wrap}>
        {Array.from({ length: count }, (_, i) => (
          <View
            key={i}
            style={[s.tile, { backgroundColor: t.soft, width: 80 }]}
          >
            <Label>{i + 1}</Label>
          </View>
        ))}
      </View>
      <View style={s.wrap}>
        <Action
          title="Thêm"
          disabled={count >= 9}
          onPress={() => update(count + 1)}
        />
        <Action
          secondary
          title="Bớt"
          disabled={count <= 1}
          onPress={() => update(count - 1)}
        />
      </View>
      <Note>
        configureNext chạy trước thay đổi layout. Demo giới hạn 1–9 khối.
      </Note>
    </View>
  );
}
export function PanResponderDemo() {
  const t = useTheme();
  const pan = useRef(new Animated.ValueXY()).current;
  const reduced = useReduceMotion();
  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) =>
          pan.setValue({
            x: Math.max(-75, Math.min(75, gesture.dx)),
            y: Math.max(-75, Math.min(75, gesture.dy)),
          }),
        onPanResponderRelease: () => {
          if (reduced) {
            pan.setValue({ x: 0, y: 0 });
          } else {
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }).start();
          }
        },
        onPanResponderTerminate: () => pan.setValue({ x: 0, y: 0 }),
      }),
    [pan, reduced],
  );
  useEffect(() => () => pan.stopAnimation(), [pan]);
  return (
    <View style={s.demo}>
      <View
        style={[
          s.center,
          {
            height: 280,
            backgroundColor: t.soft,
            borderRadius: 24,
            overflow: 'hidden',
          },
        ]}
      >
        <Animated.View
          {...responder.panHandlers}
          accessibilityLabel="Khối có thể kéo"
          style={[
            s.center,
            {
              width: 90,
              height: 90,
              borderRadius: 24,
              backgroundColor: t.primary,
              transform: pan.getTranslateTransform(),
            },
          ]}
        >
          <Text style={{ color: t.onPrimary, fontWeight: '800' }}>Kéo tôi</Text>
        </Animated.View>
      </View>
      <Action
        secondary
        title="Trả về tâm"
        onPress={() => pan.setValue({ x: 0, y: 0 })}
      />
      <Note>dx/dy được giới hạn ±75 dp. Thả tay để về tâm.</Note>
    </View>
  );
}

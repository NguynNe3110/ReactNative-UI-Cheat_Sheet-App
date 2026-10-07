import { createContext, useContext } from 'react';
import { StyleSheet } from 'react-native';

export const lightTheme = {
  background: '#F5F6FA',
  surface: '#FFFFFF',
  soft: '#EEEFFC',
  text: '#202338',
  muted: '#74788D',
  border: '#E3E5EF',
  primary: '#6955E8',
  onPrimary: '#FFFFFF',
  success: '#16836B',
  danger: '#D94F69',
  warning: '#A86B15',
  code: '#15192B',
};
export type Theme = typeof lightTheme;
export const darkTheme: Theme = {
  background: '#101321',
  surface: '#1B2033',
  soft: '#292540',
  text: '#F1F2FA',
  muted: '#A3A9C2',
  border: '#30374E',
  primary: '#AB9BFF',
  onPrimary: '#201844',
  success: '#68D6B8',
  danger: '#FF94A6',
  warning: '#EFC07A',
  code: '#0B0E19',
};
export const ThemeContext = createContext(lightTheme);
export const useTheme = () => useContext(ThemeContext);
export const s = StyleSheet.create({
  fill: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stack: { gap: 16 },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  pad: { padding: 20 },
  demo: { padding: 20, gap: 18 },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.7 },
  heading: { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 15, lineHeight: 23 },
  caption: { fontSize: 12, lineHeight: 18 },
  card: { borderRadius: 20, padding: 18, borderWidth: 1, gap: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
  },
  button: {
    borderRadius: 13,
    paddingHorizontal: 18,
    paddingVertical: 13,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 40,
  },
  tile: {
    height: 64,
    minWidth: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: { height: StyleSheet.hairlineWidth },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7,10,22,0.6)',
    padding: 24,
    justifyContent: 'center',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 21,
    color: '#D8DDF3',
  },
});

module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // Style đặt cạnh demo giúp người học thấy ngay tác động của từng prop.
    'react-native/no-inline-styles': 'off',
  },
  overrides: [{ files: ['jest.setup.js'], env: { jest: true } }],
};

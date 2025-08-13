module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-worklets/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/hooks': './src/hooks',
          '@/utils': './src/utils',
          '@/services': './src/services',
          '@/contexts': './src/contexts',
          '@/types': './src/types',
          '@/navigation': './src/navigation',
        },
      },
    ],
  ]
};

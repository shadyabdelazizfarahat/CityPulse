const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
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
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

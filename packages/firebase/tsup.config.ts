import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: './src/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'firebase',
    'firebase/app',
    'firebase/auth',
    'firebase/firestore',
    '@react-native-async-storage/async-storage',
  ],
});

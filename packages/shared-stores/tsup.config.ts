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
    'firebase/auth',
    'firebase/firestore',
    '@fiap-farms/firebase',
    'zustand',
    'zustand/middleware',
    'react',
    '@react-native-async-storage/async-storage',
  ],
});

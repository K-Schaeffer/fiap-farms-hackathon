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
    '@fiap-farms/firebase',
    'zustand',
    'zustand/middleware',
    'react',
  ],
});

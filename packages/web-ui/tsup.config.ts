import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/components/index.ts',
    global: 'src/styles/global.css',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    /^@mui\/.*/,
    /^@emotion\/.*/,
  ],
});

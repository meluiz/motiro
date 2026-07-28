import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: true,
  shims: true,
  clean: true,
  unbundle: true,
  treeshake: true,
  format: ['esm'],
  attw: 'ci-only',
  publint: 'ci-only',
  entry: ['src/index.ts'],
});

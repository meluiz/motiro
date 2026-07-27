import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: true,
  shims: true,
  clean: true,
  unbundle: true,
  treeshake: true,
  format: ['esm', 'cjs'],
  entry: ['src/index.ts'],
  publint: 'ci-only',
});

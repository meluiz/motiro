import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: true,
  shims: true,
  clean: true,
  exports: true,
  unbundle: true,
  treeshake: true,
  format: ['esm'],
  entry: ['src/index.ts'],
});

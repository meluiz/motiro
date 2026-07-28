import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  unbundle: true,
  attw: 'ci-only',
  publint: 'ci-only',
  entry: ['src/index.ts'],
  dts: {
    emitDtsOnly: true,
  },
});

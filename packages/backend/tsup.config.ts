import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  outDir: 'dist',
  target: 'node18',
  format: ['cjs'],
  dts: false,
  clean: true,
  splitting: false,
  sourcemap: true,
})
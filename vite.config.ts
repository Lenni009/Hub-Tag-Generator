/// <reference types="vitest" />
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/Eisvana-System-Naming-Tools/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // options for vitest
    globals: true,  // needs to be set for
    environment: 'happy-dom',
    coverage: {
      include: ['src/**.{ts,vue}', 'src/**/**.{ts,vue}'],
      exclude: ['src/api/**/**.ts', 'src/**/**.d.ts'],
      clean: true,
      all: true,
    },
  },
});

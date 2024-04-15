import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    setupFiles: ['./test/vitest-setup.ts'],
    globals: true,
    //setupFiles: './test/setup.ts',
    environmentMatchGlobs: [
      // run front end tests in jsdom
      ['test/app/**', 'jsdom'],
      ['test/lib/**', 'node'],
    ],
    coverage: {
      provider: 'v8',
      reporter: 'json',
    },
  },
});

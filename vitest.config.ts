import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    // this was previously set to jsdom which causes problems with the Firebase emulator: check https://stackoverflow.com/questions/63319638/firestore-internal-assertion-failed-unexpected-state-when-unit-testing-with-j
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

import { defineWorkspace } from 'vitest/config';

import path from 'node:path';
import tsconfig from './tsconfig.json';

const alias = Object.fromEntries(
  // credit: https://christophervachon.com/blog/2024-04-15-vitest-typescript-paths/
  Object.entries(tsconfig.compilerOptions.paths).map(([key, [value]]) => [
    key.replace('/*', ''),
    path.resolve(__dirname, value.replace('/*', '')),
  ]),
);

export default defineWorkspace([
  {
    test: {
      name: 'browser',
      browser: {
        enabled: true,
        provider: 'playwright',
        instances: [{ browser: 'chromium' }],
      },
      include: ['src/**/*.test.{ts,tsx}'],
    },
    resolve: {
      alias,
    },
  },
  {
    test: {
      name: 'unit',
      environment: 'jsdom',
      include: ['src/**/*.unit.{ts,tsx}'],
    },
    resolve: {
      alias,
    },
  },
]);

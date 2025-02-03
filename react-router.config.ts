import path from 'node:path';
import type { Config } from '@react-router/dev/config';
import fs from 'fs-extra';

export default {
  appDirectory: 'src/app',
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
  async prerender() {
    return ['/', '/books'];
  },
  buildEnd: async () => {
    await fs.rm('docs', { recursive: true });
    // AAAAAAA !!!
    await fs.move(
      path.resolve('build/client/search-params-demo'),
      path.resolve('docs'),
    );
    await fs.move(
      path.resolve('build/client/assets'),
      path.resolve('docs/assets'),
    );
    await fs.rm('build', { recursive: true });
  },
  basename: '/search-params-demo/',
} satisfies Config;

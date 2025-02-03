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
    await fs.rmdir('docs', { recursive: true });
    await fs.move(path.resolve('build/client'), path.resolve('docs'));
    await fs.rmdir('build', { recursive: true });
  },
} satisfies Config;

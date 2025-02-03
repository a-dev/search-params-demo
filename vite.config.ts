import { reactRouter } from '@react-router/dev/vite';
// import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'docs',
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});

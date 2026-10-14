import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Al-Ghazi/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

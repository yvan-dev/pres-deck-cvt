import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Tracker SSE server
      '/tasks':  'http://localhost:3001',
      '/events': 'http://localhost:3001',
      // Pipeline API (gates) — proxy vers le serveur Express qui relaie au pipeline si disponible
      '/pipeline': 'http://localhost:3001',
      '/gates':    'http://localhost:3001',
      '/health':   'http://localhost:3001',
    },
  },
  build: { outDir: 'dist', sourcemap: false },
});

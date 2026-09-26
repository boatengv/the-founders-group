import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Static build: the forms show a "not taking submissions yet" message and the Admin link is hidden.
export default defineConfig({
  plugins: [react()],
  base: '/',
  define: { 'import.meta.env.VITE_STATIC': 'true' },
  resolve: { alias: { '@appdeploy/client': path.resolve('stub/static-client.js') } },
});

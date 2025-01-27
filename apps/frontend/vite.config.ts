import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true, // this is the fix
    alias: {
      '@calcu-bot/shared': path.resolve(__dirname, '../shared/src/index.ts'), // Adjusted path to the built shared package
    },
  },
  server: {
    proxy: {
    '/socket.io': {
      target: "http://localhost:8000",
      changeOrigin: true,
      ws: true
    }}}
})

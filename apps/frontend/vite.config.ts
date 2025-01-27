import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@calcu-bot/shared': path.resolve(__dirname, '../shared/src/index.ts'), // Adjusted path to the built shared package
    },
  },
  server: {
    proxy: {
    '/socket.io': {
      target: process.env.VITE_IO_URL,
      changeOrigin: true,
      ws: true
    }}}
})

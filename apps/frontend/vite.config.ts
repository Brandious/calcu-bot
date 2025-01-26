import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    preserveSymlinks: true // this is the fix!
  },
  server: {
    proxy: {
    '/socket.io': {
      target: "http://localhost:8000",
      changeOrigin: true,
      ws: true
    }}}
})

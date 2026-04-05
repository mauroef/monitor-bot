import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // escucha en 0.0.0.0 → accesible por LAN y Tailscale
    proxy: {
      '/api/grid': {
        target: process.env.VITE_GRID_BOT_API_URL ?? 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/grid/, ''),
      },
      '/api/trading': {
        target: process.env.VITE_TRADING_BOT_API_URL ?? 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trading/, ''),
      },
    },
  },
})

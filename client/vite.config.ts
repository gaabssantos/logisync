import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // em desenvolvimento, as chamadas a /api vão para a API local
    proxy: { '/api': 'http://localhost:3001' },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get base path from environment or use default
const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
    watch: {
      usePolling: true,
      interval: 10000, // Poll every 10 seconds for WSL2
    },
  },
})

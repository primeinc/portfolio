import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
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

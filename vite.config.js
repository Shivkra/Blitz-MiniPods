import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createApp } from './server/app.js'

// https://vite.dev/config/ - Force reload config after visualizer cleanup and color mapping
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'darkstore-api',
      configureServer(server) {
        const app = createApp()
        server.middlewares.use(app)
      },
    },
  ],
  preview: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})

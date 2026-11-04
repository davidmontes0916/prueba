import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src')
    }
  },
  server: {
    allowedHosts: true,
    proxy: {
      '/api': 'http://localhost:3000',
      '/public': 'http://localhost:3000'
    }
  }
})
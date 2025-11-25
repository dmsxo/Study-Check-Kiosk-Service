import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      tailwindcss(), 
      react(),
    ],
    server: {
      host:true,
      port: 4000, // 프론트 포트
      proxy: {
        '/api': {
        target: "http://172.17.80.1:3000", // NestJS 서버
        changeOrigin: true,
        secure: false,
      },
    },
  },
  }
})

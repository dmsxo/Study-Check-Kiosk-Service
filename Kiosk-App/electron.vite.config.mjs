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
      port: 4000, // 원하는 포트로 바꾸기
      strictPort: true, // 포트 이미 사용 중이면 바로 에러
      host: true, // 0.0.0.0 허용
      // 여기에 ngrok 주소 허용
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        'http://192.168.1.130',
        'palaeozoological-mickie-snoopily.ngrok-free.dev'
      ]
    },
  }
})

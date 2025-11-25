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
    build: {
      emptyOutDir: true,
      // base 경로가 잘못 설정되어 있으면 안 됩니다.
      base: './', // 상대 경로로 설정되어 있는지 확인 (기본적으로는 './'가 맞습니다)
      outDir: 'out/renderer', // 출력이 올바른 위치로 가는지 확인
    },
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

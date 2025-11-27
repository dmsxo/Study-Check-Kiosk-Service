import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // 서비스 워커 자동 업데이트
      // devOptions: {
      //   enabled: true, // 개발환경에서 pwa 기능활성화
      // },
      manifest: {
        name: 'Scandy! : 자율학습 출석체크', // 전체 이름, 앱 상세 정보 노출
        short_name: 'Sacndy!', // 홈 화면이나 앱 아이콘 아래에 표시
        description: '편리하게 출석 체크하고 출석 통계까지 보자.', // 앱을 소개
        start_url: '/',
        display: 'standalone', // 네이티브앱처럼 화면 전체를 채움
        background_color: '#ffffff',
        theme_color: '#ffffff',
        lang: 'ko',
        icons: [
          {
            "src": "icons/apple-touch-icon-48x48.png",
            "sizes": "48x48",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "icons/apple-touch-icon-72x72.png",
            "sizes": "72x72",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "icons/apple-touch-icon-96x96.png",
            "sizes": "96x96",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "icons/apple-touch-icon-128x128.png",
            "sizes": "128x128",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "icons/apple-touch-icon-144x144.png",
            "sizes": "144x144",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "icons/apple-touch-icon-152x152.png",
            "sizes": "152x152",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "icons/apple-touch-icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "icons/apple-touch-icon-384x384.png",
            "sizes": "384x384",
            "type": "image/png"
          },
          {
            "src": "icons/apple-touch-icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ],
      },
    })
  ],

  server: {
    host:true,
    port: 5173, // 프론트 포트
    allowedHosts: ["daein.mcv.kr"]
  },
})

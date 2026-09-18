import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages 會把網站放在 /<repo>/ 底下；本機開發則用根路徑。
const base = process.env.GITHUB_PAGES_BASE ?? '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg'],
      manifest: {
        name: 'Super Training 健身課表',
        short_name: 'Super Training',
        description: '依 1RM 與器材自動安排重訓 / 有氧課表，支援超級組與動作替換。',
        lang: 'zh-TW',
        theme_color: '#0f1115',
        background_color: '#0f1115',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
  test: {
    environment: 'node',
  },
} as Parameters<typeof defineConfig>[0]);

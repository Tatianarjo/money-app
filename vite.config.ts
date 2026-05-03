import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

/** GitHub Pages project URL: https://<user>.github.io/<repo>/ — must match the repo name segment. */
const basePath = '/money-app'
const base = `${basePath}/`

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'favicon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
      },
      manifest: {
        name: 'Money HQ — Your Budget Assistant',
        short_name: 'Money HQ',
        description: 'Your Budget Assistant — income, bills, debt, and soft life in one place.',
        theme_color: '#F59E0B',
        background_color: '#080808',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: base,
        start_url: base,
        icons: [
          {
            src: `${basePath}/icon.svg`,
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: `${basePath}/icon.svg`,
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

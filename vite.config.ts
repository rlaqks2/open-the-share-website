// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/open-the-share-website/',  // ✅ GitHub Pages 프로젝트 경로
  // build: { outDir: 'docs' }       // ❌ dist 쓸 거라면 이건 빼두는 게 깔끔
})

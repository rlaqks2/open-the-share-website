import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/open-the-share-website/',   // ✅ 그대로 유지
  // build: { outDir: 'docs' }        // ❌ 이 부분은 삭제 또는 주석 처리
})

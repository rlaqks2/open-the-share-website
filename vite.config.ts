// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/open-the-share-website/', // <repository-name>으로 변경
    build: {
        outDir: 'docs' // 빌드 결과물을 'dist' 대신 'docs' 폴더에 저장
    }
})
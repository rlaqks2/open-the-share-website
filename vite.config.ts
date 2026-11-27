// vite.config.ts
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { seoHtml } from './scripts/seo-html'

/**
 * 배포 대상 구분
 * - 운영(openthe.kr): VITE_BASE_PATH 미설정 → base '/'
 * - 테스트(rlaqks2.github.io/open-the-share-dev): deploy.yml 이 VITE_BASE_PATH=/open-the-share-dev/, VITE_DEPLOY_ENV=dev 를 넘긴다.
 */
const base = process.env.VITE_BASE_PATH || '/'
const isDevDeploy = process.env.VITE_DEPLOY_ENV === 'dev'

/** 테스트 사이트는 검색엔진 색인 금지 + 탭 제목에 [DEV] 표시 */
const devSiteHtml = (): Plugin => ({
    name: 'dev-site-html',
    transformIndexHtml(html) {
        if (!isDevDeploy) return html
        return html
            .replace('<head>', '<head>\n    <meta name="robots" content="noindex, nofollow" />')
            .replace('<title>', '<title>[DEV] ')
    },
})

export default defineConfig({
    plugins: [react(), devSiteHtml(), seoHtml()],
    base,
})

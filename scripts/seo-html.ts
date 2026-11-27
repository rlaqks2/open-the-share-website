/**
 * @file seo-html.ts
 * @description 빌드 때 index.html 에 검색엔진용 정보를 넣는 Vite 플러그인 (vite.config.ts 에서 사용).
 *
 * 1) 검색엔진 소유확인 메타태그 (src/config/seo.ts 에 값이 있을 때만)
 * 2) JSON-LD 구조화 데이터 (Organization·WebSite) — 회사명·연락처·SNS 를 검색엔진에 명시
 * 3) <div id="root"> 안의 정적 본문 — 이 사이트는 JS 로 화면을 그려서, JS 를 실행하지 않는 검색 로봇(네이버 등)은
 *    빈 페이지로 봅니다. 회사 소개·프로그램·연락처를 HTML 로 미리 넣고, React 가 뜨면 이 내용을 실제 화면으로 바꿉니다.
 *
 * 문구·회사 정보는 mockData 를 그대로 읽습니다 (하드코딩 금지, CLAUDE.md R7). mockData 를 고치면 다음 빌드에 반영됩니다.
 */
import type { Plugin } from 'vite';
import { mockData } from '../src/data/mockData';
import { siteVerification } from '../src/config/seo';

const SITE_URL = 'https://openthe.kr';

const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const verificationMeta = () =>
    [
        siteVerification.naver && `<meta name="naver-site-verification" content="${esc(siteVerification.naver)}" />`,
        siteVerification.google && `<meta name="google-site-verification" content="${esc(siteVerification.google)}" />`,
    ]
        .filter(Boolean)
        .map((t) => `    ${t}`)
        .join('\n');

const jsonLd = (description: string) => {
    const c = mockData.companyInfo;
    const data = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${SITE_URL}/#organization`,
                name: '오픈더쉐어',
                legalName: c.name,
                alternateName: ['Open The Share', c.englishName],
                url: `${SITE_URL}/`,
                logo: `${SITE_URL}/ci.png`,
                description,
                telephone: c.tel,
                email: c.email,
                address: { '@type': 'PostalAddress', streetAddress: c.address, addressCountry: 'KR' },
                sameAs: Object.values(c.socials),
            },
            {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                name: '오픈더쉐어',
                alternateName: 'Open The Share',
                url: `${SITE_URL}/`,
                inLanguage: 'ko-KR',
                publisher: { '@id': `${SITE_URL}/#organization` },
            },
        ],
    };
    // </script> 로 태그가 끊기지 않도록 < 를 이스케이프
    return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
};

/** React 가 뜨기 전(또는 JS 없는 검색 로봇)에 보이는 정적 본문. React 의 createRoot().render 가 통째로 교체한다. */
const staticBody = () => {
    const { hero, programs, companyInfo: c } = mockData;
    const p = 'style="margin:0 0 12px;line-height:1.7"';
    return `
    <main style="max-width:720px;margin:0 auto;padding:96px 24px;color:#334155;word-break:keep-all;font-family:Pretendard,sans-serif">
        <h1 style="font-size:28px;font-weight:900;color:#0f172a;margin:0 0 16px;white-space:pre-line">${esc(hero.title)}</h1>
        <p ${p}>${esc(hero.subtitle)}</p>
        <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:32px 0 12px">사회공헌 프로그램</h2>
        <ul style="padding-left:20px;margin:0">
${programs.map((g) => `            <li ${p}><strong>${esc(g.title)}</strong> — ${esc(g.subtitle)}. ${esc(g.description)}</li>`).join('\n')}
        </ul>
        <h2 style="font-size:20px;font-weight:800;color:#0f172a;margin:32px 0 12px">파트너십 문의</h2>
        <p ${p}>${esc(c.name)} · 대표전화 ${esc(c.tel)} · 이메일 ${esc(c.email)}<br />${esc(c.address)}</p>
        <p ${p}><a href="${esc(c.socials.blog)}">오픈더쉐어 블로그에서 봉사 현장 이야기 보기</a></p>
    </main>
`;
};

export const seoHtml = (): Plugin => ({
    name: 'seo-html',
    transformIndexHtml(html) {
        const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
        const head = [verificationMeta(), `    ${jsonLd(description)}`].filter(Boolean).join('\n');
        return html
            .replace('</head>', `${head}\n</head>`)
            .replace('<div id="root"></div>', `<div id="root">${staticBody()}</div>`);
    },
});

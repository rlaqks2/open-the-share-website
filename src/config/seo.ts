/**
 * @file seo.ts
 * @description 검색엔진 소유확인 코드. 빌드 때 scripts/seo-html.ts 가 index.html <head> 에 메타태그로 넣습니다.
 *
 * - 네이버 서치어드바이저: 사이트 등록 → 소유확인 → "HTML 태그" 방식 → content="..." 안의 값만 복사
 * - 구글 서치 콘솔: URL 접두어 속성 → 다른 확인 방법 → "HTML 태그" → content="..." 안의 값만 복사
 * 빈 문자열이면 태그를 넣지 않습니다. 소유확인 코드는 공개값이라 코드에 둬도 됩니다(비밀값 아님).
 * ⚠️ 이 파일은 vite.config.ts(Node)에서도 읽으므로 import.meta.env 를 쓰지 마세요.
 */
export const siteVerification = {
    naver: '4ae681232a6b67d3fcbf9afca2bb539985637fc6',
    google: 'y1JM41r4sz9Wmc1x_e04jRCWZQYseezNMOfMi6wTpho',
};

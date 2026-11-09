/**
 * @file site.ts
 * @description 사이트 전역 설정(외부 서비스 키, 연락처 등)을 한 곳에 모아둔 파일입니다.
 *
 * ⚠️ 이 사이트는 백엔드가 없는 정적 사이트입니다. 여기에 들어가는 값은 모두 브라우저에 그대로 노출됩니다.
 *    → "공개되어도 되는 값"(EmailJS Public Key, 서비스/템플릿 ID 등)만 넣으세요.
 *    → 비밀번호·Private Key·API Secret 은 절대 넣지 마세요. (docs/harness/NO_BACKEND_POLICY.md)
 *
 * 값은 .env(.local) 의 VITE_* 환경변수로 덮어쓸 수 있습니다. (.env.example 참고)
 */

const env = import.meta.env;

export const siteConfig = {
    /** 운영 도메인 (GitHub Pages + public/CNAME) */
    siteUrl: 'https://openthe.kr',

    /**
     * 파트너십 문의 폼 → EmailJS(https://www.emailjs.com) 로 메일 발송.
     * EmailJS 대시보드에서 "Allowed origins"에 openthe.kr 을 등록해 두면 타 도메인 악용을 막을 수 있습니다.
     */
    emailjs: {
        serviceId: env.VITE_EMAILJS_SERVICE_ID || 'service_49uwd6l',
        templateId: env.VITE_EMAILJS_TEMPLATE_ID || 'template_pm65did',
        publicKey: env.VITE_EMAILJS_PUBLIC_KEY || 'vShddPvGInIVoVMuQ',
        /** 문의 메일 수신 주소 (EmailJS 템플릿의 {{to_email}}) */
        toEmail: 'opentheshare@naver.com',
    },
} as const;

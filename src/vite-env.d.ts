/// <reference types="vite/client" />

// 사용 중인 환경변수 타입 정의 (.env.example 참고). 새 VITE_* 변수를 추가하면 여기에도 추가하세요.
interface ImportMetaEnv {
  readonly VITE_GOOGLE_SHEET_WEBHOOK_URL?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_ANALYTICS_COLLECT_URL?: string;
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

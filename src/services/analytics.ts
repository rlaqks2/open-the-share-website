/**
 * @file analytics.ts
 * @description 사이트의 모든 측정(페이지뷰·이벤트) 호출이 모이는 단일 진입점입니다.
 *
 * 컴포넌트는 trackPageView / trackEvent 만 호출하고, 실제 전송처는 여기서 결정합니다.
 *   1. GA4 (Google Analytics 4)          — VITE_GA_MEASUREMENT_ID 가 있을 때만 gtag.js 로드
 *   2. 1차 데이터 수집기 (Supabase Postgres) — VITE_ANALYTICS_COLLECT_URL 이 있을 때만 전송
 *   3. 기존 구글 시트 방문자 로그          — VITE_GOOGLE_SHEET_WEBHOOK_URL 이 있을 때만 (페이지뷰만, 이전 기간 병행용)
 *
 * - 환경변수가 하나도 없으면 아무것도 로드·전송하지 않습니다. 로컬 dev 서버에서도 전송하지 않습니다.
 * - 측정 실패가 사이트 동작에 영향을 주지 않도록 모든 호출은 예외를 삼킵니다.
 * - 이벤트·수집 항목을 바꾸면 src/data/privacyPolicy.ts, supabase/functions/collect, docs/ANALYTICS.md 를 함께 수정하세요.
 */
import { trackVisitor, getOrCreateSessionId } from '../utils/visitorTracker';

const GA_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();
const COLLECT_URL = (import.meta.env.VITE_ANALYTICS_COLLECT_URL || '').trim();
const ENABLED = !import.meta.env.DEV;

/** 수집기(Edge Function)가 다른 사이트에서 온 요청을 거르기 위한 식별값 (비밀값 아님) */
const SITE_ID = 'openthe.kr';

/**
 * 사이트에서 보내는 이벤트 목록. 이름은 GA4 와 Postgres(site_events.event_name) 에서 동일하게 쓰입니다.
 * 새 이벤트를 추가하면 supabase/functions/collect/index.ts 의 ALLOWED_EVENTS 에도 추가하세요.
 */
export type AnalyticsEventName =
    | 'inquiry_open' // 문의 모달 열기 (source: 어느 버튼에서)
    | 'form_start' // 문의 폼에 처음 입력 (열기 → 입력 → 제출 이탈 지점 파악)
    | 'contact_click' // 전화·이메일 링크 클릭 (channel, location) — 폼 밖 문의 경로
    | 'generate_lead' // 문의 제출 성공 (GA4 권장 이벤트명 → 전환으로 지정)
    | 'inquiry_error' // 문의 제출 실패 (EmailJS 오류)
    | 'portfolio_view' // 포트폴리오 상세 열람
    | 'search'; // 사이트 검색 (search_term)

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

let gaLoaded = false;

function loadGa(): void {
    if (gaLoaded || !GA_ID || !ENABLED) return;
    gaLoaded = true;
    try {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() {
            // gtag 는 arguments 객체를 그대로 넣어야 동작합니다.
            window.dataLayer!.push(arguments);
        };
        window.gtag('js', new Date());
        // 첫 화면 page_view 는 gtag 가 자동으로 보낸다 (실제 URL·UTM·referrer 포함).
        // ※ send_page_view:false 를 줘도 실측상 자동 page_view 가 나가 중복되었으므로(2026-11-09) 자동 전송에 맡기고,
        //    SPA 화면 전환부터 trackPageView 가 직접 보낸다.
        window.gtag('config', GA_ID, {
            allow_google_signals: false, // 교차 기기 추적·광고 개인화 비활성 (수집 최소화)
            allow_ad_personalization_signals: false,
        });

        const s = document.createElement('script');
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
        document.head.appendChild(s);
    } catch {
        /* 무시 */
    }
}

function gaSend(name: string, params: EventParams): void {
    if (!GA_ID || !ENABLED) return;
    loadGa();
    try {
        window.gtag?.('event', name, params);
    } catch {
        /* 무시 */
    }
}

function utmParams(): { utm_source: string; utm_medium: string; utm_campaign: string } {
    try {
        const p = new URLSearchParams(window.location.search);
        return {
            utm_source: p.get('utm_source') || p.get('source') || '',
            utm_medium: p.get('utm_medium') || '',
            utm_campaign: p.get('utm_campaign') || '',
        };
    } catch {
        return { utm_source: '', utm_medium: '', utm_campaign: '' };
    }
}

/** 1차 데이터 수집기로 전송. IP·지역은 서버(Edge Function)가 요청에서 직접 판별하므로 보내지 않습니다. */
function collect(eventName: string, pagePath: string, pageTitle: string, props: EventParams): void {
    if (!COLLECT_URL || !ENABLED) return;
    try {
        const body = JSON.stringify({
            site: SITE_ID,
            event_name: eventName,
            session_id: getOrCreateSessionId(),
            page_path: pagePath,
            page_title: pageTitle,
            referrer: document.referrer || '',
            ...utmParams(),
            screen_res: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language || '',
            props,
        });
        // sendBeacon 은 text/plain 으로 보내 preflight 가 없고, 페이지를 떠나도 전송이 보장됩니다.
        const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
        if (navigator.sendBeacon && navigator.sendBeacon(COLLECT_URL, blob)) return;
        void fetch(COLLECT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body,
            keepalive: true,
        }).catch(() => {});
    } catch {
        /* 무시 */
    }
}

let currentPage = { path: '/', title: '' };
let isFirstPageView = true;

/**
 * 화면 전환(가상 페이지뷰). 라우터가 없는 SPA 라서 화면 상태를 경로로 표현합니다.
 * @param path  예: '/', '/portfolio?filter=all'
 * @param title 예: '오픈더쉐어 - 메인 홈'
 */
export function trackPageView(path: string, title: string): void {
    currentPage = { path, title };
    if (isFirstPageView) {
        isFirstPageView = false;
        loadGa(); // gtag config 가 첫 page_view 를 자동 전송
    } else {
        gaSend('page_view', {
            page_location: `${window.location.origin}${path}`,
            page_path: path,
            page_title: title,
        });
    }
    collect('page_view', path, title, {});
    void trackVisitor(title); // 기존 구글 시트 로그 (웹훅 미설정 시 동작 안 함)
}

/** 사용자 행동 이벤트. 개인정보(이름·연락처·문의 내용)는 절대 params 에 넣지 마세요. */
export function trackEvent(name: AnalyticsEventName, params: EventParams = {}): void {
    gaSend(name, params);
    collect(name, currentPage.path, currentPage.title, params);
}

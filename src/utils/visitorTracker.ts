/**
 * @file visitorTracker.ts
 * @description 방문자 로그를 수집해 관리자 전용 구글 시트(Google Apps Script 웹앱)로 전송합니다.
 *
 * - 사이트 화면에는 방문자 로그 UI 가 없습니다. 데이터 확인·관리는 구글 시트에서만 합니다.
 *   설정 방법: docs/VISITOR_LOG.md
 * - 웹훅 URL 은 빌드 시 환경변수 VITE_GOOGLE_SHEET_WEBHOOK_URL 로만 주입됩니다.
 *   (GitHub 저장소 Settings → Secrets and variables → Actions → Variables)
 *   설정되지 않았으면 아무것도 수집·전송하지 않습니다 (외부 IP 조회 포함).
 * - 로컬 개발 서버(npm run dev)에서는 수집하지 않습니다.
 * - 수집 항목을 바꾸면 src/data/privacyPolicy.ts 와 docs/VISITOR_LOG.md 의 Apps Script 도 함께 수정하세요.
 */

const WEBHOOK_URL = (import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL || '').trim();

/** Apps Script 쪽에서 엉뚱한 요청을 걸러내기 위한 사이트 식별값 (비밀값 아님) */
const SITE_ID = 'openthe.kr';

interface VisitorLogData {
  site: string;
  visited_at: string;
  session_id: string;
  ip_address: string;
  country: string;
  region: string;
  city: string;
  org_name: string;
  isp: string;
  page_url: string;
  page_title: string;
  referrer: string;
  utm_source: string;
  device_type: string;
  os: string;
  browser: string;
  screen_res: string;
  language: string;
}

// 고유 세션 ID 생성 및 반환 (세션 동안 유지) — services/analytics.ts 의 Postgres 수집기와 같은 값을 공유
export function getOrCreateSessionId(): string {
  try {
    let sid = sessionStorage.getItem('ots_session_id');
    if (!sid) {
      sid = 'ots_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      sessionStorage.setItem('ots_session_id', sid);
    }
    return sid;
  } catch {
    return 'ots_' + Date.now();
  }
}

// 접속 기기 분류
function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

// OS 판별
function getOS(): string {
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return 'Windows';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/Mac/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Other';
}

// 브라우저 판별
function getBrowser(): string {
  const ua = navigator.userAgent;
  if (/Whale/i.test(ua)) return 'Naver Whale';
  if (/Kakaotalk/i.test(ua)) return 'KakaoTalk InApp';
  if (/NAVER/i.test(ua)) return 'Naver InApp';
  if (/SamsungBrowser/i.test(ua)) return 'Samsung Internet';
  if (/Edg/i.test(ua)) return 'Edge';
  if (/Chrome/i.test(ua)) return 'Chrome';
  if (/Safari/i.test(ua)) return 'Safari';
  if (/Firefox/i.test(ua)) return 'Firefox';
  return 'Other';
}

// 현재 한국 시간 (YYYY-MM-DD HH:mm:ss)
function getKSTTimestamp(): string {
  const now = new Date();
  const kstOffset = 9 * 60; // UTC+9
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kst = new Date(utc + kstOffset * 60000);

  const pad = (n: number) => String(n).padStart(2, '0');
  const y = kst.getFullYear();
  const m = pad(kst.getMonth() + 1);
  const d = pad(kst.getDate());
  const hh = pad(kst.getHours());
  const mm = pad(kst.getMinutes());
  const ss = pad(kst.getSeconds());

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

/**
 * 방문자 로그 수집 및 구글 시트로 전송
 * @param customPageTitle 페이지명 직접 지정 (생략 시 document.title)
 */
export async function trackVisitor(customPageTitle?: string): Promise<void> {
  // 웹훅 미설정 또는 로컬 개발 서버 → 수집하지 않음
  if (!WEBHOOK_URL || import.meta.env.DEV) return;

  // 중복 로깅 방지 (같은 탭에서 30초 내 재전송 안 함)
  const lastTrackedKey = 'ots_last_tracked_time';
  const nowTime = Date.now();
  try {
    const lastTracked = sessionStorage.getItem(lastTrackedKey);
    if (lastTracked && nowTime - Number(lastTracked) < 30000) return;
    sessionStorage.setItem(lastTrackedKey, String(nowTime));
  } catch {}

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || urlParams.get('source') || '';

    const logData: VisitorLogData = {
      site: SITE_ID,
      visited_at: getKSTTimestamp(),
      session_id: getOrCreateSessionId(),
      ip_address: '',
      country: '',
      region: '',
      city: '',
      org_name: '',
      isp: '',
      page_url: window.location.pathname + window.location.search,
      page_title: customPageTitle || document.title || '오픈더쉐어',
      referrer: document.referrer || '직접 방문 (Direct)',
      utm_source: utmSource,
      device_type: getDeviceType(),
      os: getOS(),
      browser: getBrowser(),
      screen_res: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language || 'ko-KR',
    };

    // 무료 IP 지오로케이션 API로 IP, 지역, 기관/ISP 조회 (실패해도 나머지 정보는 전송)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const geo = await res.json();
        logData.ip_address = geo.ip || '';
        logData.country = geo.country_name || geo.country || '';
        logData.region = geo.region || '';
        logData.city = geo.city || '';
        logData.org_name = geo.org || '';
        logData.isp = geo.isp || '';
      }
    } catch {
      try {
        const res2 = await fetch('https://api.ipify.org?format=json');
        if (res2.ok) logData.ip_address = (await res2.json()).ip || '';
      } catch {}
    }

    // 구글 Apps Script 웹앱으로 전송 (no-cors: 응답은 읽지 않음, text/plain 으로 보내야 preflight 없이 전달됨)
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(logData),
      keepalive: true,
    });
  } catch (err) {
    // 방문자 로그 실패가 사용자 경험에 영향을 주지 않도록 무시
    console.debug('[OTS Visitor Tracker]', err);
  }
}

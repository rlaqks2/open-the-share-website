/**
 * @file visitorTracker.ts
 * @description (주)오픈더쉐어 공식 웹사이트 방문자 데이터 수집 유틸리티
 * 
 * 구글 생태계(Google Sheets / Google Cloud / BigQuery)와의 완벽한 연동을 위해
 * 접속자의 17개 핵심 지표를 자동 수집하여 지정된 구글 시트(Google Apps Script 웹앱)로 전송합니다.
 */

const STORAGE_KEY_WEBHOOK = 'ots_webhook_url';

export function getStoredWebhookUrl(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_WEBHOOK);
    if (saved) return saved;
  } catch {}
  return import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL || '';
}

export function setStoredWebhookUrl(url: string): void {
  try {
    if (url) {
      localStorage.setItem(STORAGE_KEY_WEBHOOK, url);
    } else {
      localStorage.removeItem(STORAGE_KEY_WEBHOOK);
    }
  } catch {}
}

export interface VisitorLogData {
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

// 고유 세션 ID 생성 및 반환 (세션 동안 유지)
function getOrCreateSessionId(): string {
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
 * 방문자 로그 수집 및 구글 시트로 자동 전송
 * @param customPageTitle 페이지명 직접 지정 (생략 시 document.title)
 * @param force 30초 내 중복 전송 방지 무시 여부 (테스트 전송 시 true)
 */
export async function trackVisitor(customPageTitle?: string, force: boolean = false): Promise<void> {
  // 개발 모드나 중복 로깅 방지 (동일 페이지에서 30초 내 중복 전송 방지, force=true면 즉시 전송)
  const lastTrackedKey = 'ots_last_tracked_time';
  const lastTracked = sessionStorage.getItem(lastTrackedKey);
  const nowTime = Date.now();
  if (!force && lastTracked && nowTime - Number(lastTracked) < 30000) {
    return;
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || urlParams.get('source') || '';

    // 기본 로그 객체 초기화
    const logData: VisitorLogData = {
      visited_at: getKSTTimestamp(),
      session_id: getOrCreateSessionId(),
      ip_address: '조회 중...',
      country: 'KR',
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

    // 무료 IP 지오로케이션 API로 IP, 도시, 기업/ISP 조회
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch('https://ipapi.co/json/', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const geo = await res.json();
        logData.ip_address = geo.ip || '';
        logData.country = geo.country_name || geo.country || 'KR';
        logData.region = geo.region || '';
        logData.city = geo.city || '';
        logData.org_name = geo.org || '';
        logData.isp = geo.isp || '';
      }
    } catch {
      // 보조 백업 IP 조회 (ipify)
      try {
        const res2 = await fetch('https://api.ipify.org?format=json');
        if (res2.ok) {
          const data2 = await res2.json();
          logData.ip_address = data2.ip || '미확인';
        }
      } catch {
        logData.ip_address = '비공개망';
      }
    }

    sessionStorage.setItem(lastTrackedKey, String(nowTime));

    // 로컬 스토리지에 최근 방문 로그 50개 보관 (관리자 화면에서 즉시 확인 가능)
    try {
      const localLogs: VisitorLogData[] = JSON.parse(localStorage.getItem('ots_local_visitor_logs') || '[]');
      localLogs.unshift(logData);
      localStorage.setItem('ots_local_visitor_logs', JSON.stringify(localLogs.slice(0, 50)));
    } catch {}

    // 구글 스프레드시트 웹앱으로 전송
    const webhookUrl = getStoredWebhookUrl();
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors', // 구글 앱스 스크립트 웹앱 CORS 허용 모드
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      });
    }
  } catch (err) {
    // 방문자 로그 전송 실패가 사용자 경험에 일절 영향을 주지 않도록 안전하게 무시
    console.debug('[OTS Visitor Tracker]', err);
  }
}

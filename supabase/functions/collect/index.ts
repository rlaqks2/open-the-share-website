/**
 * Supabase Edge Function: collect
 * openthe.kr 브라우저(src/services/analytics.ts)가 보내는 방문·행동 이벤트를 검증해 public.site_events 에 저장합니다.
 *
 * - 브라우저는 sendBeacon(text/plain) 으로 보내므로 JWT 가 없습니다 → supabase/config.toml 에서 verify_jwt = false
 *   대신 Origin 허용목록 + site 식별값 + 이벤트명 허용목록 + 크기·길이 제한으로 거릅니다.
 * - IP 는 브라우저가 보낸 값을 쓰지 않고 요청 헤더에서 직접 판별합니다.
 * - 지역·기관 조회(ipapi.co)는 세션 첫 페이지뷰에서만, 캐시(ip_lookups)에 없거나 30일 지난 IP 만 합니다.
 * - 응답 내용은 브라우저가 읽지 않습니다(no-cors/beacon). 실패해도 사이트에는 영향 없음.
 *
 * 시크릿(선택): ALLOWED_ORIGINS="https://openthe.kr,https://www.openthe.kr"  (기본값 동일)
 * 자동 주입: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * 가이드: docs/ANALYTICS.md
 */
import { createClient } from 'jsr:@supabase/supabase-js@2';

const SITE_ID = 'openthe.kr';
const MAX_BODY_BYTES = 8 * 1024;
const LOOKUP_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** src/services/analytics.ts 의 AnalyticsEventName + page_view 와 일치해야 합니다. */
const ALLOWED_EVENTS = new Set([
  'page_view',
  'inquiry_open',
  'generate_lead',
  'inquiry_error',
  'portfolio_view',
  'search',
]);

const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') ?? 'https://openthe.kr,https://www.openthe.kr')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } },
);

function corsHeaders(origin: string | null): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0] ?? '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
    Vary: 'Origin',
  };
}

function str(v: unknown, max = 300): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s ? s.slice(0, max) : null;
}

/** props: 1단계 평면 객체, 키 20개, 값은 문자열/숫자/불리언만 */
function cleanProps(v: unknown): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  if (!v || typeof v !== 'object' || Array.isArray(v)) return out;
  for (const [k, val] of Object.entries(v as Record<string, unknown>).slice(0, 20)) {
    if (!/^[a-z0-9_]{1,40}$/.test(k)) continue;
    if (typeof val === 'number' || typeof val === 'boolean') out[k] = val;
    else if (typeof val === 'string') out[k] = val.slice(0, 200);
  }
  return out;
}

function clientIp(req: Request): string | null {
  const xff = req.headers.get('x-forwarded-for');
  const ip = (xff ? xff.split(',')[0] : req.headers.get('x-real-ip') ?? '').trim();
  // inet 캐스팅 실패를 막기 위한 최소 형식 검사 (IPv4 / IPv6)
  return /^[0-9a-fA-F:.]{3,45}$/.test(ip) ? ip : null;
}

function parseUa(ua: string) {
  const device = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)
    ? 'Tablet'
    : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Opera M(obi|ini)/i.test(ua)
    ? 'Mobile'
    : 'Desktop';
  const os = /Windows/i.test(ua) ? 'Windows'
    : /iPhone|iPad|iPod/i.test(ua) ? 'iOS'
    : /Android/i.test(ua) ? 'Android'
    : /Mac/i.test(ua) ? 'macOS'
    : /Linux/i.test(ua) ? 'Linux' : 'Other';
  const browser = /Whale/i.test(ua) ? 'Naver Whale'
    : /KAKAOTALK/i.test(ua) ? 'KakaoTalk InApp'
    : /NAVER/i.test(ua) ? 'Naver InApp'
    : /SamsungBrowser/i.test(ua) ? 'Samsung Internet'
    : /Edg/i.test(ua) ? 'Edge'
    : /Chrome/i.test(ua) ? 'Chrome'
    : /Safari/i.test(ua) ? 'Safari'
    : /Firefox/i.test(ua) ? 'Firefox' : 'Other';
  const isBot = /bot|crawl|spider|slurp|headless|lighthouse|preview/i.test(ua);
  return { device, os, browser, isBot };
}

async function enrichIp(ip: string): Promise<void> {
  const { data } = await supabase.from('ip_lookups').select('fetched_at').eq('ip', ip).maybeSingle();
  if (data && Date.now() - new Date(data.fetched_at).getTime() < LOOKUP_TTL_MS) return;

  const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
    signal: AbortSignal.timeout(2500),
    headers: { 'User-Agent': 'openthe.kr-collector' },
  });
  if (!res.ok) return;
  const geo = await res.json();
  if (geo.error) return;
  await supabase.from('ip_lookups').upsert({
    ip,
    country: str(geo.country_name ?? geo.country, 80),
    region: str(geo.region, 80),
    city: str(geo.city, 80),
    org: str(geo.org, 200),
    fetched_at: new Date().toISOString(),
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return new Response('method not allowed', { status: 405, headers });
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return new Response('forbidden', { status: 403, headers });

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return new Response('too large', { status: 413, headers });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response('bad json', { status: 400, headers });
  }

  const eventName = str(body.event_name, 40);
  const sessionId = str(body.session_id, 80);
  if (body.site !== SITE_ID || !eventName || !ALLOWED_EVENTS.has(eventName) || !sessionId) {
    return new Response('ignored', { status: 202, headers });
  }

  const ua = req.headers.get('user-agent') ?? '';
  const { device, os, browser, isBot } = parseUa(ua);
  if (isBot) return new Response('ignored', { status: 202, headers });

  const ip = clientIp(req);

  const { error } = await supabase.from('site_events').insert({
    session_id: sessionId,
    event_name: eventName,
    page_path: str(body.page_path, 500),
    page_title: str(body.page_title, 200),
    referrer: str(body.referrer, 500),
    utm_source: str(body.utm_source, 100),
    utm_medium: str(body.utm_medium, 100),
    utm_campaign: str(body.utm_campaign, 100),
    device_type: device,
    os,
    browser,
    screen_res: str(body.screen_res, 20),
    language: str(body.language, 20),
    ip,
    props: cleanProps(body.props),
  });
  if (error) {
    console.error('insert failed', error.message);
    return new Response('error', { status: 500, headers });
  }

  // 세션 첫 페이지뷰에서만 IP 지역·기관 조회 (응답 후 백그라운드 처리)
  if (ip && eventName === 'page_view') {
    const task = (async () => {
      const { count } = await supabase
        .from('site_events')
        .select('id', { count: 'exact', head: true })
        .eq('session_id', sessionId)
        .eq('event_name', 'page_view');
      if ((count ?? 0) <= 1) await enrichIp(ip);
    })().catch((e) => console.error('enrich failed', String(e)));
    // deno-lint-ignore no-explicit-any
    const rt = (globalThis as any).EdgeRuntime;
    if (rt?.waitUntil) rt.waitUntil(task);
    else await task;
  }

  return new Response('ok', { status: 200, headers });
});

-- =============================================================================
-- openthe.kr 1차 데이터(방문·이벤트) 저장소
--   수집 경로: 브라우저 → Edge Function `collect` (service_role) → public.site_events
--   가이드: docs/ANALYTICS.md
--
-- 보안 원칙
--   - 브라우저(anon/authenticated)는 이 테이블들을 읽지도 쓰지도 못한다. (RLS 켜고 정책 없음 + 권한 회수)
--   - 쓰기는 Edge Function 이 service_role 로만 한다.
--   - 보유기간 1년: pg_cron 으로 매일 삭제 (src/data/privacyPolicy.ts 제3조와 일치시켜야 함)
-- =============================================================================

-- 1) 이벤트 원장 ---------------------------------------------------------------
create table if not exists public.site_events (
    id            bigint generated always as identity primary key,
    occurred_at   timestamptz not null default now(),
    session_id    text        not null,
    event_name    text        not null,
    page_path     text,
    page_title    text,
    referrer      text,
    utm_source    text,
    utm_medium    text,
    utm_campaign  text,
    device_type   text,          -- Desktop / Mobile / Tablet (User-Agent 로 서버에서 판별)
    os            text,
    browser       text,
    screen_res    text,
    language      text,
    ip            inet,          -- 요청 헤더에서 서버가 판별 (브라우저가 보낸 값은 믿지 않음)
    props         jsonb       not null default '{}'::jsonb
);

comment on table public.site_events is 'openthe.kr 방문·행동 이벤트. 보유기간 1년(pg_cron purge-site-events). docs/ANALYTICS.md';

create index if not exists site_events_occurred_at_idx on public.site_events (occurred_at desc);
create index if not exists site_events_name_time_idx   on public.site_events (event_name, occurred_at desc);
create index if not exists site_events_session_idx     on public.site_events (session_id);
create index if not exists site_events_ip_idx          on public.site_events (ip);

-- 2) IP → 지역/기관 캐시 (외부 조회 횟수 절약, 30일마다 갱신) -------------------
create table if not exists public.ip_lookups (
    ip          inet primary key,
    country     text,
    region      text,
    city        text,
    org         text,           -- IP 소유 기관 (기업 전용 회선이면 기업명, 일반 회선이면 통신사)
    fetched_at  timestamptz not null default now()
);

comment on table public.ip_lookups is 'IP 지역·기관 조회 캐시 (ipapi.co). site_events 와 함께 1년 보유.';

-- 3) 접근 차단 -----------------------------------------------------------------
alter table public.site_events enable row level security;
alter table public.ip_lookups  enable row level security;
revoke all on public.site_events from anon, authenticated;
revoke all on public.ip_lookups  from anon, authenticated;

-- 4) 분석용 뷰 (psql / DBeaver / Looker Studio 에서 바로 사용) ------------------
--    security_invoker: 뷰를 조회하는 사용자의 권한으로 동작 → anon 은 여전히 접근 불가
create or replace view public.v_site_events
with (security_invoker = true) as
select
    e.*,
    (e.occurred_at at time zone 'Asia/Seoul') as occurred_at_kst,
    l.country, l.region, l.city, l.org
from public.site_events e
left join public.ip_lookups l on l.ip = e.ip;

create or replace view public.v_daily_traffic
with (security_invoker = true) as
select
    (occurred_at at time zone 'Asia/Seoul')::date                         as day_kst,
    count(*) filter (where event_name = 'page_view')                      as page_views,
    count(distinct session_id)                                            as sessions,
    count(*) filter (where event_name = 'inquiry_open')                   as inquiry_opens,
    count(*) filter (where event_name = 'generate_lead')                  as leads
from public.site_events
group by 1;

-- 기관(IP 소유자)별 방문 — B2B 관심 기업 파악용. 통신사(KT, SK Broadband 등)는 개인 회선이므로 해석 주의
create or replace view public.v_org_visits
with (security_invoker = true) as
select
    coalesce(l.org, '(미확인)')               as org,
    count(distinct e.session_id)              as sessions,
    count(*) filter (where e.event_name = 'page_view')      as page_views,
    count(*) filter (where e.event_name = 'portfolio_view') as portfolio_views,
    count(*) filter (where e.event_name = 'generate_lead')  as leads,
    max(e.occurred_at at time zone 'Asia/Seoul')            as last_seen_kst
from public.site_events e
left join public.ip_lookups l on l.ip = e.ip
group by 1;

revoke all on public.v_site_events, public.v_daily_traffic, public.v_org_visits from anon, authenticated;

-- 5) 보유기간 1년 자동 파기 (매일 04:00 KST = 19:00 UTC) -------------------------
create extension if not exists pg_cron;

select cron.unschedule(jobid) from cron.job where jobname = 'purge-site-events';
select cron.schedule(
    'purge-site-events',
    '0 19 * * *',
    $$
      delete from public.site_events where occurred_at < now() - interval '1 year';
      delete from public.ip_lookups l
       where not exists (select 1 from public.site_events e where e.ip = l.ip);
    $$
);

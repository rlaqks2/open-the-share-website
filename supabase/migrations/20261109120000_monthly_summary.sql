-- =============================================================================
-- 월별 요약 통계 (장기 추세 보관용)
--   원본 site_events 는 1년 뒤 삭제되지만(purge-site-events), 이 표에는 개인을 알 수 없는
--   월별 합계만 남겨 몇 년치 추세를 비교할 수 있게 한다.
--   - IP·세션 ID·검색어·기관명 등은 넣지 않는다 (개인정보 아님 → 1년 파기 대상 아님)
--   - 매일 03:30 KST 에 최근 두 달을 다시 집계한다 (원본 파기 04:00 보다 먼저)
--   가이드: docs/ANALYTICS.md
-- =============================================================================

create table if not exists public.site_monthly_summary (
    month            date        not null,             -- 해당 월 1일 (한국 시간 기준)
    dimension        text        not null,             -- total / channel / device / page / inquiry_button
    value            text        not null,             -- total 은 'all'
    sessions         integer     not null default 0,   -- 그 달 그 항목의 방문(세션) 수
    page_views       integer     not null default 0,
    inquiry_opens    integer     not null default 0,
    leads            integer     not null default 0,
    portfolio_views  integer     not null default 0,
    updated_at       timestamptz not null default now(),
    primary key (month, dimension, value)
);

comment on table public.site_monthly_summary is
    '월별 요약 통계(개인 식별 불가 합계). 원본 1년 파기와 별개로 장기 보관. refresh_monthly_summary() 가 매일 갱신. docs/ANALYTICS.md';

alter table public.site_monthly_summary enable row level security;
revoke all on public.site_monthly_summary from anon, authenticated;

-- p_from 이후 달을 다시 집계해 덮어쓴다.
-- 원본이 일부 지워진 달을 다시 세면 숫자가 줄어들므로, 원본이 온전히 남아 있는 최근 11개월만 다시 센다.
create or replace function public.refresh_monthly_summary(
    p_from date default (date_trunc('month', now() at time zone 'Asia/Seoul') - interval '1 month')::date
)
returns integer
language sql
set search_path = public
as $$
    with bounds as (
        select greatest(
                   date_trunc('month', p_from)::date,
                   date_trunc('month', (now() at time zone 'Asia/Seoul') - interval '11 months')::date
               ) as from_month
    ),
    e as (
        select
            date_trunc('month', s.occurred_at at time zone 'Asia/Seoul')::date as month,
            s.session_id,
            s.event_name,
            s.page_path,
            s.props,
            case
                when nullif(s.utm_source, '') is not null then s.utm_source
                when coalesce(s.referrer, '') = '' then '직접 방문'
                else regexp_replace(s.referrer, '^https?://(www\.)?([^/:]+).*$', '\2')
            end as channel,
            coalesce(s.device_type, 'Unknown') as device
        from public.site_events s, bounds b
        where s.occurred_at >= (b.from_month::timestamp at time zone 'Asia/Seoul')
          and coalesce(s.utm_source, '') not like 'claude\_%'   -- 확인용 테스트 방문 제외
    ),
    x as (
        select month, 'total'::text as dimension, 'all'::text as value, session_id, event_name from e
        union all
        select month, 'channel', channel, session_id, event_name from e
        union all
        select month, 'device', device, session_id, event_name from e
        union all
        select month, 'page', page_path, session_id, event_name from e
         where event_name = 'page_view' and page_path is not null
        union all
        select month, 'inquiry_button', coalesce(props->>'source', 'other'), session_id, event_name from e
         where event_name = 'inquiry_open'
    ),
    upserted as (
        insert into public.site_monthly_summary
            (month, dimension, value, sessions, page_views, inquiry_opens, leads, portfolio_views, updated_at)
        select
            month, dimension, value,
            count(distinct session_id),
            count(*) filter (where event_name = 'page_view'),
            count(*) filter (where event_name = 'inquiry_open'),
            count(*) filter (where event_name = 'generate_lead'),
            count(*) filter (where event_name = 'portfolio_view'),
            now()
        from x
        group by month, dimension, value
        on conflict (month, dimension, value) do update set
            sessions        = excluded.sessions,
            page_views      = excluded.page_views,
            inquiry_opens   = excluded.inquiry_opens,
            leads           = excluded.leads,
            portfolio_views = excluded.portfolio_views,
            updated_at      = excluded.updated_at
        returning 1
    )
    select count(*)::integer from upserted;
$$;

comment on function public.refresh_monthly_summary(date) is
    '월별 요약 재집계. 기본은 지난달~이번 달. 원본이 온전한 최근 11개월보다 이전은 다시 세지 않음.';

-- 브라우저(anon/authenticated)가 RPC 로 호출하지 못하게 한다
revoke all on function public.refresh_monthly_summary(date) from public, anon, authenticated;

-- 매일 03:30 KST (= 18:30 UTC) 재집계. 원본 파기(04:00 KST)보다 먼저 돈다.
select cron.unschedule(jobid) from cron.job where jobname = 'refresh-monthly-summary';
select cron.schedule(
    'refresh-monthly-summary',
    '30 18 * * *',
    $$ select public.refresh_monthly_summary(); $$
);

-- 최초 적용 시 남아 있는 원본 전체로 채운다 (최근 11개월까지)
select public.refresh_monthly_summary('2000-01-01');

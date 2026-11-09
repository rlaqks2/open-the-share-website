# 측정(Analytics) 가이드 — GA4 + Supabase Postgres

사이트의 모든 측정은 `src/services/analytics.ts` 한 곳을 거쳐 아래로 나갑니다. **환경변수가 없는 전송처는 꺼져 있습니다.**

```
브라우저 ─ trackPageView / trackEvent
   ├─▶ GA4 (gtag.js)                       ← VITE_GA_MEASUREMENT_ID
   │      └─(일 단위 내보내기)─▶ BigQuery       (선택, SQL 로 원본 이벤트 조회)
   ├─▶ Supabase Edge Function `collect`     ← VITE_ANALYTICS_COLLECT_URL
   │      └─▶ Postgres public.site_events  (+ ip_lookups, 분석 뷰)
   └─▶ Apps Script → 구글 시트 (페이지뷰만) ← VITE_GOOGLE_SHEET_WEBHOOK_URL  (병행 후 종료 예정, VISITOR_LOG.md)
```

- 로컬 `npm run dev` 에서는 아무것도 보내지 않습니다. 확인은 `npm run build && npm run preview` (+ `.env.local`).
- 개인정보 처리방침(`src/data/privacyPolicy.ts`)은 **켜진 도구만 빌드 시점에 자동 고지**합니다.

## 1. 이벤트 목록

| 이벤트 | 언제 | 파라미터(props) | GA4 에서 |
|---|---|---|---|
| `page_view` | GA4: 첫 화면은 gtag 자동 전송(실제 URL·UTM 포함), 이후 화면 전환(`/portfolio?filter=…`)만 코드가 전송 / Postgres: 매 화면 | — | 자동 |
| `inquiry_open` | 문의 모달 열기 | `source`: header / hero / cta / portfolio_page | |
| `generate_lead` | 문의 메일 발송 성공 | `org_category`, `program_type` | **주요 이벤트(전환)로 지정** |
| `inquiry_error` | 문의 발송 실패 | `org_category` | |
| `portfolio_view` | 포트폴리오 상세 열람 | `item_id`, `item_title`, `partner`, `category` | |
| `search` | 검색어 입력 후 1.2초 멈춤 (2자 이상) | `search_term` | 자동(사이트 검색) |

**이벤트 추가 절차**: ① `analytics.ts` 의 `AnalyticsEventName` ② `supabase/functions/collect/index.ts` 의 `ALLOWED_EVENTS` ③ 이 표 ④ 수집 항목이 늘면 `privacyPolicy.ts`. 이름·연락처·문의 내용 등 **개인정보는 props 에 절대 넣지 않습니다.**

## 2. GA4 설정 (10분)

1. 회사 전용 Google 계정으로 [analytics.google.com](https://analytics.google.com) → 속성 만들기 (시간대: 대한민국, 통화: KRW)
2. 데이터 스트림 → 웹 → `https://openthe.kr` → **측정 ID `G-XXXXXXXXXX`** 복사
   - 향상된 측정에서 **"페이지 변경 시 브라우저 기록 이벤트" 는 끄기** (SPA 페이지뷰는 코드에서 직접 보냄, 중복 방지)
3. 관리 → 데이터 설정 → 데이터 보관 → 이벤트 데이터 보관 **2개월** (선택지는 2개월/14개월뿐. 처리방침의 보유기간 1년을 넘지 않도록 2개월 — 표준 보고서의 집계 수치는 그대로 남고, 탐색 분석의 사용자 단위 데이터만 지워짐)
4. 관리 → 이벤트 → `generate_lead` 를 **주요 이벤트**로 표시 (Ad Grants 전환 추적에 사용)
5. GitHub 저장소 → Settings → Secrets and variables → Actions → **Variables** → `VITE_GA_MEASUREMENT_ID` = `G-…` → 재배포
6. (선택) 관리 → BigQuery 연결 → **일별** 내보내기. 샌드박스(결제 계정 없음)는 테이블이 60일 후 삭제되므로 오래 보관하려면 결제 계정 연결 + 예산 알림

## 3. Supabase 설정 (30분)

### ① 프로젝트
- [supabase.com](https://supabase.com) 에서 새 프로젝트, **Region: Northeast Asia (Seoul)** — 처리방침에 "대한민국(서울 리전)"으로 고지되어 있음
- DB 비밀번호는 비밀번호 관리자에 보관 (저장소·`VITE_*` 금지)

### ② CLI 로 스키마·함수 배포
```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push
npx supabase functions deploy collect
```
- `db push` 가 `supabase/migrations/*.sql` 을 적용합니다 (테이블·뷰·RLS·pg_cron 1년 파기).
- `collect` 는 `supabase/config.toml` 에 따라 **JWT 검증 없이** 배포됩니다 (브라우저 sendBeacon 은 인증 헤더를 못 보냄). 함수 안에서 Origin 허용목록·이벤트명·크기를 검증합니다.
- 허용 Origin 을 바꾸려면: `npx supabase secrets set ALLOWED_ORIGINS="https://openthe.kr,https://www.openthe.kr"` (기본값과 동일)

### ③ 사이트에 연결
GitHub Variables → `VITE_ANALYTICS_COLLECT_URL` = `https://<project-ref>.supabase.co/functions/v1/collect` → 재배포

### ④ 동작 확인
배포 후 openthe.kr 을 열고:
```sql
select occurred_at_kst, event_name, page_path, device_type, browser, org
from v_site_events order by occurred_at desc limit 20;
```

## 4. 조회 (psql / DBeaver)

접속 정보: Supabase → Project Settings → Database → Connection string (Session pooler 권장).

```sql
-- 일별 트래픽·전환
select * from v_daily_traffic order by day_kst desc limit 30;

-- 관심 기업 (IP 소유 기관별). 통신사(KT, SK Broadband, LG U+)는 개인 회선이라 제외하고 보기
select * from v_org_visits
where org !~* '(kt|korea telecom|sk broadband|lg ?u|lg powercomm|mobile)'
order by sessions desc limit 50;

-- 문의 전환 경로: 어느 버튼에서 연 문의가 실제 접수로 이어졌나
select o.props->>'source' as source,
       count(distinct o.session_id) as opened,
       count(distinct l.session_id) as submitted
from site_events o
left join site_events l on l.session_id = o.session_id and l.event_name = 'generate_lead'
where o.event_name = 'inquiry_open'
group by 1 order by opened desc;

-- 인기 포트폴리오 / 검색어
select props->>'item_title' as title, count(*) from site_events
where event_name = 'portfolio_view' group by 1 order by 2 desc limit 20;

select props->>'search_term' as term, count(*) from site_events
where event_name = 'search' group by 1 order by 2 desc limit 20;

-- 유입 (UTM 캠페인)
select coalesce(utm_source, '(none)') src, count(distinct session_id) sessions
from site_events where event_name = 'page_view' group by 1 order by 2 desc;
```

### 읽기 전용 계정 (Looker Studio·외부 도구용)
Looker Studio 의 PostgreSQL 커넥터에는 `postgres` 대신 아래 계정을 씁니다. (SQL Editor 에서 실행, 비밀번호는 직접 정해 안전하게 보관)
```sql
create role analytics_reader login password '<직접 정한 비밀번호>';
grant usage on schema public to analytics_reader;
grant select on public.site_events, public.ip_lookups,
                public.v_site_events, public.v_daily_traffic, public.v_org_visits to analytics_reader;
-- 두 테이블은 RLS 가 켜져 있으므로 이 계정용 읽기 정책이 필요
create policy analytics_reader_select on public.site_events for select to analytics_reader using (true);
create policy analytics_reader_select on public.ip_lookups  for select to analytics_reader using (true);
```

## 5. 운영

| 항목 | 방법 |
|---|---|
| 보유기간 1년 파기 | pg_cron `purge-site-events` 매일 04:00 KST (`select * from cron.job_run_details order by start_time desc limit 5;` 로 확인) |
| 삭제 요청 대응 | `delete from site_events where ip = '<IP>' or session_id = '<ID>';` + 같은 IP 의 `ip_lookups` 삭제 |
| 무료 플랜 일시 중지 | 1주간 활동 없으면 중지됨. 매일 방문이 있으면 보통 문제없음 |
| 백업 | 무료 플랜은 자동 백업 없음 → 필요해지면 주 1회 `pg_dump` (GitHub Actions + 비공개 저장소) 또는 Pro 전환 |
| 스팸 의심 | 함수 URL 은 공개값이고 Origin 헤더는 브라우저 밖에서 위조 가능. 이상 유입 시 해당 IP 행 삭제, 계속되면 함수를 새 이름(`collect_v2`)으로 배포하고 Variables 교체 |
| 구글 시트 로그 종료 | Postgres 수집이 1~2주 안정적이면 GitHub Variables `VITE_GOOGLE_SHEET_WEBHOOK_URL` 삭제 → 재배포 → 처리방침에서 Google Sheets·브라우저 ipapi/ipify 항목 정리 |
| 비영리 승인 후 | GA4·GCP·Looker Studio 소유권을 Workspace 계정으로 이전, Ad Grants 를 GA4 에 연결 (`generate_lead` 전환 가져오기) |

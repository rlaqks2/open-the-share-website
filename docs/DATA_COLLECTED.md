# 수집 데이터 명세 — 무엇을, 어디에, 어떻게 모으나

openthe.kr 이 방문자에게서 수집하는 데이터의 **전체 목록**입니다. 수집 항목이 바뀌면 이 문서, `src/data/privacyPolicy.ts`(처리방침), [ANALYTICS.md](ANALYTICS.md) 를 함께 고칩니다. (CLAUDE.md R8)

> 기준일: 2026-11-09 · 설정·쿼리 방법은 [ANALYTICS.md](ANALYTICS.md)

## 1. 수집 경로 한눈에

| 경로 | 상태 | 저장 위치 | 보유기간 | 조회 방법 |
|---|---|---|---|---|
| **Supabase Postgres** (1차 데이터) | ✅ 운영 중 | `forachixmfkdenzzvfog` (서울) `public.site_events`, `public.ip_lookups` | 1년 (pg_cron 매일 04:00 KST 자동 삭제) | Supabase SQL Editor, psql/DBeaver, Looker Studio |
| **Google Analytics 4** | ✅ 운영 중 | GA4 속성 `openTheShare` (`G-HQ1X2K8LNH`) | 사용자 단위 데이터 2개월 (집계 보고서는 유지) | GA4 보고서·탐색, (선택) BigQuery |
| 구글 시트 방문자 로그 | ⏸ 꺼짐 | — | — | `VITE_GOOGLE_SHEET_WEBHOOK_URL` 미등록 → 수집 안 함 ([VISITOR_LOG.md](VISITOR_LOG.md)) |
| 문의 폼 (EmailJS) | ✅ 운영 중 | 담당자 메일함 (`opentheshare@naver.com`) | 1년 | 메일함 — **측정 데이터와 별개**, DB 에 저장하지 않음 |

```
브라우저 (src/services/analytics.ts)
  ├─ trackPageView / trackEvent ─▶ GA4 (gtag.js, 쿠키 _ga)
  └─ sendBeacon(text/plain) ─────▶ Edge Function `collect` ─▶ site_events
                                       │ (IP·기기는 서버가 판별)
                                       └─ 세션 첫 page_view 만 ipapi.co 조회 ─▶ ip_lookups
```

## 2. 수집 시점 (이벤트)

같은 이벤트 이름이 GA4 와 Postgres 양쪽에 기록됩니다.

| 이벤트 | 언제 발생 | 함께 기록되는 값 (props) | 코드 위치 |
|---|---|---|---|
| `page_view` | 첫 화면 진입, 메인↔포트폴리오 화면 전환 | — (경로·제목은 별도 컬럼) | `App.tsx` |
| `inquiry_open` | 문의 모달을 열 때 | `source`: `header` / `hero` / `cta` / `portfolio_page` | `App.tsx` `openInquiry` |
| `form_start` | 문의 폼에 **처음 입력**할 때 (폼당 1회) | `first_field`: 처음 건드린 항목 키 | `forms/InquiryForm.tsx` |
| `generate_lead` | 문의 메일 발송 **성공** | `org_category`(기업/관공서/학교/기타), `program_type`(온앤온/온팅), `referral`(알게 된 경로, 미선택 시 `미선택`), `lead_id`(문의 식별번호) | `forms/InquiryForm.tsx` |
| `inquiry_error` | 문의 메일 발송 실패 | `org_category`, `lead_id` | `forms/InquiryForm.tsx` |
| `contact_click` | 전화·휴대전화·이메일 링크 클릭 | `channel`: `tel` / `mobile` / `email`, `location`: `footer` (번호·주소 값은 보내지 않음) | `layout/Footer.tsx` |
| `portfolio_view` | 포트폴리오 상세 모달 열람 | `item_id`, `item_title`, `partner`, `category` | `App.tsx` `openPortfolioDetail` |
| `search` | 검색창 입력이 1.2초 멈췄을 때 (2자 이상, 최대 50자) | `search_term` | `modals/SearchModal.tsx` |

- GA4 의 첫 화면 `page_view` 는 gtag 가 자동 전송합니다 (실제 URL·UTM 포함). Postgres 는 매 화면 기록합니다.
- 로컬 개발 서버(`npm run dev`)에서는 아무것도 보내지 않습니다.
- **`lead_id`**: 문의 제출 시 `L+YYMMDD-영숫자4자`(예: `L261110-7K2Q`)로 만들어 측정 이벤트와 **문의 메일 제목 `[L…]`·본문 하단**에 함께 넣습니다. 담당자가 메일의 번호로 미팅·계약 결과를 기록하면 `site_events` 의 유입 채널(UTM·referrer)과 연결할 수 있습니다. 이름·연락처는 DB 로 가지 않습니다.
- **알게 된 경로(`referral`)**: 문의 폼 선택 항목(네이버 검색 / 구글 등 기타 검색 / 네이버 블로그 / SNS / 지인·동료 추천 / 이전 참여 경험 / 행사·박람회·제안서 / 언론 보도 / 기타). UTM 으로 안 잡히는 입소문 경로를 보완합니다.

## 3. Postgres 테이블 구조

### 3-1. `public.site_events` — 이벤트 원장 (1행 = 이벤트 1건)

| 컬럼 | 타입 | 내용 | 출처 | 예시 |
|---|---|---|---|---|
| `id` | bigint (identity, PK) | 일련번호 | DB | `1` |
| `occurred_at` | timestamptz | 수집 시각 (UTC 저장, 뷰에서 KST 변환) | DB `now()` | `2026-11-09 08:53:35+00` |
| `session_id` | text | 임의 세션 식별값. 탭을 닫으면 새로 생성 (sessionStorage `ots_session_id`) | 브라우저 | `ots_6icjlf0h_…` |
| `event_name` | text | 이벤트 이름 (2장 표, 허용목록 외 저장 안 함) | 브라우저 | `page_view` |
| `page_path` | text | 가상 경로 | 브라우저 | `/`, `/portfolio?filter=all` |
| `page_title` | text | 화면 제목 | 브라우저 | `오픈더쉐어 - 메인 홈` |
| `referrer` | text | 직전 사이트 주소 (직접 방문이면 null) | 브라우저 `document.referrer` | `https://search.naver.com/…` |
| `utm_source` | text | 캠페인 출처 (`?utm_source=` 또는 `?source=`) | 브라우저 URL | `newsletter` |
| `utm_medium` | text | 캠페인 매체 (`?utm_medium=`) | 브라우저 URL | `email` |
| `utm_campaign` | text | 캠페인 이름 (`?utm_campaign=`) | 브라우저 URL | `2026_csr` |
| `device_type` | text | Desktop / Mobile / Tablet | **서버**가 User-Agent 로 판별 | `Desktop` |
| `os` | text | Windows / macOS / iOS / Android / Linux / Other | 서버 (UA) | `Windows` |
| `browser` | text | Chrome / Safari / Edge / Samsung Internet / Naver Whale / KakaoTalk InApp / Naver InApp / Firefox / Other | 서버 (UA) | `Chrome` |
| `screen_res` | text | 화면 해상도 | 브라우저 | `1536x864` |
| `language` | text | 브라우저 언어 | 브라우저 | `ko` |
| `ip` | inet | 접속 IP | **서버**가 요청 헤더(`x-forwarded-for`)에서 판별 (브라우저가 보낸 값은 쓰지 않음) | (개인정보 — 문서에 기재하지 않음) |
| `props` | jsonb | 이벤트별 추가 값 (2장 props, 키 20개·값 200자 제한) | 브라우저 | `{"source":"cta"}` |

인덱스: `occurred_at desc`, `(event_name, occurred_at desc)`, `session_id`, `ip`

**저장하지 않는 것**: User-Agent 원문, 이름·연락처·이메일·문의 내용, 쿠키, 브라우저가 보낸 IP. 봇(UA 에 bot/crawl/spider/headless/lighthouse/preview)은 저장하지 않습니다.

### 3-2. `public.ip_lookups` — IP → 지역·기관 캐시 (1행 = IP 1개)

| 컬럼 | 타입 | 내용 | 예시 |
|---|---|---|---|
| `ip` | inet (PK) | IP | — |
| `country` | text | 국가 | `South Korea` |
| `region` | text | 시·도 | `Gyeonggi-do` |
| `city` | text | 시 단위 (서울 등 특별·광역시는 시 이름 그대로, **구 단위 없음**) | `Seongnam-si`, `Seoul` |
| `org` | text | IP 대역 등록 주체(ASN/WHOIS) — 대부분 통신사, 자체 대역을 가진 대기업·공공기관·대학만 기관명 | `Korea Telecom` |
| `fetched_at` | timestamptz | 조회 시각 (30일 지나면 재조회) | — |

> ⚠ **정확도 한계 — 참고용으로만 씁니다.**
> - `region`·`city` 는 통신사가 대역을 등록한 위치 기준 추정값입니다. 서울은 `Seoul / Seoul` 까지만 나오고 **구(區)는 IP 로 알 수 없습니다.** 모바일·VPN 은 실제 위치와 다른 시·도로 찍히기도 합니다.
> - `org` 는 **방문한 회사가 아니라 회선 소유자**입니다. 중소기업·단체·재택 방문은 거의 모두 통신사로 찍히므로, 통신사가 아닌 이름이 나온 경우만 "해당 기관 네트워크에서 접속했을 가능성"으로 참고합니다. 관심 기업 판단은 문의 폼의 단체 유형, UTM, referrer 를 우선합니다.

- 조회 시점: **세션의 첫 `page_view`** 에서만, 캐시에 없거나 30일 지난 IP 만 ipapi.co 에 조회 (무료 한도 절약)
- `site_events` 에서 더 이상 참조하지 않는 IP 는 매일 자동 삭제

### 3-3. 분석용 뷰

| 뷰 | 용도 | 주요 컬럼 |
|---|---|---|
| `v_site_events` | 이벤트 + 지역·기관 조인, KST 시각 | `site_events.*`, `occurred_at_kst`, `country`, `region`, `city`, `org` |
| `v_daily_traffic` | 일별 요약 | `day_kst`, `page_views`, `sessions`, `inquiry_opens`, `leads` |
| `v_org_visits` | 기관(IP 소유자)별 방문 — 자체 대역 기관만 의미 있음 (참고용, 3-2 한계 참조) | `org`, `sessions`, `page_views`, `portfolio_views`, `leads`, `last_seen_kst` |

### 3-4. 접근 권한

| 주체 | 권한 |
|---|---|
| 브라우저 (anon / authenticated) | ❌ 테이블·뷰 읽기·쓰기 모두 불가 (RLS ON + 권한 회수) |
| Edge Function `collect` (service_role) | ✅ insert / upsert |
| 대시보드 관리자 (postgres) | ✅ 전체 |
| (선택) `analytics_reader` | 읽기 전용 — Looker Studio 등 외부 도구용 ([ANALYTICS.md](ANALYTICS.md) 4장) |

## 4. GA4 가 수집하는 것

### 4-1. 자동 수집 (GA4 기본 + 향상된 측정)

| 구분 | 내용 |
|---|---|
| 자동 이벤트 | `first_visit`, `session_start`, `user_engagement`(체류 시간) |
| 향상된 측정 (켜짐) | 스크롤(90%), 이탈 클릭(외부 링크), 파일 다운로드, 양식 상호작용(`form_start`/`form_submit`), 동영상 참여, 사이트 검색(URL 검색어 — 이 사이트는 해당 없음) |
| 향상된 측정 (꺼짐) | 브라우저 기록 기반 페이지 변경 (SPA 중복 방지) |
| 유입 | 소스/매체, 캠페인(UTM), 참조 사이트, 방문 페이지 |
| 사용자 환경 | 국가·지역·도시(IP 기반 추정, **GA4 는 IP 를 저장하지 않음**), 언어, 기기 카테고리·모델, OS, 브라우저, 화면 해상도 |
| 식별자 | `_ga` 쿠키의 임의 클라이언트 ID (교차 기기 추적·광고 개인화 신호는 끔) |

### 4-2. 사이트 이벤트 + 맞춤 측정기준

2장의 6개 이벤트가 GA4 에도 전송됩니다. props 는 아래 **맞춤 측정기준**으로 등록되어 보고서에서 나눠 볼 수 있습니다 (등록 이후 데이터부터).

| 맞춤 측정기준 | 매개변수 |
|---|---|
| 문의 버튼 위치 | `source` |
| 포트폴리오 제목 / 파트너 / 분류 | `item_title` / `partner` / `category` |
| 문의 단체 유형 / 희망 방식 | `org_category` / `program_type` |
| (GA4 기본) 검색어 | `search_term` |

주요 이벤트(전환): `purchase`(GA4 기본값, 미사용) — **`generate_lead` 는 첫 실제 문의 후 ☆ 지정 예정**

## 5. 브라우저에 남기는 값

| 저장소 | 키 | 내용 | 수명 |
|---|---|---|---|
| sessionStorage | `ots_session_id` | 임의 세션 ID (Postgres·구글시트 공용) | 탭 닫으면 삭제 |
| sessionStorage | `ots_last_tracked_time` | 구글 시트 로그 30초 중복 방지 (현재 시트 꺼짐) | 탭 닫으면 삭제 |
| 쿠키 | `_ga`, `_ga_HQ1X2K8LNH` | GA4 클라이언트·세션 식별 | GA4 기본(최대 2년) |

## 6. 이 데이터로 알 수 있는 것

| 질문 | 어디서 |
|---|---|
| 하루 방문·세션·문의 수 추이 | `v_daily_traffic` / GA4 개요 |
| 어디서 들어왔나 (네이버·구글·블로그·캠페인) | `referrer`, `utm_*` / GA4 트래픽 획득 |
| 어떤 기업 네트워크에서 방문했나 (참고용) | `v_org_visits` (통신사 제외하고 보기 — 자체 대역 대기업·공공기관만 잡힘) |
| 어느 지역에서 방문했나 (참고용) | `v_site_events` `region`·`city` — 시·도 / 시 단위까지, 서울 구 단위 불가 |
| 어떤 포트폴리오·파트너 사례가 관심을 끄나 | `portfolio_view` props / GA4 맞춤 측정기준 |
| 사람들이 무엇을 검색하나 | `search` props |
| 어느 버튼이 문의로 이어지나 | `inquiry_open.source` → 같은 세션 `generate_lead` |
| 문의 폼 이탈 (열기 → 작성 시작 → 제출) | `inquiry_open` → `form_start` → `generate_lead` 세션 수 |
| 폼 대신 전화·메일로 연락하려는 방문 | `contact_click` (`channel`) |
| 어떤 경로로 알고 문의했나 / 그 문의가 계약됐나 | `generate_lead.referral`, `lead_id` ↔ 메일함의 문의번호 |
| 기기·브라우저 비중 (카카오톡 인앱 등) | `device_type`, `browser` / GA4 기술 보고서 |

## 7. 현재 쌓인 데이터 (2026-11-09 18:00 KST 스냅샷)

| 항목 | 값 |
|---|---|
| Postgres `site_events` | **1건** (`page_view` 1) · 세션 1 · `ip_lookups` 1 |
| 기간 | 2026-11-09 17:53 KST ~ (수집 시작 직후) |
| GA4 | 실시간 보고서에서 테스트 방문 확인. 표준 보고서는 24~48시간 후 반영 |

현재 1건은 연결 확인용 **테스트 방문**입니다:

| occurred_at_kst | event | path | utm_source | device / os / browser | screen | lang | 지역 | org |
|---|---|---|---|---|---|---|---|---|
| 2026-11-09 17:53:35 | page_view | `/` | `claude_verify_db` | Desktop / Windows / Chrome | 1536x864 | ko | South Korea, Gyeonggi-do, Seongnam-si | Korea Telecom |

테스트 데이터 정리: `delete from site_events where utm_source like 'claude_verify%';`
(GA4 의 테스트 방문 `claude_verify`, `claude_verify2` 는 삭제 불가 — 2개월 후 사용자 데이터 만료)

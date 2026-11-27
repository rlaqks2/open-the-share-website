# CHANGELOG — 구조·하네스 변경 이력

콘텐츠(포트폴리오 추가 등) 변경은 기록하지 않습니다. 구조·규칙·배포·외부연동이 바뀔 때만 기록합니다.

## 2026-11-27 — 검색엔진 노출 기반 (운영 배포 2026-11-27)

- `public/robots.txt`·`public/sitemap.xml` 추가
- Vite 플러그인 `scripts/seo-html.ts`: 빌드 때 `index.html` 에 소유확인 메타(`src/config/seo.ts`, 값 있을 때만)·JSON-LD(Organization·WebSite)·`#root` 정적 본문(mockData 의 히어로·프로그램·회사정보)을 넣음. JS 를 실행하지 않는 검색 로봇도 회사·프로그램 내용을 읽을 수 있게 함
- `mockData.ts` 의 `BASE_URL` 을 `import.meta.env?.BASE_URL ?? "/"` 로 변경 (Node 에서 읽는 vite.config 대응, 브라우저 빌드 결과는 동일)
- DEPLOYMENT §3-1(검색 등록 절차), STRUCTURE 갱신

## 2026-11-25 (3) — 현장스케치 누락 27건 복구 + 수집 경로를 카테고리 목록으로 변경 (브랜치 `feature/supabase-content`)

- 원인: `sync_blog.py` 가 RSS(전체 카테고리 최근 50개, 2026-08-31 이후)만 봐서 그 이전 현장스케치 글은 한 번도 수집되지 않음. 블로그 현장스케치 125건 중 사이트 98건 → 27건 누락 (2018~2023년 25건 + 최근 2건). 의도적으로 뺀 글은 없었음(git 이력 확인)
- 수정: 포트폴리오 후보를 네이버 모바일 API 의 현장스케치 카테고리(48) 글 목록에서 가져옴 (평소 최신 30건, `--backfill` 이면 전체). RSS 는 언론보도용 + 목록 API 실패 시 대체. 예전 글 제목의 `[오픈더퓨처 단체 및 기업 봉사활동]` 머리말 제거
- 데이터: 27건을 Supabase 에 추가(id 99~125, 썸네일 `item_099~125.jpg`). 참여기관·유형·분류·요약은 기존 항목 형식에 맞춰 사람이 검수. id 125(11.24 선문대 RCY 목도리)는 id 98(11.05)과 사진이 같은 재게시지만, 운영 방침("현장스케치 글은 전부 노출")에 따라 그대로 공개 → 사이트 노출 125건

## 2026-11-25 (2) — Supabase 데이터 위생 + 소스 구조도 (브랜치 `feature/supabase-content`, 미배포 — DB 쪽은 운영에 적용 완료)

- DB: `purge_stale_data()` 로 정리를 한 함수에 모음 (마이그레이션 `20261125120000_data_hygiene.sql`, 운영 DB 적용·1회 실행 확인). 기존 1년 파기·고아 IP 캐시 삭제에 더해 **테스트 방문(`utm_source=claude_*`) 1일**, **pg_cron 실행 기록 14일**(기존엔 무기한 누적). pg_cron `purge-site-events` 는 같은 시간(04:00 KST)에 이 함수를 호출. 용량 확인 뷰 `v_storage_usage`
- 처리방침 보유기간(1년)은 그대로 — 더 일찍 지우는 변경이라 `privacyPolicy.ts` 수정 없음
- 하네스: `STRUCTURE.md`(전체 소스 구조도·mermaid 다이어그램·수정 위치 색인), `DATA_RETENTION.md`(테이블별 보관·정리·용량 점검) 신설. CLAUDE.md **R9**(정리 규칙 없는 데이터 금지, 정리는 `purge_stale_data()` 에) 추가, 문서 지도·작업 절차·VERIFICATION L4·README 갱신

## 2026-11-25 — 포트폴리오·언론보도 원본을 Supabase 콘텐츠 DB 로 이전 (브랜치 `feature/supabase-content`, 미배포)

- DB: `portfolio_items`·`press_releases` 신설 (마이그레이션 `20261125000000_site_content.sql`, 측정과 같은 프로젝트). RLS — anon 은 `is_published` 행 읽기만. 기존 `mockData.ts` 98건·15건을 그대로 이전(내용·순서 일치 확인, 언론보도 id 는 1~15 로 재부여)
- 빌드: `npm run build/dev/typecheck` 가 먼저 `scripts/pull-content.mjs` 로 공개 행을 `src/data/generated/*.json`(git 제외)에 저장 → `mockData.ts` 가 import. 방문자 브라우저는 DB 를 호출하지 않음. CI 에서 조회 실패·0건이면 빌드 중단. 결과 해시를 `/content-version.txt` 로 배포
- 봇: `sync_blog.py` 가 `mockData.ts` 대신 RPC `content_state`/`content_ingest`(토큰 sha256 검사, SECURITY DEFINER) 로 DB 에 씀. 이미 있는 log_no/link(숨김 포함)는 건너뜀. CI 는 `--stage` → 썸네일만 커밋·push → `--ingest-pending` 2단계
- 배포: `sync-blog.yml` 이 DB 내용 해시를 운영 `/content-version.txt` 와 비교해 다를 때만 빌드·배포 → Table Editor 수정도 자동 반영. **운영 저장소 Secret `CONTENT_INGEST_TOKEN` 등록 필요**
- 규칙: CLAUDE.md R2(mockData 마커) 폐지 → "콘텐츠 원본은 DB, generated JSON 수정·커밋 금지"로 교체. DATA_GUIDE 2·3장, NO_BACKEND_POLICY, ARCHITECTURE, WORKFLOWS, VERIFICATION, PLANNER_GUIDE, `/add-portfolio`·`/verify` 갱신

## 2026-11-24 — 점검 후 버그·운영 이슈 수정 (브랜치 `feature/programs-redesign`, 미배포)

- 버그: 모바일(375px) 가로 넘침(포트폴리오 전체보기 버튼·푸터 저작권 줄), 문의 전송 실패 후 '다시 시도' 시 입력값 유실(폼을 숨기기만 함 + 오류 화면에 대표전화·이메일), 모달 안에서 드래그해 바깥에서 떼면 닫히던 문제(`Modal`·`SearchModal`: 배경에서 누르고 뗄 때만 닫힘), 검색창 '전체 결과 보기'가 검색어를 넘기지 않던 문제(`PortfolioPage` `initialQuery` + 이동마다 key 로 재마운트), 연도 필터 기준 불일치, `PortfolioDetailModal` 조건부 Hook
- 데이터: 참여 인원 `participants: 0` = 미확인 → 상세 화면에서 인원 미표시. `sync_blog.py` 기본값 30 → 0. 기존 자동 수집분의 30(22건)·40(56건)은 검수 전까지 그대로 표시됨
- 배포: `sync-blog.yml` 을 빌드 통과 후 push 하도록 순서 변경. 두 워크플로 권한을 `contents: write` 만 남기고 `peaceiris/actions-gh-pages@v4` 로 갱신. `ship`/`deploy.bat` 에 운영 저장소 origin 확인(`scripts/check-prod-remote.mjs`)
- 측정: `collect` 함수에 IP(없으면 세션)당 분당 120건 요청 제한 (**Supabase 재배포 필요**). 처리방침의 Google Sheets·ipify 행은 시트 웹훅이 설정된 경우에만 표시 (운영 설정에서는 표시 내용 동일)
- 의존성: `npm audit fix` (vite 5.4.21 등). 남은 5건은 vite 8 메이저 업그레이드가 필요한 개발 서버 전용 항목

## 2026-11-19 (2) — 운영 방향 반영: 메시지 통일·비슷한 사례·공유 링크·문의 항목 (브랜치 `feature/programs-redesign`, 미배포)

- 메시지 통일: 히어로 카드·키워드, 푸터, 포트폴리오 페이지, 문의 폼 '희망 프로그램'을 2대 사업(원데이메이킹 / 행사 컨설팅·대행) 기준으로 정리. 온앤온·온팅은 원데이메이킹의 운영 방식(대면·비대면)으로 표기
- 포트폴리오 상세: '비슷한 사례' 3건(같은 프로그램 → 같은 참여 유형 → 최신순) + '링크 복사'. 상세를 열면 주소에 `?story=ID`, 그 주소로 들어오면 해당 사례가 바로 열림. `#섹션` 주소도 첫 진입 시 스크롤
- 측정: `portfolio_view` 에 `source`(click/similar/shared_link), 새 이벤트 `portfolio_share` (Postgres 저장은 `collect` 함수 재배포 필요)
- 문의 폼: 희망 시기·예산 범위(선택) 추가, 메일 제목·본문에 포함. 처리방침 수집 항목 갱신, 시행일 2026-11-19
- 문서: ANALYTICS 6장 월간 점검 루틴
- 참고: 포트폴리오 참여 인원은 자동 수집 기본값(30·40)이 많아 인원 기준 필터·비교는 넣지 않음

## 2026-11-19 — '핵심 사업 안내' 섹션 리디자인 (미배포)

- `ProgramsSection`: 2대 사업 카드 + 하단 2분할(좌: 나눔 키트 구성 옵션 BASIC + A~D 선택 토글 / 우: 4대 핵심 콘텐츠 SVG 아이콘). 온앤온·온팅 브랜드 카드와 ② 행사 대행 상세 블록은 섹션에서 제외(`flagshipBrands` 데이터는 히어로 아이콘 등을 위해 유지)
- 데이터: `programOptions` 를 `title`/`detail` 구조로 바꾸고 옵션 D(소셜 임팩트 리포트) 추가, 화면용 `coreContents` 신설(`programs` 는 추천 규칙이 id 로 참조하므로 유지)
- '맞춤 견적 문의하기' → 선택 구성을 문의 폼 '문의 내용'에 미리 채워 기존 문의 모달 오픈 (`InquiryModal`/`InquiryForm` `initialMessage` prop). `inquiry_open.source` 에 `programs` 추가

## 2026-11-17 (3) — 보조 색 노랑 유지

- (2)에서 남색(`navy`)으로 바꿨던 노랑을 원래 `amber` 로 복구 (초록 → 로고 블루 전환만 유지). `navy` 팔레트 삭제, 포트폴리오 '원데이메이킹' 태그 yellow 복구
- 문서: CLAUDE.md §5, WORKFLOWS 색상 톤

## 2026-11-17 (2) — 사이트 색상 로고 블루로 전환

- `tailwind.config.js`: 로고 색(#1e96d2 / #197fc3) 기반 `brand` 팔레트와 보조 `navy` 팔레트 추가
- 전체 컴포넌트: `emerald-*` → `brand-*`, `amber-*` → `navy-*`, 포트폴리오 테마 태그 lime/yellow/green → sky/indigo/cyan, 배경 `#F8FAF9` → `#F6FAFD`, `theme-color` → #197fc3 (같은 날 1차의 초록·노랑 통일을 대체)
- `useScrollObserver`: 비율 기준(threshold 0.1) → 화면 진입 기준(rootMargin). 길어진 사업안내 섹션이 작은 화면에서 투명하게 남던 문제 수정
- 문서: CLAUDE.md §5, WORKFLOWS 색상 톤

## 2026-11-17 — 사이트 개편 1차 (용어·사업 구조·색상)

- About: 'CI 소개' → '브랜드 스토리(BRAND STORY)'로 명칭 변경
- Programs: 2대 핵심 사업(① 나눔 키트 제작(핸즈온) ② 기업 행사·컨설팅 대행)으로 재구성. `mockData.businessAreas` 추가, 4대 콘텐츠·옵션은 ① 하위로 연계
- 색상: 섹션·포트폴리오의 sky/indigo/rose/teal 을 초록(emerald·green·lime)·노랑(amber·yellow) 계열로 통일 (폼 오류 표시 rose 는 유지)
- 문서: current_specs

## 2026-11-16 (2) — 포트폴리오 '현장스케치' 한정 · 언론보도 링크 수정

- `sync_blog.py`: 포트폴리오는 블로그 카테고리 `현장스케치` 글만 수집(키워드 판별 제거), story 자동 요약(90자 이내)
- `sync_blog.py`: 언론보도 링크 HTML 이스케이프 해제(`&#x3D;` → `=`, 404 원인), id 를 최대값+1 로 부여(전부 999 → React key 중복), 날짜는 기사 보도일 우선. 파일 상단 docstring 에 남아 있던 머지 충돌 표시 제거
- `mockData.ts`: 현장스케치가 아닌 포트폴리오 12건 삭제(칼럼 8·나눔전달후기 2·보도자료 2, 썸네일 item_099~110 삭제) → 98건. story 98건을 1~2문장 요약으로 교체. 언론보도 자동 수집 6건 정리(링크·날짜·요약 수정, 중복 2건 삭제)
- 포트폴리오 상세 '진행 일자' → '게시일'
- 문서: DATA_GUIDE §3, WORKFLOWS 문제해결, current_specs

## 2026-11-16 — 테스트 사이트(open-the-share-dev) 배포 경로 추가

- 운영 반영 전 확인용: `rlaqks2/open-the-share-dev` 저장소 → https://rlaqks2.github.io/open-the-share-dev/
- `vite.config.ts`: `VITE_BASE_PATH` 로 base 지정, `VITE_DEPLOY_ENV=dev` 이면 `noindex` 메타 + 제목 `[DEV]`
- `deploy.yml`: 저장소 이름으로 운영/테스트 분기 (테스트는 하위 경로·CNAME 제거·측정 변수 미주입), `main` push 도 트리거
- `sync-blog.yml`: 운영 저장소에서만 실행
- `npm run ship:dev`: 빌드 검사 후 현재 HEAD 를 dev 저장소 `main` 으로 강제 push
- 문서: DEPLOYMENT §1-1

## 2026-11-10 (2) — 문의 퍼널·채널 측정 1단계

- 이벤트 추가: `form_start`(문의 폼 첫 입력), `contact_click`(푸터 전화·휴대전화·이메일 — 이번에 `tel:`/`mailto:` 링크로 변경)
- 문의 폼: 선택 항목 "어떻게 알게 되셨나요?" 추가, 제출 시 `lead_id`(L+YYMMDD-4자) 생성 → `generate_lead` props + 메일 제목·본문에 포함
- Edge Function `collect` 허용목록에 새 이벤트 추가 — 2026-11-10 재배포 완료(version 2, Verify JWT OFF 유지, 테스트 이벤트 저장 확인 후 삭제)
- 처리방침·문의폼 고지 갱신 (시행일 2026-11-10), 문서: DATA_COLLECTED 2·6장, ANALYTICS 퍼널·lead 쿼리

## 2026-11-10 — IP 지역·기관 데이터 정확도 한계 명시

- `ip_lookups.org`(회선 소유자, 대부분 통신사)·`region`/`city`(시 단위, 서울 구 단위 불가)를 **참고용**으로 규정 — 수집은 유지
- 문서: `DATA_COLLECTED.md` 3-2·3-3·6장, `ANALYTICS.md` 관심 기업 쿼리 주석

## 2026-11-09 (4) — 측정 레이어 · GA4 · Supabase(Postgres) 1차 데이터 수집

- `src/services/analytics.ts` 신설: `trackPageView` / `trackEvent` 단일 진입점 → GA4 · Supabase · 기존 구글 시트로 분기 (환경변수 없으면 전부 비활성, dev 서버 비활성)
- 이벤트: `page_view`(가상 경로 `/`, `/portfolio?filter=`), `inquiry_open`(source), `generate_lead`, `inquiry_error`, `portfolio_view`, `search` — 개인정보(이름·연락처·문의 내용)는 보내지 않음
- `supabase/` 신설: 마이그레이션(`site_events`, `ip_lookups`, 분석 뷰, RLS 차단, pg_cron 1년 파기), Edge Function `collect`(Origin·이벤트 허용목록·크기 검증, 서버 측 IP 판별, 세션 첫 방문만 ipapi 조회)
- 빌드 변수 추가: `VITE_GA_MEASUREMENT_ID`, `VITE_ANALYTICS_COLLECT_URL` (`deploy.yml`, `sync-blog.yml` 둘 다)
- 개인정보 처리방침: 켜진 도구만 빌드 시점에 고지(GA4 쿠키·거부 방법, Supabase 위탁, 이용 행태 항목)
- 문서: `docs/ANALYTICS.md` 신설, ARCHITECTURE · NO_BACKEND_POLICY 갱신
- Supabase 운영 연결: 프로젝트 `forachixmfkdenzzvfog`(Seoul), 스키마 적용, `collect` 배포(Verify JWT OFF), `VITE_ANALYTICS_COLLECT_URL` 등록
- GA4 운영 연결(`G-HQ1X2K8LNH`, GitHub Variables). 실측 결과 `send_page_view:false` 에도 자동 page_view 가 나가 첫 화면이 2건 집계 → 첫 화면은 gtag 자동 전송에 맡기고 코드는 SPA 전환만 전송하도록 수정

## 2026-11-09 (3) — 방문자 로그 화면 제거 · 관리자 시트 방식으로 전환

- 사이트의 방문자 로그 모달·푸터 버튼·Ctrl+Shift+L 단축키 제거 (`VisitorLogModal.tsx` 는 빈 파일 → 삭제 가능)
- 웹훅 URL 은 빌드 환경변수(`VITE_GOOGLE_SHEET_WEBHOOK_URL`)로만 주입 — 브라우저 localStorage 로 덮어쓰기·로컬 로그 저장 제거
- 전송 형식 `text/plain` + `site` 식별값 추가, `keepalive`
- 관리자 가이드 `docs/VISITOR_LOG.md` 신설: Apps Script(식별값 검증, 동시성 잠금, 1년 경과 자동 삭제), 웹앱 배포, 분석 방법
- EmailJS: 받는 주소를 코드에서 제거하고 템플릿 To Email 에 고정, 답장 주소용 `name`/`email` 파라미터 추가

## 2026-11-09 (2) — 개인정보 처리방침 · 푸터 채널

- 개인정보 처리방침 추가: 본문 `src/data/privacyPolicy.ts`, 화면 `modals/PrivacyPolicyModal.tsx`, 푸터 하단 "개인정보처리방침" 링크
- 문의 폼 동의란에 수집 목적·항목·보유기간·거부권 고지 추가 (개인정보 보호법 제15조 제2항)
- 푸터 공식 채널: "네이버 공식 블로그" 문구 정리, YouTube·Instagram·Facebook 을 로고 아이콘 버튼으로 변경

## 2026-11-09 — 하네스 구축 & 전체 점검

### 하네스 (신규)
> `.claude/`, `.github/workflows/`, `.vscode/` 변경분은 원격 도구로 쓸 수 없어 `_pending/` 에 두었습니다. `_pending/README.md` 의 명령으로 적용 후 폴더 삭제.

- `CLAUDE.md`, `AGENTS.md`, `docs/harness/*`(ARCHITECTURE, NO_BACKEND_POLICY, DATA_GUIDE, WORKFLOWS, VERIFICATION, DEPLOYMENT, ROADMAP, CHANGELOG)
- `.claude/commands/` 슬래시 커맨드: `/add-portfolio`, `/new-section`, `/verify`, `/release`
- `README.md`, `docs/current_specs.md`, `docs/PLANNER_GUIDE.md` 를 현재 구조에 맞게 갱신 (옛 github.io 주소·base 경로 제거)

### 버그 수정
- **모달 바깥 클릭으로 닫히지 않던 문제** (`ui/Modal.tsx`: 오버레이 위 컨테이너가 클릭을 가로챔)
- **모바일에서 문의 폼이 화면보다 길면 하단 "신청" 버튼에 도달 불가** → 모달 내부 스크롤 적용
- 검색 모달 ESC 닫기·배경 스크롤 잠금 없음 → 추가
- 존재하지 않는 Tailwind 클래스 수정: `animate-fadeIn`, `backdrop-blur-xs`, `group-hover:scale-102`
- 섹션 이동 시 sticky 헤더가 제목을 가리던 문제 → `scroll-margin-top`
- `sync_blog.py`: 새 id 계산 시 다른 배열(pressReleases 등)의 id 까지 집계하던 문제, RSS 파싱 오류 미처리

### 성능
- `index.html` 의 base64 인라인 파비콘(~25KB, 매 요청마다 전송) 제거 → `public/` 파일 참조 (27.5KB → 2.2KB)
- `App.tsx` 의 런타임 파비콘 강제 주입 코드 제거 (중복)
- Noto Sans KR 구글 폰트 중복 로딩 제거 (Pretendard 단일)
- 포트폴리오 썸네일 9장(item_099~106, 108: 실제로는 PNG) JPEG 재압축 **6.3MB → 0.76MB**
- `sync_blog.py`: 새 썸네일 자동 리사이즈/압축(Pillow, 가로 1200px, q82) — 워크플로에서 pillow 를 설치만 하고 쓰지 않던 상태였음
- Header 스크롤 리스너 `passive`

### 배포
- **이중 배포 제거**: 로컬 `gh-pages` 업로드 + Actions 배포가 동시에 일어나던 구조 → `master` push → Actions 단일 경로
- `deploy.bat` / `npm run ship`: pull(--autostash) → 빌드 검사 → push 로 변경, 실패 시 중단
- `deploy.yml`: PR 빌드 검사 추가, `cname: openthe.kr` 명시, 웹훅 URL 을 Actions Variables 에서 주입
- `sync-blog.yml`: push 전 `git pull --rebase` (사람 커밋과 경합 시 실패 방지)
- `package.json` `homepage` 를 openthe.kr 로 수정, `typecheck` / `sync:blog` 스크립트 추가, `deploy` 는 `ship` 의 별칭(기존 VS Code 태스크 호환)

### 보안·개인정보
- EmailJS 설정을 `src/config/site.ts` 로 분리 (env 덮어쓰기 가능), 회사 연락처 하드코딩 제거
- 문의 폼: 이메일/연락처 형식 검증, 입력 길이 제한, 허니팟 스팸 방지
- 방문자 로그: **웹훅 미설정 시 외부 IP 조회 API 호출 안 함**, 개발 서버에서는 수집 안 함, `sessionStorage` 예외 처리
- 푸터 "방문자 로그" 버튼은 관리자 모드(Ctrl+Shift+L 로 한 번 연 브라우저)에서만 표시
- `.gitignore` 에 `.env*`, `__pycache__` 추가, `.env.example` 신설

### 접근성·UX
- 포트폴리오 카드(메인·아카이브·히어로)를 키보드(Tab/Enter)로 열 수 있게 `clickableProps` 적용
- 히어로 "최근 스토리" 클릭 시 해당 글 상세 모달이 바로 열림 (기존: 목록 페이지로 이동)
- `prefers-reduced-motion` 대응, `<noscript>` 안내, OG/canonical/theme-color 메타 추가

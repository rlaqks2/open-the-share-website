# CHANGELOG — 구조·하네스 변경 이력

콘텐츠(포트폴리오 추가 등) 변경은 기록하지 않습니다. 구조·규칙·배포·외부연동이 바뀔 때만 기록합니다.

## 2026-11-09 (4) — 측정 레이어 · GA4 · Supabase(Postgres) 1차 데이터 수집

- `src/services/analytics.ts` 신설: `trackPageView` / `trackEvent` 단일 진입점 → GA4 · Supabase · 기존 구글 시트로 분기 (환경변수 없으면 전부 비활성, dev 서버 비활성)
- 이벤트: `page_view`(가상 경로 `/`, `/portfolio?filter=`), `inquiry_open`(source), `generate_lead`, `inquiry_error`, `portfolio_view`, `search` — 개인정보(이름·연락처·문의 내용)는 보내지 않음
- `supabase/` 신설: 마이그레이션(`site_events`, `ip_lookups`, 분석 뷰, RLS 차단, pg_cron 1년 파기), Edge Function `collect`(Origin·이벤트 허용목록·크기 검증, 서버 측 IP 판별, 세션 첫 방문만 ipapi 조회)
- 빌드 변수 추가: `VITE_GA_MEASUREMENT_ID`, `VITE_ANALYTICS_COLLECT_URL` (`deploy.yml`, `sync-blog.yml` 둘 다)
- 개인정보 처리방침: 켜진 도구만 빌드 시점에 고지(GA4 쿠키·거부 방법, Supabase 위탁, 이용 행태 항목)
- 문서: `docs/ANALYTICS.md` 신설, ARCHITECTURE · NO_BACKEND_POLICY 갱신

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

# CLAUDE.md — 오픈더쉐어(openthe.kr) 웹사이트 작업 하네스

> AI 코딩 에이전트(Claude Code, Cursor, Codex 등)와 사람이 이 저장소에서 작업할 때 **가장 먼저 읽는 문서**입니다.
> 세부 규칙은 `docs/harness/` 아래 문서로 연결됩니다. 이 파일은 짧게 유지하고, 상세 내용은 하위 문서에 씁니다.

---

## 1. 프로젝트 한 줄 요약

**(주)오픈더쉐어** — 기업·단체 단위 사회공헌(봉사) 프로그램을 기획·운영하는 회사의 공식 사이트.
주 목적은 **① 기업 소개** **② 기업·단체 봉사 히스토리(포트폴리오) 공유** **③ 파트너십 문의 수집**.

- 운영 주소: https://openthe.kr (GitHub Pages + 커스텀 도메인, `public/CNAME`)
- 저장소: `rlaqks2/open-the-share-website`, 기본 브랜치 `master`
- 스택: **React 18 + TypeScript + Vite 5 + Tailwind CSS 3** (정적 SPA)
- **자체 백엔드 없음.** 서버·로그인 없음. DB 는 측정 데이터 전용 Supabase(SaaS) 뿐이며 브라우저는 Edge Function 을 통해서만 쓴다. → 반드시 [NO_BACKEND_POLICY](docs/harness/NO_BACKEND_POLICY.md) 준수

## 2. 절대 규칙 (Must / Must Not)

| # | 규칙 |
|---|------|
| R1 | **비밀값을 코드·`VITE_*` 환경변수에 넣지 않는다.** 빌드 결과물은 전부 공개된다. (EmailJS Public Key 처럼 "공개용" 키만 허용) |
| R2 | `src/data/mockData.ts` 의 마커 `  portfolioItems: [` 와 `  ] as PortfolioItem[],` 를 **수정·이동·들여쓰기 변경 금지** — 블로그 자동 동기화(`scripts/sync_blog.py`)가 이 문자열로 위치를 찾는다. |
| R3 | `index.html` 의 `<meta name="referrer" content="no-referrer">` **삭제 금지** — 네이버 블로그 이미지(pstatic.net) 핫링크 차단 회피용. |
| R4 | 배포는 **`master` push → GitHub Actions** 한 경로만 쓴다. `gh-pages` 브랜치를 손으로 수정하지 않는다. |
| R5 | `npm run build` (= `tsc && vite build`) 가 통과하지 않는 변경은 커밋하지 않는다. `noUnusedLocals` 가 켜져 있어 **안 쓰는 import 하나로도 배포가 실패**한다. |
| R6 | 새 이미지는 `public/images/...` 에 넣고 **가로 1200px 이하 / 300KB 이하**로 최적화한다. |
| R7 | 사용자에게 보이는 문구는 **한국어**, `break-keep` 유지. 회사 정보(전화·메일·주소)는 하드코딩하지 말고 `mockData.companyInfo` 를 참조한다. |
| R8 | 방문자 IP 등 개인정보 수집 기능을 늘리지 않는다. 수집 항목·외부 서비스·보유기간이 바뀌면 **`src/data/privacyPolicy.ts`(처리방침·문의폼 고지)를 같은 커밋에서 갱신**한다. |

## 3. 자주 쓰는 명령

```bash
npm install            # 최초 1회
npm run dev            # 로컬 미리보기 http://localhost:5173/
npm run build          # 타입체크 + 프로덕션 빌드 (커밋 전 필수)
npm run preview        # 빌드 결과 미리보기
npm run typecheck      # 타입체크만
npm run sync:blog      # 네이버 블로그 새 글 → 포트폴리오 반영 (Python 3, pip install pillow 권장)
npm run ship           # pull → build → commit → push (= 배포)
deploy.bat             # Windows 더블클릭 배포 (위와 동일)
```

## 4. 폴더 지도

```
src/
├── App.tsx                 # 화면 상태('home' | 'portfolio') + 모달 상태 관리 (라우터 없음)
├── config/site.ts          # 외부 서비스 설정 (EmailJS 등, 공개값만)
├── data/mockData.ts        # ★ 사이트 모든 콘텐츠 (문구·포트폴리오·파트너·FAQ·회사정보)
├── types.ts                # PortfolioItem / PartnerItem / PressReleaseItem 타입
├── components/
│   ├── layout/             # Header, Footer
│   ├── sections/           # 메인 페이지 섹션 (Hero → About → Impact → Programs → Process → Portfolio → Testimonials → Partners → FAQ → CTA)
│   ├── pages/              # PortfolioPage (전체 아카이브 + 필터 + 페이지네이션)
│   ├── modals/             # Search, Inquiry, PortfolioDetail, PrivacyPolicy
│   ├── forms/InquiryForm   # 파트너십 문의 → EmailJS
│   └── ui/Modal            # 공통 모달 (ESC/바깥클릭 닫기, 스크롤 잠금)
├── hooks/useScrollObserver # <section> 페이드인
├── services/analytics.ts   # ★ 측정 단일 진입점 (trackPageView/trackEvent → GA4·Supabase·구글 시트)
└── utils/                  # visitorTracker(방문자 로그 → 관리자 구글 시트, 사이트 UI 없음), a11y(clickableProps)
supabase/                   # 측정 DB 마이그레이션(SQL) + Edge Function collect (docs/ANALYTICS.md)
public/                     # 그대로 배포되는 정적 파일 (CNAME, 파비콘, images/)
scripts/sync_blog.py        # 블로그 RSS → mockData.ts 자동 반영 (GitHub Actions 매시간)
.github/workflows/          # deploy.yml(배포), sync-blog.yml(블로그 동기화+배포)
docs/harness/               # ★ 하네스 문서 (아래)
.claude/commands/           # 에이전트 슬래시 커맨드 (/add-portfolio, /verify, /release, /new-section)
```

## 5. 작업 절차 (에이전트 기본 루프)

1. **이해** — 요청이 어떤 유형인지 [WORKFLOWS](docs/harness/WORKFLOWS.md) 에서 찾는다. (콘텐츠 수정 / 포트폴리오 추가 / 섹션 추가 / 페이지 추가 / 외부연동 추가)
2. **확인** — 백엔드가 필요한 요청이면 [NO_BACKEND_POLICY](docs/harness/NO_BACKEND_POLICY.md) 의 대안 패턴을 먼저 제시한다.
3. **변경** — 가능한 한 `mockData.ts`(데이터)만 바꾸고, 컴포넌트 변경은 최소화한다. 기존 Tailwind 스타일 톤(emerald/slate, `rounded-3xl`, `font-black` 제목)을 따른다.
4. **검증** — [VERIFICATION](docs/harness/VERIFICATION.md) 체크리스트 실행. 최소한 `npm run build` 통과 + 모바일 폭(375px) 확인.
5. **기록** — 구조·규칙이 바뀌면 해당 하네스 문서와 [CHANGELOG](docs/harness/CHANGELOG.md) 를 같이 수정한다.
6. **배포** — [DEPLOYMENT](docs/harness/DEPLOYMENT.md). 사람의 확인 없이 `master` 에 push 하지 않는다.

## 6. 하네스 문서 목록

| 문서 | 언제 읽나 |
|------|-----------|
| [docs/harness/ARCHITECTURE.md](docs/harness/ARCHITECTURE.md) | 구조·데이터 흐름·외부 서비스 파악 |
| [docs/harness/NO_BACKEND_POLICY.md](docs/harness/NO_BACKEND_POLICY.md) | 폼·통계·관리자·DB 성격의 기능 요청을 받았을 때 |
| [docs/harness/DATA_GUIDE.md](docs/harness/DATA_GUIDE.md) | `mockData.ts` 수정, 포트폴리오/파트너 추가 |
| [docs/harness/WORKFLOWS.md](docs/harness/WORKFLOWS.md) | 유형별 작업 플레이북 |
| [docs/harness/VERIFICATION.md](docs/harness/VERIFICATION.md) | 완료 전 검증 (Definition of Done) |
| [docs/harness/DEPLOYMENT.md](docs/harness/DEPLOYMENT.md) | 배포·도메인·롤백 |
| [docs/harness/ROADMAP.md](docs/harness/ROADMAP.md) | 확장 계획과 남은 기술부채 |
| [docs/harness/CHANGELOG.md](docs/harness/CHANGELOG.md) | 구조적 변경 이력 |
| [docs/PLANNER_GUIDE.md](docs/PLANNER_GUIDE.md) | 비개발자(기획·운영) 작업 가이드 |
| [docs/ANALYTICS.md](docs/ANALYTICS.md) | 측정(GA4·Supabase Postgres) 설정·이벤트 목록·SQL 분석 |
| [docs/DATA_COLLECTED.md](docs/DATA_COLLECTED.md) | 수집 데이터 전체 명세 (테이블·컬럼·GA4 항목·브라우저 저장값) — 수집 항목 변경 시 함께 수정 |
| [docs/VISITOR_LOG.md](docs/VISITOR_LOG.md) | 방문자 로그(구글 시트, 병행 후 종료 예정) 설정·분석·관리 |
| [docs/current_specs.md](docs/current_specs.md) | 현재 화면·기능 명세 |

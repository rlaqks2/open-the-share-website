---
description: 포트폴리오(봉사 히스토리) 항목을 추가하거나 자동 수집 항목을 검수합니다
argument-hint: [네이버 블로그 URL 또는 활동 설명]
---

포트폴리오 항목을 추가/검수합니다. 입력: $ARGUMENTS

1. `docs/harness/DATA_GUIDE.md` 의 2장(마커)·3장(PortfolioItem 형식)·5장(이미지 규격)을 먼저 읽는다.
2. 입력이 네이버 블로그 URL 이면 글 번호(logNo)를 추출하고 `src/data/mockData.ts` 에 같은 `logNo` 가 이미 있는지 검색한다.
   - 이미 있으면: 해당 항목의 `orgType`, `category`, `partner`, `participants`, `story` 가 원문과 맞는지 검수하고 수정안을 제시한다.
   - 없으면: 자동 수집(`npm run sync:blog` 또는 Actions 수동 실행)을 먼저 안내하고, 사용자가 원하면 수동으로 추가한다.
3. 수동 추가 시:
   - `id` = 포트폴리오 블록 내 최대 id + 1
   - `category` 는 5개 허용값 중 하나, `period` 는 `YYYY.MM.DD`, `year` 일치
   - 썸네일은 `public/images/portfolio/item_NNN.jpg` (가로 ≤1200px, ≤300KB). 이미지가 없으면 사용자에게 요청한다 — 외부 URL 을 `imageUrl` 에 넣지 않는다.
   - 마커 `  portfolioItems: [` 와 `  ] as PortfolioItem[],` 사이, 공백 4칸 블록 형식 유지
4. `docs/harness/VERIFICATION.md` 의 L0 + L1(포트폴리오 관련 항목)을 수행하고 결과를 보고 형식대로 보고한다.
5. push 는 사용자의 명시적 요청이 있을 때만 `/release` 절차로 진행한다.

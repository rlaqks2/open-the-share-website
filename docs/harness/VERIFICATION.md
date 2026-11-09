# VERIFICATION — 완료 기준 (Definition of Done)

테스트 코드가 아직 없으므로, 아래 체크리스트가 품질 게이트입니다. 변경 범위에 해당하는 항목만 실행하되 **L0 는 항상** 실행합니다.

## L0. 필수 (모든 변경)

- [ ] `npm run build` 성공 (tsc 오류 0, vite 빌드 성공)
  - 흔한 실패: 안 쓰는 import/변수(`noUnusedLocals`), 따옴표·쉼표 누락, 타입 불일치
- [ ] 커밋에 비밀값·개인정보·`.env` 파일이 없음 (`git diff --staged` 확인)
- [ ] `mockData.ts` 마커 2개(`  portfolioItems: [`, `  ] as PortfolioItem[],`) 그대로 존재

## L1. 화면 확인 (UI·데이터 변경 시)

`npm run dev` 또는 `npm run preview` 에서:

- [ ] 데스크톱(1280px) / 모바일(375px) 둘 다 레이아웃 깨짐·가로 스크롤 없음
- [ ] 헤더 메뉴 각 항목 클릭 → 해당 섹션으로 이동, 제목이 헤더에 가려지지 않음
- [ ] 포트폴리오: 메인 6개 카드 → 상세 모달 → 갤러리 좌우 → 블로그 원문 링크
- [ ] 포트폴리오 페이지: 탭/테마/연도 필터, 검색, 페이지 이동
- [ ] 문의 모달: 모바일에서 끝까지 스크롤되어 "상담 신청" 버튼이 보임, 빈 값/잘못된 이메일 오류 표시
- [ ] 검색 모달: 입력 → 결과 클릭 → 상세, ESC 로 닫힘
- [ ] 브라우저 콘솔에 빨간 에러 없음

## L2. 접근성·품질 (컴포넌트 추가/수정 시)

- [ ] 클릭 가능한 요소는 `<button>`/`<a>` 이거나 `clickableProps()` 적용 (Tab → Enter 로 동작)
- [ ] 이미지에 의미 있는 `alt`, 장식용은 `alt=""`
- [ ] 아이콘 전용 버튼에 `aria-label`
- [ ] 첫 화면 아래 이미지는 `loading="lazy"`
- [ ] 텍스트 대비: 연한 회색(`slate-400`) 을 본문에 쓰지 않기

## L3. 성능·SEO (배포 전 큰 변경 시)

- [ ] 새 이미지 ≤300KB, 가로 ≤1200px
- [ ] `dist/assets/index-*.js` 크기가 크게 늘지 않음 (현재 기준 약 600KB, gzip ~150KB)
- [ ] Chrome DevTools Lighthouse (모바일) — Performance/Accessibility/SEO 각 80+ 목표
- [ ] `index.html` 의 title / description / og:* 가 내용과 맞음

## L4. 자동화 스크립트 변경 시 (`scripts/`, `.github/workflows/`)

- [ ] `python -m py_compile scripts/sync_blog.py`
- [ ] 로컬에서 `python scripts/sync_blog.py` 1회 실행 → "No new posts" 또는 정상 추가, `git diff src/data/mockData.ts` 로 형식 확인
- [ ] 워크플로 YAML 수정 후 Actions 탭에서 `workflow_dispatch` 로 수동 실행해 성공 확인

## 에이전트용 보고 형식

작업 완료 시 다음을 짧게 보고합니다.

```
변경: (파일 목록과 한 줄 요약)
검증: L0 ✅ / L1 ✅(모바일·데스크톱) / L2 해당없음 ...
미확인: (실행하지 못한 검증과 이유)
```

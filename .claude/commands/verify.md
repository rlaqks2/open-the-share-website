---
description: 현재 변경사항을 하네스 체크리스트(L0~L4)로 검증하고 보고합니다
---

현재 작업 트리의 변경사항을 검증합니다.

1. `git status` 와 `git diff --stat` 으로 변경 범위를 파악하고, `docs/harness/VERIFICATION.md` 에서 해당 레벨을 고른다.
   - 모든 변경: L0
   - `src/components`, `mockData.ts`, `index.css`: + L1 (가능하면 L2)
   - 이미지/`index.html`/의존성: + L3
   - `scripts/`, `.github/workflows/`: + L4
2. L0 실행
   - `npm run build`
   - `git diff` 에서 비밀값 패턴(`key`, `token`, `secret`, `password`, `@gmail`, 전화번호 신규 하드코딩) 검색
   - `grep -n "  portfolioItems: \[" src/data/mockData.ts` 와 `grep -n "  ] as PortfolioItem\[\]," src/data/mockData.ts` 가 각각 1건인지 확인
3. 브라우저 확인이 가능하면 `npm run preview` 후 L1 항목을 375px·1280px 에서 확인한다. 불가능하면 "미확인" 으로 명시한다.
4. VERIFICATION.md 의 "에이전트용 보고 형식" 으로 결과를 보고한다. 실패 항목은 원인과 수정안을 함께 제시한다.

---
description: 메인 페이지에 새 섹션을 추가합니다 (데이터 → 컴포넌트 → App 배치 → 메뉴)
argument-hint: [섹션 이름과 목적]
---

메인 페이지에 새 섹션을 추가합니다: $ARGUMENTS

1. `docs/harness/WORKFLOWS.md` 의 W4 와 W7(스타일 규칙)을 읽는다.
2. 요청이 서버·DB·로그인을 필요로 하는지 `docs/harness/NO_BACKEND_POLICY.md` 로 판단한다. 필요하면 구현 전에 대안 패턴을 제시하고 확인받는다.
3. 구현 순서
   - `src/data/mockData.ts` 에 새 최상위 키로 데이터 추가 (필요시 `src/types.ts` 에 인터페이스)
   - `src/components/sections/<Name>Section.tsx` 생성 — 기존 섹션 골격(eyebrow 배지 + `font-black` 제목 + `break-keep`)을 따른다
   - `src/App.tsx` 의 `<main>` 에 배치, `id` 부여
   - 헤더 메뉴 노출이 필요하면 `Header.tsx` 의 `navLinks` 에 추가
   - 클릭 가능한 카드는 `clickableProps()` 사용
4. `docs/harness/VERIFICATION.md` L0·L1·L2 수행 후 보고.
5. 섹션 구성이 바뀌었으므로 `docs/current_specs.md` 의 페이지 구성 표도 갱신한다.

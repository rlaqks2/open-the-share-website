# WORKFLOWS — 작업 유형별 플레이북

요청을 받으면 아래에서 가장 가까운 유형을 찾아 순서대로 진행합니다. 각 플레이북의 마지막 단계는 항상 [VERIFICATION](VERIFICATION.md) 입니다.

---

## W1. 문구·숫자·FAQ 수정 (난이도 ★)

1. `src/data/mockData.ts` 에서 해당 키를 찾는다. ([DATA_GUIDE](DATA_GUIDE.md) 1장 표)
2. 문자열만 수정. 따옴표·쉼표·백틱 유지.
3. 회사 연락처는 `companyInfo` 만 수정 (다른 곳에 중복 하드코딩 금지).
4. `npm run build` → 화면 확인.

## W2. 포트폴리오 추가·수정 (난이도 ★) — `/add-portfolio`

- **네이버 블로그에 올린 글**이면 기다리면 됩니다 (매시간 자동). 즉시 반영: GitHub → Actions → "1-Hour Auto Sync Blog Posts & Deploy" → Run workflow. 로컬: `npm run sync:blog`
- **수동 추가**
  1. 썸네일을 규격([DATA_GUIDE](DATA_GUIDE.md) 5장)에 맞춰 `public/images/portfolio/item_NNN.jpg` 로 저장
  2. `portfolioItems` 배열 안(마커 사이)에 3장 형식으로 항목 추가. `id` = 현재 최대값+1
  3. `category` 는 5개 허용값 중 하나, `period` 는 `YYYY.MM.DD`
- **자동 수집된 항목 검수**: `participants: 30`, `partner: "OPEN THE SHARE"`, `orgType` 오분류가 흔함 → 블로그 원문 보고 교정

## W3. 참여기관 로고 추가 (난이도 ★)

1. 투명 PNG 로고 → `public/images/partners/partner_NN.png` (다음 번호)
2. `partners` 배열에 추가, `group` 4개 값 중 하나
3. 개수는 Impact/Footer 에 자동 반영됨

## W4. 메인 페이지에 새 섹션 추가 (난이도 ★★) — `/new-section`

1. 데이터: `mockData.ts` 에 새 최상위 키 추가 (타입이 복잡하면 `types.ts` 에 인터페이스 추가)
2. 컴포넌트: `src/components/sections/XxxSection.tsx` 생성. 기존 섹션 골격을 따른다:
   ```tsx
   <section id="xxx" className="py-24 bg-white">
     <div className="max-w-7xl mx-auto px-4">
       <div className="text-center max-w-2xl mx-auto mb-14">
         <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold mb-3">EYEBROW</span>
         <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 break-keep">제목</h2>
         <p className="text-slate-600 text-base break-keep">설명</p>
       </div>
       ...
     </div>
   </section>
   ```
3. `App.tsx` 의 `<main>` 안 원하는 위치에 삽입
4. 헤더 메뉴에 노출하려면 `Header.tsx` 의 `navLinks` 에 `{ name, sectionId: 'xxx', type: 'section' }` 추가 (Footer 바로가기도 필요 시 추가)
5. 클릭 가능한 카드가 `<div>/<article>` 이면 `clickableProps()` (`utils/a11y.ts`) 사용

## W5. 새 "페이지" 추가 (난이도 ★★★)

현재 라우터가 없습니다. 페이지가 2개 이상 늘어날 예정이면 **먼저 라우팅 도입**(ROADMAP P1)을 제안합니다.
임시로 추가해야 한다면:
1. `App.tsx` 의 `currentView` 유니온에 새 값 추가 (`'home' | 'portfolio' | 'about-detail'`)
2. `src/components/pages/XxxPage.tsx` 생성, 렌더 분기 추가
3. `Header.tsx` 의 `isLinkActive` / `navLinks` 에 `type: 'page'` 처리 추가
4. `trackVisitor` 페이지명 분기 추가

## W6. 외부 서비스 연동 추가 (난이도 ★★)

1. [NO_BACKEND_POLICY](NO_BACKEND_POLICY.md) 2·3장으로 허용 여부와 키 공개 가능 여부 확인
2. 설정값은 `src/config/site.ts` 에 추가, 환경별로 바꿔야 하면 `VITE_*` + `src/vite-env.d.ts` 타입 + `.env.example` + GitHub Actions `env:` 에 모두 추가
3. 호출 코드는 컴포넌트 안이 아니라 `src/utils/` (향후 `src/services/`) 에 둔다
4. 타임아웃(AbortController) + `try/catch` + 실패 시 대체 UI 필수
5. 개인정보를 보내면 처리방침 갱신 제안

## W7. 디자인/스타일 수정 (난이도 ★~★★)

- 색상 톤: 주색 `emerald-600`, 보조 `amber`, 텍스트 `slate-900/600`, 배경 `#F8FAF9`
- 모서리: 카드 `rounded-3xl`, 버튼 `rounded-full`
- 한글 줄바꿈: 제목·본문에 `break-keep`
- Tailwind **v3** 문법만 사용 (`backdrop-blur-xs`, `scale-102` 같은 v4/없는 클래스 주의 → 임의값 `scale-[1.02]` 사용)
- 애니메이션 추가 시 `prefers-reduced-motion` 고려 (`index.css` 하단)

## W8. 배포 (난이도 ★) — `/release`

[DEPLOYMENT](DEPLOYMENT.md) 참고. 요약: `deploy.bat` 또는 `npm run ship` → Actions 성공 확인 → https://openthe.kr 강력 새로고침.

## W9. 장애 대응

| 증상 | 확인할 곳 |
|------|-----------|
| 사이트가 옛날 화면 | Actions 탭에서 deploy 실패 여부 → 실패 로그의 `tsc` 오류부터 확인 |
| 도메인 접속 불가 / github.io 로 리다이렉트 | `public/CNAME` 존재 여부, 저장소 Settings → Pages → Custom domain |
| 포트폴리오 갤러리 사진 깨짐 | `index.html` referrer 메타 삭제 여부, 네이버 이미지 URL 만료 |
| 문의 메일이 안 옴 | EmailJS 대시보드 사용량 한도/템플릿, Allowed origins |
| 블로그 새 글이 안 올라옴 | Actions "Auto Sync" 로그 → `Skipping non-portfolio post` 면 키워드 미포함 |

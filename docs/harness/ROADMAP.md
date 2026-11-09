# ROADMAP — 확장 계획 & 기술부채

우선순위: **P0** 법적/운영 리스크 · **P1** 확장 전에 해야 할 구조 개선 · **P2** 품질 향상 · **P3** 장기

## P0 — 바로 처리 권장

| 항목 | 이유 | 작업 |
|------|------|------|
| ~~개인정보 처리방침 페이지~~ ✅ 2026-11-09 | 푸터 링크 + 모달, 문의 폼 고지 추가 완료 | **남은 일**: 보유기간(1년)·보호책임자(대표) 등 회사 정책 확인, 가능하면 법률 검토 |
| EmailJS 도메인 허용목록 (선택) | 공개 키 악용(스팸 발송) 방지. **유료 기능**(Personal $9/월~, 무료 플랜 미포함, 2026-11 기준) | 무료 플랜 유지 시 허니팟·형식 검증(적용됨)으로 대응하고 월 사용량(무료 200건) 모니터링. 스팸이 실제로 들어오면 유료 전환 검토 |
| `.vscode/mcp.json` 토큰 관리 | 실수로 PAT 를 넣고 커밋할 위험 | 빈 값 유지, 필요하면 환경변수 참조 방식으로 |

## P1 — 사이트 확장 전 구조 개선

1. **라우팅 도입** (react-router 또는 해시 라우팅)
   - `/`, `/portfolio`, `/portfolio/:id`, `/about` … → 공유 가능한 URL, 뒤로가기, 검색 노출
   - GitHub Pages SPA 대응: `public/404.html` 리다이렉트 트릭 또는 `HashRouter`
   - 포트폴리오 상세 URL 이 생기면 카카오톡 공유 미리보기도 개선 가능 (빌드 시 정적 페이지 생성 필요 → P2 SSG)
2. **포트폴리오 데이터 분리**
   - `portfolioItems` 를 `public/data/portfolio.json` 으로 옮기고 런타임 `fetch` → 초기 JS 번들 ~390KB 감소
   - `sync_blog.py` 는 TS 문자열 조작 대신 JSON 읽기/쓰기로 단순화 (마커 의존 제거)
3. **코드 스플리팅**: `PortfolioPage`, `PortfolioDetailModal`, `PrivacyPolicyModal` 을 `React.lazy` 로 분리
4. **서비스 레이어**: `src/services/{inquiry,analytics,portfolio}.ts` — 외부 호출을 한 곳에 모아 백엔드 교체 대비
5. **`mockData.ts` → `content/` 로 분할**: `company.ts`, `programs.ts`, `partners.ts`, `faqs.ts` … (가독성·충돌 감소)

## P2 — 품질

- 테스트: Vitest + Testing Library 로 필터/검색/폼 검증 단위 테스트, Playwright 스모크 테스트(메뉴 이동·모달 열기) → deploy.yml 에 추가
- ESLint + Prettier 설정 & CI 체크
- 이미지 `srcset`/WebP 생성 (sync 스크립트에서 Pillow 로 함께 생성)
- `sitemap.xml`, `robots.txt` (라우팅 도입 후)
- 구조화 데이터(JSON-LD `Organization`)
- 자동 수집 포트폴리오의 `orgType/category/partner` 추론 정확도 개선 또는 "검수 필요" 플래그
- 미사용 컴포넌트 정리 (Login/Signup/FindAccount 모달 — 회원 기능 없음, 명세상 삭제됨)

## P3 — 장기 (백엔드 승격 시)

[NO_BACKEND_POLICY](NO_BACKEND_POLICY.md) 5장 기준 충족 시:
- Headless CMS 로 비개발자 콘텐츠 등록 (Decap CMS 는 GitHub 기반이라 현재 구조와 궁합이 좋음)
- 참여기관 전용 "소셜 임팩트 리포트" 열람 (Supabase Auth)
- 문의 접수 관리(상태 추적) → Supabase / Airtable
- 다국어(영문) 페이지

## 확장 시 체크 (새 기능 기획 단계에서)

- 이 기능은 서버가 필요한가? → 필요하면 외부 SaaS 로 대체 가능한가?
- 데이터는 누가, 얼마나 자주 갱신하나? → 사람(코드 수정) / 블로그(자동) / 외부 서비스
- 개인정보를 받는가? → 처리방침 갱신
- URL 로 공유되어야 하나? → 라우팅 선행(P1-1)

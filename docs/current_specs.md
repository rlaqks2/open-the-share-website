# 웹사이트 기능 명세 (Current Specification)

> 최종 갱신: 2026-11-09 · 실제 소스 기준으로 작성. 화면/기능이 바뀌면 이 문서를 함께 갱신합니다.

---

## 1. 사이트 구조

정적 **SPA** (라우터 없음). 화면은 2개이며 `App.tsx` 상태로 전환합니다.

| 화면 | 진입 | 설명 |
|------|------|------|
| **메인(home)** | 로고 클릭, 섹션 메뉴 | 회사 소개~문의까지 섹션을 세로로 나열 |
| **포트폴리오 아카이브(portfolio)** | 헤더 "포트폴리오", 각종 "전체보기" 버튼 | 전체 봉사 히스토리 필터·검색·페이지네이션 |

### 헤더 메뉴

| 메뉴 | 동작 |
|------|------|
| 회사소개 | `#about` 스크롤 |
| 사업안내 | `#programs` |
| 진행절차 | `#process` |
| 포트폴리오 (건수 배지) | 포트폴리오 아카이브 화면 |
| 언론보도 | `#testimonials` |
| 참여기관 | `#partners` |
| FAQ | `#faq` |
| 🔍 아이콘 | 검색 모달 |
| (버튼) 파트너십 문의 | 문의 모달 |

---

## 2. 메인 화면 섹션 (위→아래)

| # | 섹션 (컴포넌트) | 내용 | 데이터 키 |
|---|----------------|------|-----------|
| 1 | Hero | 슬로건, 키워드, 문의/포트폴리오 버튼, 온앤온·온팅 카드, **최근 스토리 3건**(클릭 시 상세 모달) | `hero`, `portfolioItems` |
| 2 | About `#about` | 회사 철학, 인용문, 미션/비전, O.P.E.N 핵심가치, 페르소나 고민, CI 설명 | `about` |
| 3 | Impact `#impact` | 성과 숫자 4개 (참여기관 수·프로젝트 수는 데이터에서 자동 계산) | `impactStats` |
| 4 | Programs `#programs` | 대표 브랜드 온앤온(대면)/온팅(비대면), 4대 콘텐츠, 옵션(BASIC/A/B/C) | `flagshipBrands`, `programs`, `programOptions` |
| 5 | Process `#process` | 4단계 진행 절차 | `processSteps` |
| 6 | Portfolio `#portfolio` | 탭(전체/OTS 최신/기업/단체) + 최신 6건 카드 → 상세 모달, 전체보기 | `portfolioItems` |
| 7 | Testimonials `#testimonials` | 언론보도 카드(외부 링크) + 담당자 후기(이름 마스킹) | `pressReleases`, `testimonials` |
| 8 | Partners `#partners` | 참여기관 로고 그리드, 그룹 탭, 24개 초과 시 더보기 | `partners` |
| 9 | FAQ `#faq` | 아코디언 | `faqs` |
| 10 | CTA | 문의 유도 버튼 | — |
| — | Footer | 바로가기, 상담센터 연락처, 공식 채널(블로그·유튜브·인스타·페이스북), 사업자 정보 | `companyInfo` |

---

## 3. 포트폴리오 아카이브 화면

- 필터: 참여 유형 탭(전체 / OPEN THE SHARE 최신(2025년 이후) / 기업봉사 / 단체봉사), 테마 칩 5종, 연도 선택
- 실시간 검색: 제목·참여기관·테마·스토리
- 페이지네이션: 페이지당 개수 선택, 번호 버튼 5개
- 정렬: 진행일(`period`) 최신순 고정
- 카드 클릭(또는 Tab+Enter) → 상세 모달

## 4. 모달

| 모달 | 진입 | 기능 |
|------|------|------|
| 파트너십 문의 | 헤더/히어로/CTA/아카이브 버튼 | 단체 유형·프로그램 방식·기관명·담당자·연락처·이메일·인원/시기·내용, 개인정보 수집·이용 고지 및 필수 동의. 형식 검증 + 허니팟. **EmailJS 로 메일 발송** → 성공/실패(재시도) 화면 |
| 포트폴리오 상세 | 카드 클릭 | 갤러리(좌우·썸네일 스트립, 실패 시 대표 썸네일), 배지·태그, 참여기관/일자/규모, 스토리, 네이버 블로그 원문 링크 |
| 검색 | 🔍 | 추천 키워드, 결과 최대 6건 → 상세, 아카이브로 이동. ESC/바깥 클릭 닫기 |
| 개인정보 처리방침 | 푸터 하단 "개인정보처리방침" | 처리 목적·항목·보유기간·위탁/국외이전·권리행사·보호책임자 등 12개 조항 (`src/data/privacyPolicy.ts`) |

모든 모달: 바깥 클릭·닫기 버튼으로 닫힘, 모바일에서 내용이 길면 내부 스크롤.

## 5. 방문자 로그

사이트에 화면 없음. 웹훅이 설정된 경우 방문 기록이 관리자 구글 시트로 전송됩니다. → [VISITOR_LOG.md](VISITOR_LOG.md)

## 6. 회원 기능

제공하지 않음. (`LoginModal`/`SignupModal`/`FindAccountModal` 파일은 과거 시안이며 화면에서 사용되지 않음)

## 7. 데이터 모델

`src/types.ts` 참고. 필드별 작성 규칙은 [harness/DATA_GUIDE.md](harness/DATA_GUIDE.md).

```ts
interface PortfolioItem {
  id: number; logNo?: number; title: string;
  category: '원데이메이킹' | '찾아가는 과학교실' | '스페이스 업사이클링' | '친환경 ESG' | '지역사회 나눔' | string;
  orgType: '기업봉사' | '단체봉사';
  imageUrl: string; galleryUrls?: string[];
  partner: string; period: string /* YYYY.MM.DD */; year?: string;
  participants: number; tags?: string[]; story: string; blogLink?: string;
}
interface PartnerItem { name: string; logo: string; group: '기업' | '공공기관·재단' | '학교·교육기관' | '단체·NGO' | string; blogLink?: string; }
interface PressReleaseItem { id: number; title: string; date: string; source: string; category: string; summary: string; link: string; }
```

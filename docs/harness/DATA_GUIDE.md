# DATA_GUIDE — 콘텐츠 데이터 규칙 (`src/data/mockData.ts`)

사이트에 보이는 텍스트·숫자·이미지 경로의 대부분은 `src/data/mockData.ts` 한 파일에 있습니다.
"mock" 이라는 이름이지만 **실제 운영 데이터**입니다. (이름 변경은 sync 스크립트·문서 동시 수정이 필요하므로 보류)

## 1. 최상위 키 지도

| 키 | 사용하는 컴포넌트 | 비고 |
|----|------------------|------|
| `hero` | HeroSection | `keywords` 는 `#` 포함/미포함 모두 허용 |
| `about` | AboutSection | `coreValues`(O.P.E.N), `features`, `personaNeeds`, `ciDescription` |
| `impactStats` | ImpactSection | **id 1·2 의 value 는 화면에서 자동 계산**(참여기관 수, 포트폴리오 수)되어 덮어써짐 |
| `flagshipBrands` | ProgramsSection | `id: "onnon" | "onting"` (아이콘 매핑에 사용) |
| `programOptions` | ProgramsSection | BASIC/옵션 A~C |
| `programs` | ProgramsSection | 4대 핵심 콘텐츠 |
| `processSteps` | ProcessSection | 4단계 |
| `portfolioItems` | Hero(최근 3건), PortfolioSection(6건), PortfolioPage(전체), SearchModal, Header/Footer(개수) | ★ 아래 3장 |
| `pressReleases` | TestimonialsSection(언론보도) | JSON 스타일(따옴표 키)로 작성되어 있음 — 그대로 유지 |
| `testimonials` | TestimonialsSection(후기) | 이름은 반드시 마스킹 (예: `김*준`) |
| `partners` | PartnersSection, Footer(개수) | ★ 아래 4장 |
| `faqs` | FAQSection | |
| `companyInfo` | Footer, InquiryForm 오류 안내 등 | 전화·메일·주소의 **단일 출처** |

## 2. 절대 건드리지 말 것 (자동화 마커)

`scripts/sync_blog.py` 가 문자열 검색으로 위치를 찾습니다.

```ts
  portfolioItems: [          // ← 정확히 공백 2칸 + 이 문자열
  ...
  ] as PortfolioItem[],      // ← 정확히 공백 2칸 + 이 문자열
```

- 포트폴리오 항목은 아래 형식(공백 4칸 `{` ~ 공백 4칸 `}`)을 유지합니다. 정렬 함수가 `\n    }` 로 블록 끝을 찾습니다.
- 항목 안에 중첩 객체(`{ }`)를 넣지 마세요. (배열 `[...]` 은 한 줄로 작성)

## 3. 포트폴리오 항목 (`PortfolioItem`)

```ts
    {
      id: 111,                                   // 고유 번호. 현재 최대값 + 1 (중복 금지)
      logNo: 224466044899,                       // 네이버 블로그 글 번호 (블로그 글이면 필수 — 중복 수집 방지 키)
      title: "○○기업과 함께한 2026 스페이스 업사이클링",
      category: "스페이스 업사이클링",            // 아래 5개 중 하나 (필터 칩과 일치해야 필터됨)
      orgType: "기업봉사",                        // "기업봉사" | "단체봉사"
      partner: "○○기업",                         // 화면에 표시될 참여기관명
      period: "2026.11.03",                      // ★ 반드시 YYYY.MM.DD (문자열 정렬·필터에 사용)
      year: "2026",                              // period 의 연도와 동일
      participants: 72,                          // 숫자. 모르면 30
      imageUrl: `${BASE_URL}images/portfolio/item_111.jpg`,   // 로컬 썸네일 (핫링크 금지)
      galleryUrls: [`${BASE_URL}images/portfolio/item_111.jpg`, "https://postfiles.pstatic.net/...?type=w800"],
      tags: ["기업봉사", "스페이스 업사이클링", "친환경·업사이클링"],   // # 없이 작성 (화면에서 # 붙임)
      story: "2~4문장 요약. 줄바꿈은 \\n",
      blogLink: "https://blog.naver.com/5penthe/224466044899"
    },
```

**category 허용값** (`types.ts` 의 `PortfolioCategory`, PortfolioPage 필터 칩과 동일)
`원데이메이킹` · `찾아가는 과학교실` · `스페이스 업사이클링` · `친환경 ESG` · `지역사회 나눔`

**"OPEN THE SHARE 최신" 배지 규칙**: `period >= "2025.01.01"` 이면 자동으로 OTS 배지·탭에 포함됩니다. (`isOTSItem`, PortfolioSection·PortfolioPage 두 곳에 동일 정의)

**정렬**: 파일 끝에서 `period` 내림차순으로 자동 정렬되므로 배열 내 위치는 상관없습니다.

### 블로그 자동 수집 (`scripts/sync_blog.py`)
- GitHub Actions 가 **매시간** RSS(최근 글 약 50개)를 확인 → 새 `logNo` 이면서 키워드(온앤온/온팅/사회공헌/기업봉사…)에 걸리는 글만 추가
- 자동 추론값(`orgType`, `category`, `partner`, `participants: 30`)은 **정확하지 않을 수 있음** → 운영자가 주기적으로 검수·수정 권장
- 이미 있는 `logNo` 는 다시 추가하지 않으므로, 수동으로 고친 내용은 덮어써지지 않습니다.
- 자동 수집을 막고 싶은 글: 해당 `logNo` 로 항목을 하나 만들어 두거나 `is_open_the_share_portfolio()` 의 제외 목록에 추가

## 4. 참여기관 (`PartnerItem`)

```ts
    {
      name: "DB생명",                                          // 고유해야 함 (React key 로 사용)
      logo: `${BASE_URL}images/partners/partner_89.png`,       // 다음 번호 사용, 투명 PNG 권장, 높이 88px 이상
      group: "기업",                                           // "기업" | "공공기관·재단" | "학교·교육기관" | "단체·NGO"
      blogLink: "https://blog.naver.com/5penthe/..."           // 선택. 있으면 카드 클릭 시 이동
    },
```

## 5. 이미지 규칙

| 종류 | 위치 | 권장 규격 |
|------|------|-----------|
| 포트폴리오 썸네일 | `public/images/portfolio/item_NNN.jpg` | 가로 ≤1200px, JPEG 품질 80~85, **≤300KB** |
| 파트너 로고 | `public/images/partners/partner_NN.png` | 투명 PNG, 가로 ≤400px, ≤50KB |
| 브랜드 자산(로고·CI·아이콘) | `src/assets/` (import 해서 사용 → 해시 파일명으로 캐시) | |
| 파비콘·OG | `public/` 루트 | |

- 파일 확장자와 실제 포맷을 일치시키세요. (과거 `.jpg` 이름의 PNG 가 있었음 → 2026-11-09 JPEG 로 재압축)
- 압축 방법(로컬): `pip install pillow` 후 `sync_blog.py` 의 `optimize_thumbnail()` 재사용, 또는 squoosh.app 사용

## 6. 수정 후 확인

1. `npm run build` 통과 (따옴표·쉼표 누락은 여기서 잡힘)
2. `npm run dev` 로 해당 섹션 + 포트폴리오 페이지 필터/검색 확인
3. 상세 모달에서 이미지·블로그 링크 동작 확인

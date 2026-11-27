/**
 * @file mockData.ts
 * @description 오픈더쉐어(https://openthe.kr/) 공식 홈페이지 및
 * 공식 네이버 블로그(https://blog.naver.com/5penthe)의 실제 데이터를 기반으로 구성된 데이터 파일입니다.
 */
import { PortfolioItem, PartnerItem, PressReleaseItem } from "../types";

// 포트폴리오·언론보도 원본은 Supabase 콘텐츠 DB 입니다. (Table Editor 에서 수정, 블로그 봇이 자동 추가)
// 빌드 때 scripts/pull-content.mjs 가 아래 JSON 을 만듭니다. 이 JSON 은 git 에 올리지 않으며 직접 고치지 않습니다.
import portfolioRows from './generated/portfolio.json';
import pressRows from './generated/press.json';

// vite.config.ts(Node, scripts/seo-html.ts)에서도 읽으므로 env 가 없으면 "/" 로 둔다
const BASE_URL = import.meta.env?.BASE_URL ?? "/";

/** DB 에는 'images/portfolio/item_001.jpg' 같은 상대경로가 들어 있어, 배포 경로(BASE_URL)를 붙인다. https URL 은 그대로. */
const withBase = (u: string) => (/^https?:\/\//.test(u) ? u : `${BASE_URL}${u.replace(/^\//, '')}`);
const withBaseUrl = (item: (typeof portfolioRows)[number]) => ({
  ...item,
  imageUrl: withBase(item.imageUrl),
  galleryUrls: item.galleryUrls.map(withBase),
});

export const mockData = {
  // 히어로(메인 비주얼) 섹션 데이터 (openthe.kr 실 데이터 반영)
  hero: {
    badge: "OPEN THE SHARE · 나눔에 가치를 더하다",
    title: "더 나은 사회를 위한 고민,\n오픈더쉐어가 함께합니다",
    subtitle: "오픈더쉐어는 평범함 속 위대함의 가치를 생각합니다. 데이터 기반 사회공헌, 게이미피케이션, 맞춤형 ESG 프로그램으로 기업과 사회를 잇는 지속가능한 나눔 문화를 만들어갑니다.",
    keywords: ["#데이터기반사회공헌", "#게이미피케이션", "#ESG경영실천", "#원데이메이킹", "#사회공헌행사대행"]
  },

  // '회사소개(About us)' 섹션 데이터 (openthe.kr/yc/sub/sub1_1.php 실 데이터 반영)
  about: {
    title: "평범함 속 위대함의 가치로 지속가능한 사회공헌 문화를 만듭니다",
    subtitle: "나눔의 문을 열다, (주)오픈더쉐어",
    description: "오픈더쉐어는 우리가 가진 평범함 속 위대함의 가치를 생각합니다. 평범하고 다양한 사람들의 관심과 흥미를 엮어 사회공헌으로 풀어냄으로써, 어려움을 겪고 있을 누군가에게 희망을 전하는 콘텐츠를 만듭니다. 작지만 꾸준한 나눔으로 모두에게 이로운 지속가능한 사회공헌 문화를 만들어갑니다.",
    quote: {
      text: "그가 겸손한 마음을 갖게 하여, 참된 위대함은 소박함에 있고 참된 지혜는 열린 마음에 있으며, 참된 힘은 온유함에 있다는 것을 항상 기억하게 하소서.",
      english: "Give him humility, so that he may always remember the simplicity of true greatness, the open mind of true wisdom, and the meekness of true strength.",
      author: "더글러스 맥아더 장군의 <아버지의 기도(A Father's Prayer)> 중"
    },
    mission: "생애주기별 사회공헌활동 기획 · 운영",
    vision: "전 국민 사회공헌 생활 인프라 구축",
    coreValues: [
      { letter: "O", word: "Opportunity", title: "나눔의 기회", description: "누구나 쉽게 접할 수 있는 나눔의 기회" },
      { letter: "P", word: "Prosperity", title: "번영의 가치", description: "작은 정성이 모여 이루게 될 번영의 가치" },
      { letter: "E", word: "Equality", title: "평등한 존중", description: "모두가 평등하게 존중받을 수 있는 삶" },
      { letter: "N", word: "Neighborhood", title: "더불어 사는 사회", description: "주변의 어려운 이웃과 더불어 사는 사회" }
    ],
    ciDescription: "오픈더쉐어의 로고는 영문 표기 중 ‘open’이라는 단어를 활용한 디자인으로, ‘n’을 여닫이문으로 형상화하여 ‘나눔의 문을 열다’라는 취지를 나타냅니다. 더불어 가장자리의 테두리는 ‘나눔으로 하나가 된 모습’을 상징합니다.",
    features: [
      { icon: "🎯", title: "적합한 맞춤형 콘텐츠 선정", description: "소외계층이 실제로 겪고 있는 어려움을 사전 수요조사로 파악하여 기업의 비전에 부합하는 사회공헌 콘텐츠로 해결합니다." },
      { icon: "🎮", title: "게이미피케이션 & 몰입 유도", description: "참여하는 임직원들의 만족도를 충족시키고, 제작 과정 속 다양한 콘텐츠로 지속적인 참여와 즐거운 몰입을 유도합니다." },
      { icon: "📊", title: "소셜 임팩트 데이터화 & 리포트", description: "사회공헌 프로젝트로 발생하는 성과를 정량·정성적으로 데이터화하여 ESG 경영에 활용 가능한 소셜 임팩트 리포트로 제공합니다." }
    ],
    personaNeeds: [
      { role: "ESG 책임자", worry: "사회공헌 소셜 임팩트 데이터를 체계적으로 정리하고 싶어요", tag: "데이터 기반 리포트" },
      { role: "경영지원팀", worry: "우리 기업만의 색다르고 특별한 맞춤형 사회공헌을 찾고 있어요", tag: "맞춤형 기획" },
      { role: "인사담당자", worry: "참여하는 임직원의 만족도와 몰입도를 모두 높이고 싶어요", tag: "게이미피케이션" }
    ]
  },

  // '핵심 성과' 섹션 데이터
  impactStats: [
    { id: 1, value: "89+", label: "함께한 참여 기업·기관", sub: "대기업·공공기관·대학·단체" },
    { id: 2, value: "120+", label: "기업·단체 프로젝트", sub: "나눔 키트·행사 대행 누적 운영" },
    { id: 3, value: "5,000+", label: "누적 참여 임직원·봉사자", sub: "전국 대면·비대면 핸즈온 참여" },
    { id: 4, value: "15,000+", label: "전달된 나눔 키트·수혜 이웃", sub: "전국 아동센터·복지기관 기부" }
  ],

  // '주요 사업 안내' 섹션 — 2대 핵심 사업 유형 (① 나눔 키트 제작 ② 기업 행사·컨설팅 대행)
  businessAreas: [
    {
      id: "kit",
      number: "01",
      label: "HANDS-ON PROGRAM",
      title: "원데이메이킹 (나눔 키트 제작)",
      summary: "취약계층이 필요로 하는 물품을 선물 박스(Gift Box) 형태로 만들어 기부하는 참여형 사회공헌활동입니다. 활동 특성과 규모, 기업 스토리 등에 적합한 제안을 드립니다.",
      points: ["DIY 나눔 키트 기획·제작·배송", "검수 후 복지기관 기부 전달", "나눔 전달 후기 공유"],
      color: "brand"
    },
    {
      id: "event",
      number: "02",
      label: "EVENT · CONSULTING",
      title: "기업 사회공헌 행사 컨설팅·대행",
      summary: "사회공헌 행사의 기획부터 현장 운영, 결과 보고까지 원하시는 방향에 맞게 도움을 드립니다. 기업의 ESG 방향에 맞는 프로그램을 설계하고 소셜 임팩트 리포트로 성과를 정리해 드립니다.",
      points: ["맞춤 프로그램 기획", "사회공헌 행사 현장 운영 · 촬영", "소셜 임팩트 공유 · 대외홍보"],
      color: "amber"
    }
  ],

  // '주요 사업 안내' 섹션 데이터 (openthe.kr 온앤온 & 온팅 + 4대 핵심 콘텐츠 실 데이터)
  flagshipBrands: [
    {
      id: "onnon",
      name: "온앤온 (ON&ON)",
      badge: "[대면] 원데이 메이킹 사회공헌",
      meaning: "‘따뜻한 온기를 활성화(ON)하여 나눔을 계속 이어가다(ON & ON)’라는 의미의 기업·단체 대면 사회공헌 프로그램",
      description: "취약계층에 필요한 물품을 참여자가 직접 기프트 박스(Gift Box) 형태로 제작하는 원데이 메이킹 활동으로, 참여 인원·원하는 콘텐츠·근무환경에 따라 맞춤형 옵션을 구성할 수 있습니다.",
      strengths: [
        "기업의 사업분야·규모·추구 방향에 맞는 이색적인 맞춤형 사회공헌 기획",
        "물품 제작과정부터 기부 전달까지 사진·영상 촬영 및 SNS·YouTube 확산"
      ],
      color: "brand"
    },
    {
      id: "onting",
      name: "온팅 (ON-ting)",
      badge: "[비대면] 원데이 메이킹 사회공헌",
      meaning: "따뜻한 온기와 미팅(Meeting)·채팅(Chatting)을 결합해 ‘온라인 플랫폼을 통해 따뜻한 나눔을 함께하다’라는 의미",
      description: "시간과 장소에 구애받지 않고 각자 원하는 장소에서 DIY 나눔 키트로 취약계층을 위한 물품을 제작하고, 완성된 물품을 수거·검수하여 기부하는 비대면 사회공헌 프로그램입니다.",
      strengths: [
        "전국 지사·재택근무 임직원이 언제 어디서나 안전하게 참여 가능",
        "실시간 온라인 소통 및 게이미피케이션 콘텐츠로 즐거운 추억 선물"
      ],
      color: "amber"
    }
  ],

  // '주요 사업 안내' > 나눔 키트 프로그램 구성 옵션 (BASIC 필수 + 옵션 A~D 선택 — 화면에서 토글해 문의 내용에 담김)
  programOptions: [
    { option: "BASIC", type: "필수", title: "나눔 키트 제작", detail: "기부를 위한 나눔 키트 재료 1세트만 구성된 패키지" },
    { option: "옵션 A", type: "선택", title: "1 + 1 구성", detail: "개인 소장용으로 재료 1세트 더 추가 구성" },
    { option: "옵션 B", type: "선택", title: "선물세트 포장용 추가 구성품 준비", detail: "간식 꾸러미, 학용품, 건강용품 등" },
    { option: "옵션 C", type: "선택", title: "현장 사진·영상 촬영 및 스케치 영상 제작", detail: "YouTube 채널 및 SNS 공유" },
    { option: "옵션 D", type: "선택", title: "소셜 임팩트 리포트 제공", detail: "기부 성과 지표 정리 및 ESG 결과 보고서 제공" }
  ],

  // '주요 사업 안내' > 4대 핵심 사회공헌 콘텐츠 (화면 노출용. icon 은 ProgramsSection 의 SVG 아이콘 키)
  // ※ 아래 programs 는 맞춤 기획 추천(recommendData.programRules)이 id 로 참조하므로 따로 유지한다.
  coreContents: [
    {
      id: "baking",
      icon: "baking",
      subtitle: "온기 가득 수제 나눔",
      title: "사랑의 베이킹 클래스",
      description: "취약계층 아동들과 함께 전문 파티시에 선생님의 제과·제빵 수업을 들으며 유의미한 시간을 보내는 활동입니다."
    },
    {
      id: "science",
      icon: "science",
      subtitle: "미래세대 교육격차 해소",
      title: "찾아가는 과학교실",
      description: "취약계층 아동·청소년을 위한 창의 과학교실, IoT 키트 실습, 두뇌게임 등 임직원 멘토와 함께하는 참여형 교육 사회공헌을 운영합니다."
    },
    {
      id: "space",
      icon: "space",
      subtitle: "복지시설 공간 개선·나눔",
      title: "스페이스 업사이클링",
      description: "복지관·노인요양센터의 노후 공간을 사용자 중심으로 리모델링하는 맞춤형 환경 개선 나눔사업입니다."
    },
    {
      id: "esg",
      icon: "esg",
      subtitle: "지속 가능한 환경 보호 실천",
      title: "친환경 ESG 프로젝트",
      description: "도심·하천·마운틴 플로깅, 식목활동, 가드닝, EM 흙공 만들기 등 환경을 위한 사회공헌활동을 수행합니다."
    }
  ] as { id: string; icon: 'baking' | 'science' | 'space' | 'esg'; subtitle: string; title: string; description: string }[],

  programs: [
    {
      id: 1,
      title: "원데이메이킹 (나눔 키트)",
      subtitle: "핸즈온 DIY 기부 물품 제작",
      description: "동물장바구니, 공룡다이어리, 하리보필통, 큐브연필꽂이, 자개손거울, 무드등, 천연비누 등 취약계층 아동·이웃에게 필요한 물품을 직접 제작하여 기부합니다.",
      icon: "🎁",
      tags: ["#온앤온", "#온팅", "#기프트박스"]
    },
    {
      id: 2,
      title: "찾아가는 과학교실",
      subtitle: "미래세대 교육격차 해소",
      description: "취약계층 아동·청소년을 위한 STEAM 창의 과학교실, IoT 코딩 키트 실습, 두뇌게임 등 임직원 멘토와 함께하는 참여형 교육 사회공헌을 운영합니다.",
      icon: "🔬",
      tags: ["#STEAM교육", "#IoT과학교실", "#임직원멘토링"]
    },
    {
      id: 3,
      title: "스페이스 업사이클링",
      subtitle: "복지시설 공간 개선·나눔",
      description: "복지관·노인요양센터의 노후 공간을 사용자 중심으로 리모델링하는 스페이스 업사이클링과 사랑의 베이킹 클래스, 김장 나눔 등 밀착형 나눔을 실천합니다.",
      icon: "🏠",
      tags: ["#공간리모델링", "#베이킹클래스", "#김장나눔"]
    },
    {
      id: 4,
      title: "친환경 ESG 프로젝트",
      subtitle: "지속 가능한 환경 보호 실천",
      description: "하천 수질 정화를 위한 EM 흙공 만들기, 도심·마운틴 플로깅 캠페인, 식목 활동, 미니 가드닝 및 친환경 다회용 장바구니 제작 등 ESG 환경 활동을 수행합니다.",
      icon: "🌱",
      tags: ["#EM흙공", "#플로깅", "#친환경업사이클링"]
    }
  ],

  // '진행 프로세스' 섹션 데이터
  processSteps: [
    {
      id: 1,
      step: "STEP 01",
      title: "사전 수요조사 · 맞춤 컨설팅",
      description: "참여 인원 수, 가용 예산, 추구하는 ESG 방향성을 사전 협의하고, 취약계층 기관 수요조사를 바탕으로 기업 니즈에 최적화된 콘텐츠를 선정합니다."
    },
    {
      id: 2,
      step: "STEP 02",
      title: "임팩트 검증 · 기획안 제안",
      description: "예상되는 소셜 임팩트가 실제 수혜 대상(아동, 독거어르신 등)에게 꼭 필요한 서비스인지 검증하고 맞춤형 프로그램 기획안을 제안합니다."
    },
    {
      id: 3,
      step: "STEP 03",
      title: "대면 · 비대면 프로그램 실행",
      description: "임직원들의 몰입과 만족도를 높이는 게이미피케이션 요소 및 타임테이블을 구성하여 대면(온앤온) 또는 비대면(온팅) 프로그램을 전문 운영합니다."
    },
    {
      id: 4,
      step: "STEP 04",
      title: "물품 기부 · 임팩트 리포트",
      description: "완성된 기부 물품을 희망 취약계층 기관에 전달하고, 프로젝트를 통해 창출된 소셜 임팩트 데이터 및 결산 리포트를 공유합니다."
    }
  ],

  // '포트폴리오' 섹션 데이터 — 원본: Supabase public.portfolio_items (블로그 '현장스케치' 글을 봇이 자동 추가, story 는 1~2문장 요약)
  portfolioItems: portfolioRows.map(withBaseUrl) as PortfolioItem[],

  // 언론보도 — 원본: Supabase public.press_releases (블로그 '보도자료' 글의 언론사 원문 링크를 봇이 자동 추가)
  pressReleases: pressRows as PressReleaseItem[],

  testimonials: [
    {
      id: 1,
      name: "김*준",
      role: "글로벌 전자기업 ESG 사회공헌 담당자",
      program: "스페이스 업사이클링 & 찾아가는 과학교실",
      quote: "오픈더쉐어 덕분에 일회성 봉사활동에서 벗어나, 우리 회사의 비전과 연결되는 의미 있는 사회공헌 프로그램을 매년 이어가고 있습니다. 사전 수요조사부터 현장 운영, 결산 리포트까지 완성도가 매우 높습니다."
    },
    {
      id: 2,
      name: "박*연",
      role: "금융권 사회공헌 봉사단 매니저",
      program: "온앤온 · 온팅 원데이메이킹 (자개손거울·무드등·키링)",
      quote: "매 분기 새로운 핸즈온 키트로 임직원들이 즐겁게 참여하고 있습니다. 만들어진 물품이 지역아동센터 아이들에게 어떻게 전달되었는지 후기까지 꼼꼼하게 공유해주셔서 신뢰가 갑니다."
    },
    {
      id: 3,
      name: "이*호",
      role: "대학교 RCY 봉사동아리 대표",
      program: "단체봉사 비대면 온팅 나눔키트 제작",
      quote: "학생들과 함께 방향제와 유니콘 키링을 만들며 나눔의 가치를 직접 체감할 수 있었습니다. 가이드가 친절해 누구나 쉽게 완성도 높은 기부 물품을 만들 수 있었던 뜻깊은 시간이었습니다."
    }
  ],

  // '함께한 참여기관 · 파트너사' 섹션 데이터 (로고 등록 72개 + 최신 참여기관 17개 = 총 89개 실데이터)
  partners: [
    {
      name: "DB생명",
      logo: `${BASE_URL}images/partners/partner_00.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223772948561"
    },
    {
      name: "DB손해보험",
      logo: `${BASE_URL}images/partners/partner_01.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223772948201"
    },
    {
      name: "기쁨이되는교회",
      logo: `${BASE_URL}images/partners/partner_02.png`,
      group: "단체·NGO",
      blogLink: "https://blog.naver.com/5penthe/223772931324"
    },
    {
      name: "세인트존스베리아카데미 제주",
      logo: `${BASE_URL}images/partners/partner_03.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/223772930841"
    },
    {
      name: "부산부흥고등학교 RCY",
      logo: `${BASE_URL}images/partners/partner_04.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/223772930227"
    },
    {
      name: "충주여자고등학교",
      logo: `${BASE_URL}images/partners/partner_05.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/223772929701"
    },
    {
      name: "크로다코리아",
      logo: `${BASE_URL}images/partners/partner_06.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223772929336"
    },
    {
      name: "케민코리아",
      logo: `${BASE_URL}images/partners/partner_07.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223772928830"
    },
    {
      name: "테크로스",
      logo: `${BASE_URL}images/partners/partner_08.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223772928533"
    },
    {
      name: "도날슨코리아",
      logo: `${BASE_URL}images/partners/partner_09.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223772928131"
    },
    {
      name: "GS E&R",
      logo: `${BASE_URL}images/partners/partner_10.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223772927735"
    },
    {
      name: "한국장학재단",
      logo: `${BASE_URL}images/partners/partner_11.png`,
      group: "공공기관·재단",
      blogLink: "https://blog.naver.com/5penthe/223772927198"
    },
    {
      name: "골프존",
      logo: `${BASE_URL}images/partners/partner_12.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223772926723"
    },
    {
      name: "배곧소망교회 청년부",
      logo: `${BASE_URL}images/partners/partner_13.png`,
      group: "단체·NGO",
      blogLink: "https://blog.naver.com/5penthe/223772926286"
    },
    {
      name: "도드람양돈농협",
      logo: `${BASE_URL}images/partners/partner_14.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223772925497"
    },
    {
      name: "베올리아 코리아",
      logo: `${BASE_URL}images/partners/partner_15.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223772924848"
    },
    {
      name: "한서대학교",
      logo: `${BASE_URL}images/partners/partner_16.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/223772923602"
    },
    {
      name: "초당고등학교",
      logo: `${BASE_URL}images/partners/partner_17.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/223772923160"
    },
    {
      name: "한국쓰리엠",
      logo: `${BASE_URL}images/partners/partner_18.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223772922607"
    },
    {
      name: "용인상하중학교",
      logo: `${BASE_URL}images/partners/partner_19.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/223772922118"
    },
    {
      name: "한국재정정보원",
      logo: `${BASE_URL}images/partners/partner_20.png`,
      group: "공공기관·재단",
      blogLink: "https://blog.naver.com/5penthe/223425558005"
    },
    {
      name: "경기동부노인보호전문기관",
      logo: `${BASE_URL}images/partners/partner_21.png`,
      group: "공공기관·재단",
      blogLink: "https://blog.naver.com/5penthe/223425557167"
    },
    {
      name: "HP프린팅코리아",
      logo: `${BASE_URL}images/partners/partner_22.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223405390926"
    },
    {
      name: "콘센트릭스",
      logo: `${BASE_URL}images/partners/partner_23.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223405390595"
    },
    {
      name: "코레일로지스",
      logo: `${BASE_URL}images/partners/partner_24.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223405390276"
    },
    {
      name: "포스코플로우",
      logo: `${BASE_URL}images/partners/partner_25.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223279408210"
    },
    {
      name: "여주대학교",
      logo: `${BASE_URL}images/partners/partner_26.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/223279406797"
    },
    {
      name: "한미글로벌",
      logo: `${BASE_URL}images/partners/partner_27.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223279405870"
    },
    {
      name: "한국저작권보호원",
      logo: `${BASE_URL}images/partners/partner_28.png`,
      group: "공공기관·재단",
      blogLink: "https://blog.naver.com/5penthe/223279404049"
    },
    {
      name: "KRX한국거래소 국민행복재단",
      logo: `${BASE_URL}images/partners/partner_29.png`,
      group: "공공기관·재단",
      blogLink: "https://blog.naver.com/5penthe/223279402979"
    },
    {
      name: "밸류맵",
      logo: `${BASE_URL}images/partners/partner_30.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223279393972"
    },
    {
      name: "삼성화재서비스",
      logo: `${BASE_URL}images/partners/partner_31.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223279392900"
    },
    {
      name: "SK바이오팜",
      logo: `${BASE_URL}images/partners/partner_32.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223279392097"
    },
    {
      name: "성남시학교밖청소년지원센터",
      logo: `${BASE_URL}images/partners/partner_33.png`,
      group: "공공기관·재단",
      blogLink: "https://blog.naver.com/5penthe/223279390618"
    },
    {
      name: "농심",
      logo: `${BASE_URL}images/partners/partner_34.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223111463535"
    },
    {
      name: "호서대학교",
      logo: `${BASE_URL}images/partners/partner_35.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/223111463041"
    },
    {
      name: "건양대학교 RCY",
      logo: `${BASE_URL}images/partners/partner_36.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/223111462667"
    },
    {
      name: "한국기술교육대학교",
      logo: `${BASE_URL}images/partners/partner_37.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/223078103333"
    },
    {
      name: "엔스테이지",
      logo: `${BASE_URL}images/partners/partner_38.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223071260724"
    },
    {
      name: "신세계백화점",
      logo: `${BASE_URL}images/partners/partner_39.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223046153573"
    },
    {
      name: "아프리카TV",
      logo: `${BASE_URL}images/partners/partner_40.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/222995152310"
    },
    {
      name: "다인소재",
      logo: `${BASE_URL}images/partners/partner_41.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/222995151499"
    },
    {
      name: "세이프티온솔루션",
      logo: `${BASE_URL}images/partners/partner_42.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/222995150544"
    },
    {
      name: "용인도시공사",
      logo: `${BASE_URL}images/partners/partner_43.png`,
      group: "공공기관·재단",
      blogLink: "https://blog.naver.com/5penthe/222995149855"
    },
    {
      name: "무궁화신탁",
      logo: `${BASE_URL}images/partners/partner_44.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/222995148935"
    },
    {
      name: "삼성전자",
      logo: `${BASE_URL}images/partners/partner_45.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/222995148214"
    },
    {
      name: "양평공사",
      logo: `${BASE_URL}images/partners/partner_46.png`,
      group: "공공기관·재단",
      blogLink: "https://blog.naver.com/5penthe/222995146710"
    },
    {
      name: "Amazon Web Services",
      logo: `${BASE_URL}images/partners/partner_47.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/222995145921"
    },
    {
      name: "LG전자",
      logo: `${BASE_URL}images/partners/partner_48.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/222995145165"
    },
    {
      name: "포스코",
      logo: `${BASE_URL}images/partners/partner_49.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/222995144178"
    },
    {
      name: "아주대학교",
      logo: `${BASE_URL}images/partners/partner_50.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/222995143258"
    },
    {
      name: "한국무라타전자",
      logo: `${BASE_URL}images/partners/partner_51.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/222995141758"
    },
    {
      name: "극동대학교",
      logo: `${BASE_URL}images/partners/partner_52.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/222995141009"
    },
    {
      name: "경기주택도시공사",
      logo: `${BASE_URL}images/partners/partner_53.png`,
      group: "공공기관·재단",
      blogLink: "https://blog.naver.com/5penthe/222995140249"
    },
    {
      name: "을지대학교",
      logo: `${BASE_URL}images/partners/partner_54.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/222995139225"
    },
    {
      name: "NH투자증권",
      logo: `${BASE_URL}images/partners/partner_55.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/222995138621"
    },
    {
      name: "가톨릭대학교",
      logo: `${BASE_URL}images/partners/partner_56.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/222995138067"
    },
    {
      name: "로타랙트",
      logo: `${BASE_URL}images/partners/partner_57.png`,
      group: "단체·NGO",
      blogLink: "https://blog.naver.com/5penthe/222995137238"
    },
    {
      name: "동양생명",
      logo: `${BASE_URL}images/partners/partner_58.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/222995136538"
    },
    {
      name: "동덕여자대학교",
      logo: `${BASE_URL}images/partners/partner_59.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/222995135993"
    },
    {
      name: "한국공학대학교",
      logo: `${BASE_URL}images/partners/partner_60.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/222995135279"
    },
    {
      name: "용인시청",
      logo: `${BASE_URL}images/partners/partner_61.png`,
      group: "공공기관·재단",
      blogLink: "https://blog.naver.com/5penthe/222995134377"
    },
    {
      name: "ISC 성남",
      logo: `${BASE_URL}images/partners/partner_62.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/222995133648"
    },
    {
      name: "한국사회적기업진흥원",
      logo: `${BASE_URL}images/partners/partner_63.png`,
      group: "공공기관·재단",
      blogLink: "https://blog.naver.com/5penthe/222995132764"
    },
    {
      name: "용인대학교",
      logo: `${BASE_URL}images/partners/partner_64.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/222995130823"
    },
    {
      name: "분당차병원",
      logo: `${BASE_URL}images/partners/partner_65.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/221351531223"
    },
    {
      name: "삼성물산",
      logo: `${BASE_URL}images/partners/partner_66.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/221351530268"
    },
    {
      name: "어떤버스",
      logo: `${BASE_URL}images/partners/partner_67.png`,
      group: "단체·NGO",
      blogLink: "https://blog.naver.com/5penthe/221351529417"
    },
    {
      name: "단국대학교",
      logo: `${BASE_URL}images/partners/partner_68.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/221351527652"
    },
    {
      name: "아모레퍼시픽",
      logo: `${BASE_URL}images/partners/partner_69.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/221351527239"
    },
    {
      name: "삼성전기",
      logo: `${BASE_URL}images/partners/partner_70.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/221351525746"
    },
    {
      name: "가천대학교",
      logo: `${BASE_URL}images/partners/partner_71.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/221351525153"
    },
    {
      name: "한국디자인진흥원",
      logo: `${BASE_URL}images/partners/partner_72.png`,
      group: "공공기관·재단",
      blogLink: "https://blog.naver.com/5penthe/223958656114"
    },
    {
      name: "대상주식회사",
      logo: `${BASE_URL}images/partners/partner_73.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223842450535"
    },
    {
      name: "밀알복지재단",
      logo: `${BASE_URL}images/partners/partner_74.png`,
      group: "공공기관·재단",
      blogLink: "https://blog.naver.com/5penthe/223850942702"
    },
    {
      name: "흥국에프엔비",
      logo: `${BASE_URL}images/partners/partner_75.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223850942702"
    },
    {
      name: "테일러팜스",
      logo: `${BASE_URL}images/partners/partner_76.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223850942702"
    },
    {
      name: "더블트리 바이 힐튼 서울 판교",
      logo: `${BASE_URL}images/partners/partner_77.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/224110851500"
    },
    {
      name: "DBCAS손해사정",
      logo: `${BASE_URL}images/partners/partner_78.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/224094202969"
    },
    {
      name: "유플러스 홈서비스",
      logo: `${BASE_URL}images/partners/partner_79.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223849891664"
    },
    {
      name: "GS반월열병합발전",
      logo: `${BASE_URL}images/partners/partner_80.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223690002850"
    },
    {
      name: "충북연구원",
      logo: `${BASE_URL}images/partners/partner_81.png`,
      group: "공공기관·재단",
      blogLink: "https://blog.naver.com/5penthe/224143734525"
    },
    {
      name: "우크브릿지",
      logo: `${BASE_URL}images/partners/partner_82.png`,
      group: "기업",
      blogLink: "https://blog.naver.com/5penthe/223986431068"
    },
    {
      name: "부산대학교 RCY",
      logo: `${BASE_URL}images/partners/partner_83.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/224405196162"
    },
    {
      name: "동아대학교 RCY",
      logo: `${BASE_URL}images/partners/partner_84.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/224450333548"
    },
    {
      name: "선문대학교 RCY",
      logo: `${BASE_URL}images/partners/partner_85.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/224414992377"
    },
    {
      name: "신구대학교",
      logo: `${BASE_URL}images/partners/partner_86.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/223817672133"
    },
    {
      name: "국군간호사관학교",
      logo: `${BASE_URL}images/partners/partner_87.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/223539444063"
    },
    {
      name: "호남제일고등학교",
      logo: `${BASE_URL}images/partners/partner_88.png`,
      group: "학교·교육기관",
      blogLink: "https://blog.naver.com/5penthe/224115725410"
    },
  ] as PartnerItem[],

  faqs: [
    {
      id: 1,
      question: "프로그램 견적은 어떻게 산정되나요?",
      answer: "프로그램 견적은 희망하시는 가용 예산에 따라 상이하며, 최대한 원하시는 예산에 맞추어 참여 인원, 진행 방식(대면 온앤온 / 비대면 온팅), 선택 옵션(BASIC, A~C), 활동 재료 등을 조율하여 맞춤 산정됩니다. 문의하기 폼이나 유선(031-8039-7034 / 010-7512-7032), 카카오톡(ID: 5penthe)으로 문의주시면 1:1로 상세히 안내해 드립니다."
    },
    {
      id: 2,
      question: "정해진 사회공헌 프로그램을 선택하는 방식인가요?",
      answer: "아닙니다. 원데이 메이킹(나눔 키트 제작), 찾아가는 과학교실, 스페이스 업사이클링, 친환경 플로깅·EM흙공 등 기존 검증된 레퍼런스 중 선택하실 수도 있고, 귀사의 업종과 ESG 스토리가 담긴 완전히 새로운 맞춤형 사회공헌 프로그램을 기획하여 진행할 수도 있습니다."
    },
    {
      id: 3,
      question: "대면(온앤온)과 비대면(온팅) 중 어떻게 선택하면 좋나요?",
      answer: "임직원분들이 한자리에 모여 협동심과 현장 몰입감을 느끼고 싶으시다면 전문 강사진이 출강하는 대면 ‘온앤온(ON&ON)’을 추천드리며, 전국 지사 근무나 자율적인 일정 참여가 필요하시다면 각자의 공간에서 참여 가능한 비대면 DIY 키트 봉사 ‘온팅(ON-ting)’을 추천드립니다. 두 방식 모두 20인 이상 참여 시 1+1 제작, 기프트박스 구성, 영상 촬영 등 선택 옵션을 추가하실 수 있습니다."
    },
    {
      id: 4,
      question: "지방에서도 프로그램 진행 및 물품 기부가 가능한가요?",
      answer: "네, 서울·수도권뿐만 아니라 전국 어디서나 프로그램 진행이 가능합니다. 또한 제작된 기부 물품은 기업이 희망하시는 지역의 복지기관(지역아동센터, 노인복지관, 장애인복지시설 등)을 매칭하여 전달하고 전달 후기를 공유해 드립니다."
    }
  ],

  companyInfo: {
    name: "(주)오픈더쉐어",
    englishName: "Open The Share Inc.",
    ceo: "김진솔",
    bizNo: "504-81-28956",
    address: "경기도 성남시 분당구 황새울로360번길 21 5층 502호",
    centerAddress: "경기도 성남시 분당구 돌마로 356번길 3, 502호 (성남분당센터)",
    tel: "031-8039-7034",
    mobile: "010-7512-7032",
    fax: "031-8057-7032",
    email: "opentheshare@naver.com",
    kakaoId: "5penthe",
    groupInquiryFormUrl: "https://bit.ly/3GRqWws",
    individualFormUrl: "https://forms.gle/BQNdehYLFx92q1Px7",
    socials: {
      blog: "https://blog.naver.com/5penthe",
      instagram: "https://www.instagram.com/5penthe/",
      youtube: "https://www.youtube.com/channel/UCk21g-JuV-bnQQ2n7v2v6FA",
      facebook: "https://www.facebook.com/groups/openthe/"
    }
  }
};

// 최신 일자(period) 기준 내림차순 정렬 (한국무라타전자 등 최신 활동 및 블로그 포스트가 항상 최상단에 노출)
mockData.portfolioItems.sort((a, b) => b.period.localeCompare(a.period));

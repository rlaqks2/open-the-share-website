/**
 * @file mockData.ts
 * @description 애플리케이션에서 사용하는 모든 정적(mock) 데이터를 포함합니다.
 * API 연동 전에 UI 개발 및 테스트를 위해 사용되는 데이터 소스이며,
 * 텍스트 내용, 포트폴리오 항목, 고객 후기 등 웹사이트에 표시될 정보가 이 파일에 객체 형태로 정의되어 있습니다.
 */
import { PortfolioItem } from "../types";

export const mockData = {
  // '소개' 섹션에 사용될 데이터
  about: {
    title: "기업의 ESG 경영을 위한 최적의 사회공헌 파트너, 오픈더쉐어",
    description: "오픈더쉐어는 기업의 사회적 책임(CSR)과 ESG 경영 목표 달성을 돕는 전문 파트너입니다. 우리는 단순한 봉사활동을 넘어, 기업의 가치와 사회의 필요를 연결하는 임팩트 있는 사회공헌 프로그램을 기획하고 실행합니다.",
    features: [
      { icon: "💡", title: "맞춤형 프로그램 기획", description: "기업의 비전과 미션에 부합하는 독창적인 프로그램을 제안합니다." },
      { icon: "🚀", title: "원스톱 운영 솔루션", description: "기획부터 실행, 결과 보고까지 모든 과정을 책임지고 운영합니다." },
      { icon: "📊", title: "임팩트 측정 및 보고", description: "활동의 사회적 가치를 측정하고, ESG 보고에 활용 가능한 데이터를 제공합니다." }
    ],
    imageUrl: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  // '핵심 성과' 섹션에 사용될 데이터
  impactStats: [
    { id: 1, value: "150+", label: "누적 파트너사" },
    { id: 2, value: "3,000+", label: "총 참여 임직원" },
    { id: 3, value: "12,000+", label: "총 봉사 시간" },
    { id: 4, value: "10,000+", label: "수혜 인원" }
  ],
  // '주요 사업 분야' 섹션에 사용될 데이터
  programs: [
    { id: 1, title: "환경보호", description: "도심 숲 가꾸기, 해변 정화 활동 등", icon: "🌳" },
    { id: 2, title: "지역사회 기여", description: "취약계층 주거 개선, 벽화 그리기 등", icon: "🏘️" },
    { id: 3, title: "아동/청소년 지원", description: "교육 멘토링, 학습 환경 개선 등", icon: "🎓" },
    { id: 4, title: "문화/예술 나눔", description: "문화 소외계층을 위한 공연, 전시 지원", icon: "🎨" }
  ],
  // '진행 절차' 섹션에 사용될 데이터
  processSteps: [
    { id: 1, title: "컨설팅 및 요구분석", description: "기업의 ESG 목표와 니즈를 파악하고, 최적의 방향성을 제시합니다." },
    { id: 2, title: "프로그램 기획 및 제안", description: "사회적 가치와 임직원 참여를 극대화할 수 있는 맞춤형 프로그램을 설계합니다." },
    { id: 3, title: "실행 및 운영", description: "참가자 모집부터 현장 운영까지, 모든 과정을 전문적으로 관리합니다." },
    { id: 4, title: "결과 보고 및 피드백", description: "활동 결과를 데이터 기반으로 분석하고, 향후 방향을 함께 논의합니다." }
  ],
  // '포트폴리오' 섹션에 사용될 데이터
  portfolioItems: [
    { id: 1, title: "미래세대육성", category: "IT 기업 연합", imageUrl: "https://images.pexels.com/photos/5428153/pexels-photo-5428153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", partner: "Tech For Good Alliance", period: "2023년 10월", participants: 80, story: "국내 유수 IT 기업들과 협력하여 소외계층 청소년들에게 코딩 교육과 IT 멘토링을 제공하는 프로젝트를 진행했습니다. 참가 학생들은 자신만의 웹사이트를 만들며 미래의 꿈을 키웠고, 참여한 임직원들은 재능 기부를 통해 큰 보람을 느꼈습니다." },
    { id: 2, title: "우리동네, 함께 가꾸는 벽화 그리기", category: "건설사", imageUrl: "https://images.pexels.com/photos/7136655/pexels-photo-7136655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", partner: "희망 건설", period: "2023년 9월", participants: 50, story: "노후화된 주택가의 낡은 담벼락에 희망을 그리는 벽화 봉사활동을 진행했습니다. 임직원들과 지역 주민들이 함께 참여하여 마을에 활기를 불어넣었고, 아름다운 포토존으로 재탄생했습니다." },
    { id: 3, title: "어르신들을 위한 따듯한 도시락 나눔", category: "식품 기업", imageUrl: "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", partner: "행복 F&B", period: "2023년 11월", participants: 40, story: "거동이 불편한 독거 어르신들에게 임직원들이 직접 만든 영양 가득한 도시락을 전달했습니다. 따뜻한 식사와 함께 안부를 여쭙고 정서적 지지를 제공하며 의미 있는 시간을 보냈습니다." },
    { id: 4, title: "금융사와 함께하는 도심 숲 가꾸기", category: "금융 그룹", imageUrl: "https://images.pexels.com/photos/7943940/pexels-photo-7943940.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", partner: "그린 파이낸셜", period: "2023년 5월", participants: 120, story: "미세먼지 저감과 도시 열섬 현상 완화를 위해 도심 속 공원에 나무를 심고 가꾸는 활동을 진행했습니다. 임직원들이 가족과 함께 참여하여 환경의 소중함을 배우고, 지역사회에 푸른 쉼터를 선물했습니다." }
  ] as PortfolioItem[], // PortfolioItem 타입으로 단언(assertion)하여 타입 안정성을 보장
  // '고객 후기' 섹션에 사용될 데이터
  testimonials: [
    { id: 1, name: "김민준", role: "A 기업 ESG팀장", quote: "오픈더쉐어 덕분에 형식적인 봉사활동에서 벗어나, 우리 회사의 비전과 연결되는 의미 있는 프로그램을 진행할 수 있었습니다. 임직원들의 만족도가 매우 높았습니다." },
    { id: 2, name: "박서연", role: "B 기업 사회공헌 담당자", quote: "복잡하고 어려운 사회공헌 활동의 전 과정을 전문가가 알아서 처리해주니 정말 편했습니다. 결과 보고서의 퀄리티도 기대 이상이었습니다." },
    { id: 3, name: "이진호", role: "C 기업 프로그램 참가자", quote: "회사를 통해 이렇게 보람 있는 활동에 참여할 수 있어 좋았습니다. 동료들과 함께 땀 흘리며 나눔의 기쁨을 느낄 수 있었던 소중한 경험이었습니다." }
  ],
  // '주요 고객사' 섹션에 사용될 데이터
  partners: [
    { name: 'Alpha Corp', logo: 'https://placehold.co/150x50/e2e8f0/475569?text=AlphaCorp' },
    { name: 'Beta Solutions', logo: 'https://placehold.co/150x50/e2e8f0/475569?text=BetaSol' },
    { name: 'Gamma Tech', logo: 'https://placehold.co/150x50/e2e8f0/475569?text=GammaTech' },
    { name: 'Delta Group', logo: 'https://placehold.co/150x50/e2e8f0/475569?text=DeltaGroup' },
    { name: 'Epsilon Inc', logo: 'https://placehold.co/150x50/e2e8f0/475569?text=Epsilon' },
    { name: 'Zeta Systems', logo: 'https://placehold.co/150x50/e2e8f0/475569?text=ZetaSys' },
  ],
  // '자주 묻는 질문' 섹션에 사용될 데이터
  faqs: [
    { id: 1, question: "프로그램 비용은 어떻게 산정되나요?", answer: "프로그램 비용은 참여 인원, 장소, 내용, 재료비 등에 따라 맞춤형으로 산정됩니다. 자세한 내용은 문의주시면 상세한 견적과 함께 안내해 드립니다." },
    { id: 2, question: "소규모 인원도 참여가 가능한가요?", answer: "네, 가능합니다. 10명 내외의 소규모 팀부터 100명 이상의 대규모 인원까지, 참여 규모에 맞는 최적의 프로그램을 기획해 드립니다." },
    { id: 3, question: "지방에서도 프로그램 진행이 가능한가요?", answer: "네, 전국 어디서나 프로그램 진행이 가능합니다. 지역의 특성과 상황을 고려한 맞춤형 프로그램을 기획하여 운영합니다." },
    { id: 4, question: "ESG 보고서에 활용할 수 있는 결과 데이터를 제공해주나요?", answer: "네, 프로그램 종료 후 활동 내용과 성과, 참여자 만족도 등을 포함한 상세한 결과 보고서를 제공합니다. 해당 데이터는 기업의 ESG 보고서나 지속가능경영보고서에 활용하실 수 있습니다." }
  ]
};
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
      { icon: "💡", title: "맞춤형 프로그램 기획", description: "기업의 비전과 미션에 부합하는 독창적인 커스터마이징 프로그램을 제안합니다." },
      { icon: "🚀", title: "원스톱 운영 솔루션", description: "기획부터 실행, 소셜임팩트리포트까지 모든 과정을 책임지고 운영합니다." },
      { icon: "📊", title: "임팩트 측정 및 보고", description: "활동의 사회적 가치를 측정하고, 소셜임팩트리포트에 활용 가능한 데이터를 제공합니다." }
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
    {
      id: 1,
      title: "원데이메이킹 사회공헌",
      description: "참여형 핸즈온 봉사활동으로 나눔물품을 제작하여 기부합니다.",
      icon: "🎁"
    },
    {
      id: 2,
      title: "찾아가는 과학교실",
      description: "미래세대를 위한 창의 과학 교육 프로그램을 제공합니다.",
      icon: "🔬"
    },
    {
      id: 3,
      title: "스페이스 업사이클링",
      description: "취약계층의 노후된 공간을 리모델링하여 쾌적한 환경을 만듭니다.",
      icon: "🏠"
    },
    {
      id: 4,
      title: "식목/플로깅/친환경 테마공원 조성",
      description: "지속 가능한 환경을 위한 다양한 친환경 활동을 실천합니다.",
      icon: "🌱"
    }
  ],
  // '진행 절차' 섹션에 사용될 데이터
  processSteps: [
    { id: 1, title: "컨설팅 및 요구분석", description: "기업의 ESG 목표와 니즈를 파악하고, 최적의 방향성을 제시합니다." },
    { id: 2, title: "프로그램 기획 및 제안", description: "사회적 가치와 임직원 참여를 극대화할 수 있는 맞춤형 프로그램을 설계합니다." },
    { id: 3, title: "실행 및 운영", description: "참가자 모집부터 현장 운영까지, 모든 과정을 전문적으로 관리합니다." },
    { id: 4, title: "소셜임팩트리포트 및 피드백", description: "활동 결과를 데이터 기반으로 분석하고, 향후 방향을 함께 논의합니다." }
  ],
  // '포트폴리오' 섹션에 사용될 데이터
  portfolioItems: [
    { id: 1, title: "나눔물품 제작기부", category: "원데이메이킹 사회공헌", imageUrl: "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", partner: "다수 기업", period: "상시 진행", participants: 100, story: "임직원들이 직접 만든 물품을 소외계층에 기부하여 따뜻한 나눔을 실천했습니다.", blogLink: "https://blog.naver.com/5penthe/223772948561" },
    {
      id: 2,
      title: "미래세대 육성",
      category: "찾아가는 과학교실",
      imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800",
      partner: "Tech for Good Alliance",
      period: "2023년 10월",
      participants: 50,
      story: "국내 유수 IT 기업들과 협력하여 소외계층 청소년들에게 코딩 교육과 IT 멘토링을 제공하는 프로젝트를 진행했습니다. 참가 학생들은 자신만의 웹사이트를 만들며 미래의 꿈을 키웠고, 참여한 임직원들은 재능 기부를 통해 큰 보람을 느꼈습니다.",
      blogLink: "http://globalshare.or.kr/support/page5.php"
    },
    { id: 3, title: "취약계층 노후공간 리모델링", category: "스페이스 업사이클링", imageUrl: "https://images.pexels.com/photos/7136655/pexels-photo-7136655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", partner: "건설사", period: "2023년", participants: 50, story: "노후된 취약계층의 주거 공간을 리모델링하여 안전하고 쾌적한 환경을 선물했습니다.", blogLink: "https://blog.naver.com/5penthe/223772948561" },
    {
      id: 4,
      title: "친환경 사회공헌",
      category: "식목 플로깅/테마공원",
      imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800",
      partner: "Green Tomorrow Foundation",
      period: "2023년 5월",
      participants: 120,
      story: "독거 노인 분들을 위한 도시락 나눔 활동을 진행했습니다. 신선한 재료로 만든 건강한 도시락을 전달하며 따뜻한 정을 나누었습니다. 많은 봉사자분들이 참여하여 더욱 뜻깊은 시간이었습니다.",
      blogLink: "http://globalshare.or.kr/support/page5.php"
    }
  ] as PortfolioItem[], // PortfolioItem 타입으로 단언(assertion)하여 타입 안정성을 보장
  // '고객 후기' 섹션에 사용될 데이터
  testimonials: [
    { id: 1, name: "김 준", role: "A 기업 ESG팀장", quote: "오픈더쉐어 덕분에 형식적인 봉사활동에서 벗어나, 우리 회사의 비전과 연결되는 의미 있는 사회공헌 프로그램을 진행할 수 있었습니다. 임직원들의 만족도가 매우 높았습니다." },
    { id: 2, name: "박 연", role: "B 기업 사회공헌 담당자", quote: "복잡하고 어려운 사회공헌 활동의 전 과정을 전문가가 알아서 처리해주니 정말 편했습니다. 소셜임팩트리포트의 퀄리티도 기대 이상이었습니다." },
    { id: 3, name: "이 호", role: "C 기업 프로그램 참가자", quote: "회사를 통해 이렇게 보람 있는 활동에 참여할 수 있어 좋았습니다. 동료들과 함께 땀 흘리며 나눔의 기쁨을 느낄 수 있었던 소중한 경험이었습니다." }
  ],
  // '주요 고객사' 섹션에 사용될 데이터
  partners: [
    { name: '대기업', logo: 'https://placehold.co/150x50/e2e8f0/475569?text=Samsung' },
    { name: '공기업', logo: 'https://placehold.co/150x50/e2e8f0/475569?text=KEPCO' },
    { name: '금융그룹', logo: 'https://placehold.co/150x50/e2e8f0/475569?text=KB+Financial' },
    { name: 'IT기업', logo: 'https://placehold.co/150x50/e2e8f0/475569?text=Naver' },
    { name: '건설사', logo: 'https://placehold.co/150x50/e2e8f0/475569?text=Hyundai+E%26C' },
    { name: '유통사', logo: 'https://placehold.co/150x50/e2e8f0/475569?text=Lotte' },
  ],
  // '자주 묻는 질문' 섹션에 사용될 데이터
  faqs: [
    { id: 1, question: "프로그램 견적은 어떻게 산정되나요?", answer: "프로그램 견적은 희망하시는 가용예산에 따라 상이하며 최대한 원하시는 예산에 맞추어 참여인원, 진행방식, 활동재료 등의 부분을 조율하여 산정됩니다. 자세한 내용은 견적 문의 구글폼을 제출해주시면 이메일 또는 유선으로 1:1 안내해드리고 있습니다." },
    { id: 2, question: "정해진 사회공헌 프로그램을 선택하는 방식인가요?", answer: "원하는 사회공헌 프로그램을 말씀해주시면 맞춤형으로 진행 가능한 커스터마이징 사회공헌 프로그램입니다. 기존 레퍼런스 외에도 귀사의 스토리가 담긴 새로운 사회공헌 프로그램 기획도 가능합니다." },
    { id: 3, question: "지방에서도 프로그램 진행이 가능한가요?", answer: "네, 전국 어디서나 프로그램 진행이 가능합니다. 지역의 특성과 상황을 고려한 맞춤형 프로그램을 기획하여 운영합니다." }
  ]
};
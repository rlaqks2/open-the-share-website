/**
 * @file types.ts
 * @description 애플리케이션 전체에서 재사용되는 공통 TypeScript 타입 정의를 포함합니다.
 */

export type PortfolioOrgType = '기업봉사' | '단체봉사';

export type PortfolioCategory =
  | '원데이메이킹'
  | '찾아가는 과학교실'
  | '스페이스 업사이클링'
  | '친환경 ESG'
  | '지역사회 나눔';

// 포트폴리오 아이템 객체의 데이터 구조를 정의하는 인터페이스
export interface PortfolioItem {
  id: number;                   // 고유 식별자
  logNo?: number;               // 네이버 블로그 포스트 고유 번호
  title: string;                // 프로젝트 제목
  category: PortfolioCategory | string; // 프로젝트 프로그램 분류
  orgType: PortfolioOrgType;    // 참여 유형 ('기업봉사' | '단체봉사')
  imageUrl: string;             // 대표 썸네일 이미지 URL
  galleryUrls?: string[];       // 현장 스케치 포토 갤러리 이미지 URL 목록
  partner: string;              // 협력 파트너사/단체 이름
  period: string;               // 프로젝트 진행 일자 (YYYY.MM.DD)
  year?: string;                // 진행 연도
  participants: number;         // 참여 인원 수
  tags?: string[];              // 해시태그 목록 (카카오 같이가치 / 해피빈 스타일)
  story: string;                // 프로젝트 상세 스토리
  blogLink?: string;            // 관련 네이버 블로그 원문 링크
}

export interface PartnerItem {
  name: string;
  logo: string;
  group: '기업' | '공공기관·재단' | '학교·교육기관' | '단체·NGO' | string;
  blogLink?: string;
}

export interface PressReleaseItem {
  id: number;
  title: string;
  date: string;
  source: string;
  category: string;
  summary: string;
  link: string;
}

/**
 * @file types.ts
 * @description 이 파일은 애플리케이션 전체에서 재사용되는 공통 TypeScript 타입 정의를 포함합니다.
 * 데이터의 구조를 명확하게 정의하여 코드의 안정성과 가독성을 높입니다.
 */

// 포트폴리오 아이템 객체의 데이터 구조를 정의하는 인터페이스
export interface PortfolioItem {
  id: number;           // 고유 식별자
  title: string;        // 프로젝트 제목
  category: string;     // 프로젝트 카테고리 (예: "IT 기업 연합")
  imageUrl: string;     // 대표 이미지 URL
  partner: string;      // 협력 파트너사 이름
  period: string;       // 프로젝트 진행 기간
  participants: number; // 참여 인원 수
  story: string;        // 프로젝트 상세 설명
}
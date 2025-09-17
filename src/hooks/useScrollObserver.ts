/**
 * @file useScrollObserver.ts
 * @description Intersection Observer API를 사용하는 커스텀 React 훅입니다.
 * 이 훅은 페이지 내의 특정 요소들(여기서는 <section> 태그)을 감시하다가,
 * 해당 요소가 화면에 일정 부분 이상 보이면 'is-visible'이라는 CSS 클래스를 추가합니다.
 * 이 클래스를 이용해 CSS 애니메이션(예: fade-in)을 트리거할 수 있습니다.
 * 한 번 활성화된 요소는 더 이상 감시하지 않아 성능을 최적화합니다.
 */
import { useEffect } from 'react';

export function useScrollObserver() {
  useEffect(() => {
    // IntersectionObserver 인스턴스 생성
    const observer = new IntersectionObserver(
      (entries) => {
        // 감시 대상 요소 배열을 순회
        entries.forEach(entry => {
          // entry.isIntersecting이 true이면 요소가 뷰포트와 교차(보임)했다는 의미
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible'); // 클래스 추가
            observer.unobserve(entry.target); // 한 번 보인 요소는 더 이상 감시하지 않음
          }
        });
      },
      { threshold: 0.1 } // 요소가 10% 이상 보였을 때 콜백 함수를 실행
    );

    // 페이지 내의 모든 <section> 요소를 선택하여 감시 대상으로 등록
    document.querySelectorAll('section').forEach(section => {
      section.classList.add('fade-in-section'); // 애니메이션 시작 전 초기 상태 클래스 추가
      observer.observe(section);
    });

    // 컴포넌트가 언마운트될 때 IntersectionObserver 연결을 정리(해제)하여 메모리 누수를 방지
    return () => observer.disconnect();
  }, []); // 빈 의존성 배열을 전달하여 컴포넌트가 처음 마운트될 때 한 번만 실행되도록 설정
}
/**
 * @file PortfolioSection.tsx
 * @description 회사가 수행한 프로젝트 '포트폴리오'를 그리드 형태로 보여주는 섹션 컴포넌트입니다.
 * 각 포트폴리오 아이템은 이미지, 제목, 카테고리를 포함한 카드로 표시됩니다.
 * '자세히 보기' 버튼을 클릭하면 해당 아이템의 상세 정보를 볼 수 있는 모달 창을 엽니다.
 * 이 모달을 여는 기능은 부모 컴포넌트로부터 받은 `onPortfolioItemClick` 콜백 함수를 통해 구현됩니다.
 */
import React from 'react';
import { PortfolioItem } from '../../types'; // 포트폴리오 아이템의 타입 정의

// PortfolioSection 컴포넌트가 받는 props의 타입을 정의
interface PortfolioSectionProps {
    data: PortfolioItem[];
    onPortfolioItemClick: (item: PortfolioItem) => void; // '자세히 보기' 클릭 시 실행될 함수
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ data, onPortfolioItemClick }) => {
    if (!data) return null;

    return (
        <section id="portfolio" className="py-20">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">포트폴리오</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* mockData.portfolioItems 배열을 순회하며 각 포트폴리오를 카드로 렌더링 */}
                    {data.map(item => (
                        <div key={item.id} className="group rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
                            {/* 이미지 영역: 마우스 오버 시 이미지가 확대되는 효과 적용 */}
                            <div className="h-64 overflow-hidden">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            {/* 콘텐츠 영역 */}
                            <div className="p-6 bg-white flex flex-col flex-grow">
                                <p className="text-sm font-semibold text-emerald-600 mb-1">{item.category}</p>
                                <h3 className="text-xl font-bold mb-4 flex-grow">{item.title}</h3>
                                {/* 클릭 시 onPortfolioItemClick 함수를 호출하며 현재 아이템 정보를 전달 */}
                                <button onClick={() => onPortfolioItemClick(item)} className="font-semibold text-slate-700 hover:text-emerald-700 transition-colors self-start">자세히 보기 &rarr;</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PortfolioSection;
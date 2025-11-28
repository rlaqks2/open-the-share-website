/**
 * @file ProgramsSection.tsx
 * @description 회사가 제공하는 '주요 사업 분야' 또는 프로그램 카테고리를 소개하는 섹션입니다.
 * 환경보호, 지역사회 기여 등 각 사업 분야를 나타내는 아이콘, 제목, 설명을 포함한
 * 카드 형태의 UI를 그리드 레이아웃으로 배열하여 사용자가 쉽게 파악할 수 있도록 합니다.
 */
import React from 'react';

interface ProgramsSectionProps {
    data: any[];
}

const ProgramsSection: React.FC<ProgramsSectionProps> = ({ data }) => {
    if (!data) return null;

    return (
        <section id="programs" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-12">주요 사업 분야</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* mockData.programs 배열을 순회하며 각 프로그램 정보를 카드로 렌더링 */}
                    {data.map((program: any) => (
                        <div key={program.id} className="text-center p-8 border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="text-5xl mb-4">{program.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                            <p className="text-slate-500">{program.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProgramsSection;
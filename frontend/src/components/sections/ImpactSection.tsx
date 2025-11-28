/**
 * @file ImpactSection.tsx
 * @description 회사의 '핵심 성과'를 시각적으로 강조하여 보여주는 섹션 컴포넌트입니다.
 * 누적 파트너사, 총 참여 임직원 등 중요한 통계 데이터를
 * 명확하고 인상적인 숫자 카드 형태로 표시하여 회사의 성과와 영향력을 전달합니다.
 * 데이터는 `mockData` 파일에서 가져와 동적으로 렌더링합니다.
 */
import React from 'react';

interface ImpactSectionProps {
    data: any[];
}

const ImpactSection: React.FC<ImpactSectionProps> = ({ data }) => {
    if (!data) return null;

    return (
        <section id="impact" className="py-20 bg-pattern">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-2">핵심 성과</h2>
                <p className="text-slate-600 mb-12">숫자로 증명하는 오픈더쉐어의 임팩트</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* mockData.impactStats 배열을 순회하며 각 통계 데이터를 카드로 렌더링 */}
                    {data.map((stat: any) => (
                        <div key={stat.id} className="bg-white p-8 rounded-2xl shadow-lg">
                            <p className="text-4xl font-extrabold text-emerald-600 mb-2">{stat.value}</p>
                            <p className="font-semibold text-slate-700">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImpactSection;
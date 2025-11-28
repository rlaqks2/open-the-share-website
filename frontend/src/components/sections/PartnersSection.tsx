/**
 * @file PartnersSection.tsx
 * @description '주요 고객사' 또는 파트너사의 로고를 나열하여 보여주는 섹션 컴포넌트입니다.
 * 다양한 기업들과 협력 관계를 맺고 있음을 시각적으로 보여줌으로써
 * 사회적 증거(social proof)를 제시하고 잠재 고객에게 신뢰감을 줍니다.
 * 로고는 흑백으로 표시되다가 마우스를 올리면 컬러로 바뀌는 효과가 적용됩니다.
 */
import React from 'react';

interface PartnersSectionProps {
    data: any[];
}

const PartnersSection: React.FC<PartnersSectionProps> = ({ data }) => {
    if (!data) return null;

    return (
        <section id="partners" className="py-20">
            <div className="max-w-5xl mx-auto px-4">
                <h2 className="text-center text-2xl font-bold mb-10">주요 고객사</h2>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
                    {/* mockData.partners 배열을 순회하며 각 파트너사 로고 이미지를 렌더링 */}
                    {data.map((partner: any, index: number) => (
                        <img key={index} src={partner.logo} alt={partner.name} className="h-10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PartnersSection;
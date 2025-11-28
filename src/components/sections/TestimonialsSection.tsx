/**
 * @file TestimonialsSection.tsx
 * @description '고객 후기'를 보여주는 섹션 컴포넌트입니다.
 * 서비스를 이용한 고객이나 파트너사의 긍정적인 평가를 카드 기반 레이아웃으로 표시하여
 * 회사의 신뢰도와 전문성을 강조합니다. 각 카드에는 인용문, 작성자 이름,
 * 그리고 작성자의 소속/직책이 포함됩니다.
 */
import React from 'react';

interface TestimonialsSectionProps {
    data: any[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ data }) => {
    if (!data) return null;

    return (
        <section id="testimonials" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">고객 후기</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* mockData.testimonials 배열을 순회하며 각 후기를 카드로 렌더링 */}
                    {data.map((item: any) => (
                        <div key={item.id} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
                            <p className="text-slate-600 mb-6">"{item.quote}"</p>
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-sm text-slate-500">{item.role}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
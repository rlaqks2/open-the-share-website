/**
 * @file ProcessSection.tsx
 * @description '프로그램 진행 절차'를 시각적으로 보여주는 섹션 컴포넌트입니다.
 * 컨설팅부터 결과 보고까지, 사회공헌 프로그램이 실행되는 각 단계를
 * 수직 타임라인 형태의 레이아웃으로 표현하여 사용자가 프로세스를
 * 순차적으로 쉽게 이해할 수 있도록 돕습니다.
 */
import React from 'react';

interface ProcessSectionProps {
    data: any[];
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ data }) => {
    if (!data) return null;

    return (
        <section id="process" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">프로그램 진행 절차</h2>
                <div className="relative">
                    {/* 중앙 타임라인 선 (데스크톱 뷰에서만 보임) */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-5 w-1 h-full bg-slate-200"></div>
                    {/* mockData.processSteps 배열을 순회하며 각 단계를 렌더링 */}
                    {data.map((step: any, index: number) => (
                        <div key={step.id} className={`flex md:items-center mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                            {/* 타임라인 좌/우 공간 분할을 위한 빈 div (데스크톱 뷰) */}
                            <div className="hidden md:block w-1/2"></div>
                            {/* 타임라인 원형 마커 (데스크톱 뷰) */}
                            <div className="hidden md:block relative">
                                <div className="absolute w-8 h-8 bg-emerald-600 rounded-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center justify-center text-white font-bold">{step.id}</div>
                            </div>
                            {/* 단계별 설명 카드 */}
                            <div className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-md border border-slate-200">
                                <h3 className="text-xl font-bold mb-2 text-emerald-700">{step.title}</h3>
                                <p className="text-slate-600">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
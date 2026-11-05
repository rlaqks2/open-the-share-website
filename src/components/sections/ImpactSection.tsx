/**
 * @file ImpactSection.tsx
 * @description 오픈더쉐어의 실제 포트폴리오 및 참여기관 파트너십 성과를 동적으로 집계하여 보여주는 섹션입니다.
 */
import React from 'react';
import { mockData } from '../../data/mockData';

const ImpactSection: React.FC = () => {
    const partnerCount = mockData.partners.length;
    const portfolioCount = mockData.portfolioItems.length;

    const dynamicStats = mockData.impactStats.map((stat) => {
        if (stat.id === 1) {
            return { ...stat, value: `${partnerCount}+` };
        }
        if (stat.id === 2) {
            return { ...stat, value: `${portfolioCount}+` };
        }
        return stat;
    });

    return (
        <section id="impact" className="py-20 bg-emerald-900 text-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-extrabold mb-3">
                        SOCIAL IMPACT DATA
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black mb-2 break-keep">
                        숫자로 보는 오픈더쉐어의 임팩트
                    </h2>
                    <p className="text-emerald-200 text-sm md:text-base break-keep">
                        공식 홈페이지 및 블로그에 기록된 기업·단체 사회공헌 캠페인 및 참여기관 데이터입니다.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dynamicStats.map((stat) => (
                        <div
                            key={stat.id}
                            className="bg-white/10 backdrop-blur-sm border border-white/15 p-7 rounded-3xl text-center hover:bg-white/15 transition-colors min-w-0"
                        >
                            <p className="text-4xl md:text-5xl font-black text-amber-300 mb-2 whitespace-nowrap">
                                {stat.value}
                            </p>
                            <p className="font-extrabold text-white text-base sm:text-lg mb-1 break-keep">
                                {stat.label}
                            </p>
                            {stat.sub && <p className="text-xs text-emerald-200 break-keep">{stat.sub}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImpactSection;

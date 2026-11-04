/**
 * @file ProcessSection.tsx
 * @description openthe.kr의 4단계 진행 프로세스(STEP 01 사전 수요조사 ~ STEP 04 물품 기부 및 리포트)를 보여주는 컴포넌트입니다.
 */
import React from 'react';
import { mockData } from '../../data/mockData';

const ProcessSection: React.FC = () => {
    return (
        <section id="process" className="py-24 bg-[#F8FAF9] border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold mb-3">
                        4-STEP WORKFLOW
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 break-keep">
                        프로그램 진행 프로세스
                    </h2>
                    <p className="text-slate-600 text-base break-keep">
                        사전 수요조사부터 맞춤형 기획, 현장 진행, 기부 전달 및 소셜 임팩트 리포트 제공까지 체계적으로 함께합니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mockData.processSteps.map((step) => (
                        <div
                            key={step.id}
                            className="relative bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-400 transition-colors min-w-0"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-5">
                                    <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold whitespace-nowrap">
                                        {step.step}
                                    </span>
                                    <span className="text-2xl font-black text-slate-200 whitespace-nowrap">0{step.id}</span>
                                </div>
                                <h3 className="text-lg font-extrabold text-slate-900 mb-3 break-keep">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed break-keep">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;

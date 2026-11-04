/**
 * @file AboutSection.tsx
 * @description openthe.kr의 '회사소개(About Us)' 실제 콘텐츠를 반영한 섹션입니다.
 * - 철학("평범함 속 위대함의 가치" & 더글러스 맥아더 명언)
 * - 미션 & 비전
 * - 핵심가치 O.P.E.N (Opportunity, Prosperity, Equality, Neighborhood)
 * - 오픈더쉐어의 3대 가치(Value) 및 기업 담당자 맞춤 솔루션
 * - 공식 CI 소개 (openthe.kr 원본 ci.png 적용)
 */
import React from 'react';
import { mockData } from '../../data/mockData';
import ciImg from '../../assets/ci.png';

const AboutSection: React.FC = () => {
    const { about } = mockData;

    return (
        <section id="about" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 space-y-20">
                {/* 1. 메인 인사말 & 철학 */}
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 min-w-0">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold mb-3">
                            ABOUT OPEN THE SHARE
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight leading-snug break-keep">
                            {about.title}
                        </h2>
                        <p className="text-lg font-bold text-emerald-700 mb-6 break-keep">
                            “{about.subtitle}”
                        </p>
                        <p className="text-slate-600 leading-relaxed mb-8 whitespace-pre-line text-base break-keep">
                            {about.description}
                        </p>

                        {/* 3대 핵심 밸류 포인트 */}
                        <div className="grid sm:grid-cols-3 gap-4">
                            {about.features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="p-5 rounded-2xl bg-[#F8FAF9] border border-emerald-100/80 min-w-0"
                                >
                                    <div className="text-2xl mb-2">{feature.icon}</div>
                                    <h3 className="font-extrabold text-slate-900 text-sm mb-1.5 break-keep">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed break-keep">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 우측 명언 & 미션/비전 카드 */}
                    <div className="lg:col-span-5 space-y-5 min-w-0">
                        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                            <div className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest mb-3">
                                OUR PHILOSOPHY
                            </div>
                            <blockquote className="text-base md:text-lg font-bold leading-relaxed mb-4 text-slate-100 break-keep">
                                “{about.quote.text}”
                            </blockquote>
                            <cite className="text-xs text-emerald-300 not-italic font-semibold block break-keep">
                                — {about.quote.author}
                            </cite>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-6 rounded-3xl bg-emerald-600 text-white">
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">
                                    MISSION
                                </span>
                                <h3 className="text-base font-black mt-1 mb-2">미션</h3>
                                <p className="text-xs text-emerald-50 leading-relaxed break-keep">{about.mission}</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-amber-500 text-white">
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-100">
                                    VISION
                                </span>
                                <h3 className="text-base font-black mt-1 mb-2">비전</h3>
                                <p className="text-xs text-amber-50 leading-relaxed break-keep">{about.vision}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. 핵심가치 O.P.E.N */}
                <div className="bg-[#F8FAF9] rounded-3xl p-8 md:p-12 border border-slate-200/70">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">
                            CORE VALUES
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 break-keep">
                            오픈더쉐어의 4대 핵심가치 <span className="text-emerald-600">O.P.E.N</span>
                        </h3>
                        <p className="text-sm text-slate-500 mt-2 break-keep">
                            다양한 분야의 문제를 발굴하고 재미있는 요소를 결합해 지속 가능한 나눔 문화를 만듭니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {about.coreValues.map((cv) => (
                            <div
                                key={cv.letter}
                                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:border-emerald-400 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center mb-4 shadow-sm">
                                    {cv.letter}
                                </div>
                                <div className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
                                    {cv.word}
                                </div>
                                <h4 className="text-lg font-extrabold text-slate-900 mt-0.5 mb-2 break-keep">
                                    {cv.title}
                                </h4>
                                <p className="text-xs text-slate-500 leading-relaxed break-keep">{cv.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. 기업 담당자의 고민 해결 & 공식 CI 소개 */}
                <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                    {/* 이런 고민을 가진 파트너와 함께합니다 */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between min-w-0">
                        <div>
                            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
                                FOR CSR · ESG MANAGERS
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 mb-6 break-keep">
                                이런 고민을 가진 기업·단체와 함께합니다
                            </h3>
                            <div className="grid grid-cols-1 gap-3.5">
                                {about.personaNeeds.map((persona, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-100 min-w-0"
                                    >
                                        <div className="flex items-start sm:items-center gap-3 min-w-0">
                                            <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-xs whitespace-nowrap shrink-0">
                                                {persona.role}
                                            </span>
                                            <p className="text-sm font-bold text-slate-700 leading-snug break-keep min-w-0">
                                                “{persona.worry}”
                                            </p>
                                        </div>
                                        <span className="self-start sm:self-auto text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                                            #{persona.tag}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-6 break-keep">
                            * 오픈더쉐어는 사전 컨설팅부터 물품 제작, 현장 진행, 기부처 전달, 결과 보고까지 원스톱 솔루션을 제공합니다.
                        </p>
                    </div>

                    {/* 공식 CI 소개 (openthe.kr 원본 ci.png 적용) */}
                    <div className="lg:col-span-5 bg-white rounded-3xl p-7 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between min-w-0">
                        <div>
                            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
                                CORPORATE IDENTITY
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 mb-3 break-keep">
                                오픈더쉐어 CI 소개
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 break-keep">
                                {about.ciDescription}
                            </p>
                        </div>
                        <div className="bg-[#F8FAF9] rounded-2xl p-4 sm:p-6 border border-slate-100 flex items-center justify-center overflow-hidden">
                            <img
                                src={ciImg}
                                alt="오픈더쉐어 공식 CI (Open The Share)"
                                className="w-full max-w-[360px] h-auto object-contain rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;

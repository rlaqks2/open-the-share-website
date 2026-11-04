/**
 * @file ProgramsSection.tsx
 * @description openthe.kr의 사업소개(대면 사회공헌 '온앤온' & 비대면 사회공헌 '온팅') 원본 아이콘(b_onnon.png, b_onting.png)과
 * 4대 핵심 콘텐츠 영역, 그리고 실제 프로그램 옵션 구성(BASIC / 옵션 A / 옵션 B / 옵션 C)을 보여주는 섹션입니다.
 */
import React from 'react';
import { mockData } from '../../data/mockData';
import onnonIcon from '../../assets/b_onnon.png';
import ontingIcon from '../../assets/b_onting.png';

const ProgramsSection: React.FC = () => {
    const { flagshipBrands, programs, programOptions } = mockData;

    return (
        <section id="programs" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 space-y-20">
                {/* 섹션 헤더 */}
                <div className="text-center max-w-3xl mx-auto">
                    <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold mb-3">
                        OUR PROGRAMS · 온앤온 &amp; 온팅
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4 break-keep">
                        기업 맞춤형 대면 · 비대면 사회공헌 프로그램
                    </h2>
                    <p className="text-slate-600 text-base break-keep">
                        다양한 기업 및 단체의 특성과 ESG 목표에 맞추어 오프라인 현장 봉사활동(온앤온)부터
                        온라인·핸즈온 기부키트 봉사활동(온팅)까지 폭넓은 솔루션을 제공합니다.
                    </p>
                </div>

                {/* 1. 대표 브랜드 2종 (온앤온 ON&ON / 온팅 ON-ting - 깨진 한자 제거 & 공식 아이콘 적용) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {flagshipBrands.map((brand, idx) => {
                        const isOnAndOn = idx === 0;
                        const brandIcon = isOnAndOn ? onnonIcon : ontingIcon;
                        return (
                            <div
                                key={brand.id}
                                className={`rounded-3xl p-7 sm:p-9 border-2 flex flex-col justify-between min-w-0 ${
                                    isOnAndOn
                                        ? 'bg-gradient-to-br from-emerald-50/70 to-white border-emerald-200'
                                        : 'bg-gradient-to-br from-amber-50/70 to-white border-amber-200'
                                }`}
                            >
                                <div>
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                                        <span
                                            className={`px-3.5 py-1 rounded-full text-xs font-extrabold whitespace-nowrap ${
                                                isOnAndOn
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-amber-500 text-white'
                                            }`}
                                        >
                                            {brand.badge}
                                        </span>
                                        <img
                                            src={brandIcon}
                                            alt={`${brand.name} 공식 아이콘`}
                                            className="w-14 h-14 object-contain shrink-0"
                                        />
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 break-keep">
                                        {brand.name}
                                    </h3>
                                    <p
                                        className={`text-sm font-extrabold mb-4 break-keep ${
                                            isOnAndOn ? 'text-emerald-700' : 'text-amber-700'
                                        }`}
                                    >
                                        “{brand.meaning}”
                                    </p>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-6 break-keep">
                                        {brand.description}
                                    </p>
                                </div>

                                {/* 강점 포인트 */}
                                <div className="pt-5 border-t border-slate-200/70">
                                    <h4 className="text-xs font-extrabold text-slate-500 mb-2.5">
                                        프로그램 핵심 강점
                                    </h4>
                                    <ul className="space-y-2">
                                        {brand.strengths.map((str, i) => (
                                            <li key={i} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2 break-keep">
                                                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                                                <span>{str}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 2. 4대 핵심 콘텐츠 분야 */}
                <div>
                    <h3 className="text-2xl font-black text-slate-900 text-center mb-8 break-keep">
                        4대 핵심 사회공헌 콘텐츠
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {programs.map((program) => (
                            <div
                                key={program.id}
                                className="p-7 bg-[#F8FAF9] border border-slate-200/80 rounded-3xl hover:border-emerald-400 hover:shadow-md transition-all min-w-0"
                            >
                                <div className="text-4xl mb-4">{program.icon}</div>
                                <span className="inline-block text-[11px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-md mb-2 whitespace-nowrap">
                                    {program.subtitle}
                                </span>
                                <h4 className="text-lg font-extrabold text-slate-900 mb-2 break-keep">
                                    {program.title}
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed break-keep">
                                    {program.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. 프로그램 옵션 구성 (openthe.kr/yc/sub/sub2_1.php 실 데이터) */}
                <div className="bg-slate-900 text-white rounded-3xl p-7 sm:p-10 md:p-12">
                    <div className="max-w-2xl mb-8">
                        <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
                            PROGRAM OPTIONS
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black mt-1 mb-2 break-keep">
                            프로그램 기본 제공 및 선택 옵션 안내
                        </h3>
                        <p className="text-sm text-slate-300 break-keep">
                            모든 프로그램에는 BASIC 패키지가 기본 포함되며, 기업의 필요에 따라 맞춤형 옵션을 추가하실 수 있습니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {programOptions.map((opt) => (
                            <div
                                key={opt.option}
                                className={`rounded-2xl p-6 border min-w-0 ${
                                    opt.option === 'BASIC'
                                        ? 'bg-emerald-600/20 border-emerald-400'
                                        : 'bg-white/5 border-white/10'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <span
                                        className={`px-2.5 py-1 rounded-md text-xs font-extrabold whitespace-nowrap ${
                                            opt.option === 'BASIC'
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-white/15 text-emerald-300'
                                        }`}
                                    >
                                        {opt.option}
                                    </span>
                                    <span className="text-xs font-bold text-slate-300 whitespace-nowrap">{opt.type}</span>
                                </div>
                                <p className="text-sm text-slate-200 leading-relaxed font-medium break-keep">
                                    {opt.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProgramsSection;

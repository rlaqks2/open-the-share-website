/**
 * @file HeroSection.tsx
 * @description 웹사이트의 메인 히어로 섹션 컴포넌트입니다.
 * 오픈더쉐어(https://openthe.kr/)의 공식 슬로건("더 나은 사회를 위한 고민, 오픈더쉐어가 함께합니다")과
 * 대표 대면/비대면 사회공헌 브랜드(온앤온 / 온팅) 원본 아이콘,
 * 그리고 카카오 같이가치 / 네이버 해피빈 감성의 최신 스토리텔링 카드를 함께 배치합니다.
 */
import React from 'react';
import { mockData } from '../../data/mockData';
import onnonIcon from '../../assets/b_onnon.png';
import ontingIcon from '../../assets/b_onting.png';

interface HeroSectionProps {
    onInquiryClick: () => void;
    onPortfolioPageClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onInquiryClick, onPortfolioPageClick }) => {
    const { hero, portfolioItems } = mockData;
    const latestItems = [...portfolioItems]
        .sort((a, b) => b.period.localeCompare(a.period))
        .slice(0, 3);

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F1F8F5] via-[#F8FAF9] to-white pt-12 pb-20 border-b border-slate-100">
            {/* 배경 데코레이션 */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
            <div className="absolute top-40 -left-24 w-80 h-80 rounded-full bg-amber-200/25 blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-12 items-center">
                    {/* 좌측 메인 카피 영역 */}
                    <div className="lg:col-span-7 text-left min-w-0">
                        <div className="inline-flex flex-wrap items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-emerald-200 shadow-sm text-emerald-700 text-xs font-extrabold mb-6">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] whitespace-nowrap">
                                CSR · ESG PARTNER
                            </span>
                            <span className="break-keep">{hero.badge}</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl xl:text-[46px] font-black text-slate-900 leading-[1.3] sm:leading-[1.32] tracking-tight mb-7 break-keep">
                            더 나은 사회를 위한 고민,
                            <span className="block mt-1 sm:mt-1.5 text-emerald-600">
                                오픈더쉐어가 함께합니다
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl break-keep">
                            {hero.subtitle}
                        </p>

                        {/* 핵심 키워드 태그 */}
                        <div className="flex flex-wrap gap-2 mb-9">
                            {hero.keywords.map((kw, idx) => (
                                <span
                                    key={idx}
                                    className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold shadow-sm whitespace-nowrap"
                                >
                                    {kw.startsWith('#') ? kw : `#${kw}`}
                                </span>
                            ))}
                        </div>

                        {/* CTA 버튼 그룹 */}
                        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5">
                            <button
                                onClick={onInquiryClick}
                                className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-extrabold px-7 py-4 rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 text-sm sm:text-base whitespace-nowrap shrink-0"
                            >
                                <span>파트너십 · 맞춤 프로그램 문의</span>
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.5"
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={onPortfolioPageClick}
                                className="inline-flex items-center justify-center gap-2 bg-white text-slate-800 border-2 border-slate-200 font-extrabold px-6 py-4 rounded-full hover:border-emerald-500 hover:text-emerald-600 transition-all text-sm sm:text-base whitespace-nowrap shrink-0"
                            >
                                <span>포트폴리오 아카이브 ({portfolioItems.length}건)</span>
                            </button>
                        </div>
                    </div>

                    {/* 우측 브랜드 & 최신 스토리 카드 */}
                    <div className="lg:col-span-5 space-y-4 min-w-0">
                        {/* 대표 프로그램 2종 요약 카드 (공식 아이콘 적용 & 깨진 한자 제거) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-2.5">
                                    <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold whitespace-nowrap">
                                        대면 사회공헌
                                    </span>
                                    <img
                                        src={onnonIcon}
                                        alt="온앤온 공식 아이콘"
                                        className="w-9 h-9 object-contain shrink-0"
                                    />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 whitespace-nowrap">
                                    온앤온 <span className="text-xs font-extrabold text-emerald-600">ON&amp;ON</span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed break-keep">
                                    따뜻한 온기를 켜다! 기업 맞춤형 오프라인 참여 봉사활동
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-2.5">
                                    <span className="inline-block px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-extrabold whitespace-nowrap">
                                        비대면 사회공헌
                                    </span>
                                    <img
                                        src={ontingIcon}
                                        alt="온팅 공식 아이콘"
                                        className="w-9 h-9 object-contain shrink-0"
                                    />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 whitespace-nowrap">
                                    온팅 <span className="text-xs font-extrabold text-amber-600">ON-ting</span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed break-keep">
                                    언제 어디서나 따뜻한 만남! DIY 기부키트·온라인 봉사활동
                                </p>
                            </div>
                        </div>

                        {/* 최근 진행 캠페인 라이브 피드 카드 */}
                        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-4">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider truncate">
                                        최근 OPEN THE SHARE 스토리
                                    </span>
                                </div>
                                <button
                                    onClick={onPortfolioPageClick}
                                    className="text-xs font-bold text-emerald-600 hover:underline whitespace-nowrap shrink-0"
                                >
                                    전체보기 &rarr;
                                </button>
                            </div>

                            <div className="space-y-3">
                                {latestItems.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={onPortfolioPageClick}
                                        className="group flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer min-w-0"
                                    >
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100 bg-slate-100"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5 mb-0.5 min-w-0">
                                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 whitespace-nowrap shrink-0">
                                                    {item.orgType}
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-medium truncate">
                                                    {item.partner}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors truncate">
                                                {item.title}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5 whitespace-nowrap">
                                                {item.period}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

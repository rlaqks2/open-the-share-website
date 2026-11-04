/**
 * @file PortfolioSection.tsx
 * @description 메인 페이지의 '함께 만든 변화(포트폴리오)' 프리뷰 섹션입니다.
 * 카카오 같이가치 / 네이버 해피빈 감성의 카드 그리드와 빠른 분류 탭을 제공하며,
 * '전체 포트폴리오 페이지로 이동' 버튼을 통해 별도의 페이지네이션 화면(PortfolioPage)으로 연결합니다.
 */
import React, { useState, useMemo } from 'react';
import { mockData } from '../../data/mockData';
import { PortfolioItem } from '../../types';

interface PortfolioSectionProps {
    onPortfolioItemClick: (item: PortfolioItem) => void;
    onViewAllClick: (initialFilter?: string) => void;
}

const ORG_TABS: { key: string; label: string; badge: string }[] = [
    { key: 'all', label: '전체 스토리', badge: '97' },
    { key: 'ots', label: 'OPEN THE SHARE 최신', badge: '21' },
    { key: '기업봉사', label: '기업 CSR · ESG 봉사', badge: '기업' },
    { key: '단체봉사', label: '공공기관 · 대학 · 단체봉사', badge: '단체' },
];

const getOrgBadgeStyle = (item: PortfolioItem) => {
    if (item.id <= 21) {
        return 'bg-emerald-600 text-white';
    }
    return item.orgType === '기업봉사'
        ? 'bg-sky-600 text-white'
        : 'bg-amber-500 text-white';
};

const getCategoryPillStyle = (category: string) => {
    switch (category) {
        case '친환경 ESG':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case '찾아가는 과학교실':
            return 'bg-amber-50 text-amber-700 border-amber-200';
        case '지역사회 나눔':
            return 'bg-rose-50 text-rose-700 border-rose-200';
        case '원데이메이킹':
            return 'bg-indigo-50 text-indigo-700 border-indigo-200';
        default:
            return 'bg-teal-50 text-teal-700 border-teal-200';
    }
};

const PortfolioSection: React.FC<PortfolioSectionProps> = ({
    onPortfolioItemClick,
    onViewAllClick,
}) => {
    const [activeTab, setActiveTab] = useState<string>('all');

    const filteredList = useMemo(() => {
        if (activeTab === 'all') return mockData.portfolioItems;
        if (activeTab === 'ots') return mockData.portfolioItems.filter((item) => item.id <= 21);
        return mockData.portfolioItems.filter((item) => item.orgType === activeTab);
    }, [activeTab]);

    const previewItems = useMemo(() => filteredList.slice(0, 6), [filteredList]);
    const totalCount = filteredList.length;

    return (
        <section id="portfolio" className="py-24 bg-[#F8FAF9]">
            <div className="max-w-7xl mx-auto px-4">
                {/* 상단 헤더 영역 */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold mb-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                            <span className="break-keep">OPEN THE SHARE ARCHIVE · 공식 블로그 실데이터</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight break-keep">
                            참여기관과 함께 만든 <span className="text-emerald-600">나눔 스토리</span>
                        </h2>
                        <p className="text-slate-600 mt-2 text-base md:text-lg break-keep">
                            오픈더쉐어(OPEN THE SHARE) 및 기업·단체가 직접 참여한 {mockData.portfolioItems.length}건의 실제 사회공헌 현장 기록입니다.
                        </p>
                    </div>
                    <button
                        onClick={() => onViewAllClick(activeTab)}
                        className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-emerald-600 transition-colors shadow-sm whitespace-nowrap shrink-0"
                    >
                        <span>포트폴리오 전체보기 ({mockData.portfolioItems.length}건)</span>
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* 분류 필터 탭 */}
                <div className="flex flex-wrap items-center gap-2.5 mb-10">
                    {ORG_TABS.map((tab) => {
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                                    isActive
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}
                                >
                                    {tab.badge}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* 카드 그리드 (6개 프리뷰) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {previewItems.map((item) => (
                        <article
                            key={item.id}
                            onClick={() => onPortfolioItemClick(item)}
                            className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer min-w-0"
                        >
                            {/* 썸네일 영역 */}
                            <div className="relative h-56 overflow-hidden bg-slate-100">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                {/* 좌측 상단 구분 배지 */}
                                <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5 pr-3">
                                    {item.id <= 21 && (
                                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white shadow-sm whitespace-nowrap">
                                            OPEN THE SHARE
                                        </span>
                                    )}
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-sm whitespace-nowrap ${getOrgBadgeStyle(
                                            item
                                        )}`}
                                    >
                                        {item.orgType}
                                    </span>
                                </div>

                                {/* 우측 하단 현장 사진 수 배지 */}
                                {item.galleryUrls && item.galleryUrls.length > 1 && (
                                    <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span>+{item.galleryUrls.length}</span>
                                    </div>
                                )}
                            </div>

                            {/* 카드 본문 */}
                            <div className="p-6 flex flex-col flex-grow min-w-0">
                                {/* 카테고리 및 날짜 */}
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <span
                                        className={`text-xs font-bold px-2.5 py-1 rounded-md border whitespace-nowrap ${getCategoryPillStyle(
                                            item.category
                                        )}`}
                                    >
                                        {item.category}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap shrink-0">
                                        {item.period}
                                    </span>
                                </div>

                                {/* 제목 */}
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2.5 leading-snug break-keep">
                                    {item.title}
                                </h3>

                                {/* 본문 요약 */}
                                <p className="text-sm text-slate-500 line-clamp-2 mb-5 leading-relaxed flex-grow break-keep">
                                    {item.story}
                                </p>

                                {/* 하단 파트너 & 더보기 */}
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs min-w-0">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                                            🤝
                                        </span>
                                        <span className="font-bold text-slate-700 truncate" title={item.partner}>
                                            {item.partner}
                                        </span>
                                    </div>
                                    <span className="font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform whitespace-nowrap shrink-0">
                                        스토리 보기 &rarr;
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* 하단 전체 페이지 이동 배너 */}
                <div className="mt-12 bg-white rounded-3xl p-6 md:p-8 border border-emerald-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shrink-0">
                            🌱
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-lg font-extrabold text-slate-900 break-keep">
                                더 많은 기업·단체 봉사활동 사례가 궁금하신가요?
                            </h3>
                            <p className="text-sm text-slate-500 mt-0.5 break-keep">
                                연도별, 테마별 검색과 페이지 넘김 기능이 제공되는 전용 포트폴리오 아카이브에서 총 {totalCount}건의 스토리를 확인해 보세요.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => onViewAllClick(activeTab)}
                        className="w-full sm:w-auto shrink-0 whitespace-nowrap px-7 py-3.5 rounded-full bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                        포트폴리오 전용 페이지 열기 &rarr;
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PortfolioSection;

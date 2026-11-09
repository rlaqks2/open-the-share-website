/**
 * @file PortfolioSection.tsx
 * @description 메인 페이지의 '함께 만든 변화(포트폴리오)' 프리뷰 섹션입니다.
 * 카카오 같이가치 / 네이버 해피빈 감성의 카드 그리드와 빠른 분류 탭을 제공하며,
 * '전체 포트폴리오 페이지로 이동' 버튼을 통해 별도의 페이지네이션 화면(PortfolioPage)으로 연결합니다.
 */
import React, { useState, useMemo } from 'react';
import { mockData } from '../../data/mockData';
import { PortfolioItem } from '../../types';
import { clickableProps } from '../../utils/a11y';

interface PortfolioSectionProps {
    onPortfolioItemClick: (item: PortfolioItem) => void;
    onViewAllClick: (initialFilter?: string) => void;
}

const isOTSItem = (item: PortfolioItem) => item.period >= '2025.01.01';

const getOrgBadgeStyle = (item: PortfolioItem) => {
    if (isOTSItem(item)) {
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

    const totalCount = mockData.portfolioItems.length;
    const otsCount = useMemo(() => mockData.portfolioItems.filter(isOTSItem).length, []);
    const corpCount = useMemo(() => mockData.portfolioItems.filter((i) => i.orgType === '기업봉사').length, []);
    const groupCount = useMemo(() => mockData.portfolioItems.filter((i) => i.orgType === '단체봉사').length, []);

    const orgTabs = useMemo(() => [
        { key: 'all', label: '전체 스토리', badge: String(totalCount) },
        { key: 'ots', label: 'OPEN THE SHARE 최신', badge: String(otsCount) },
        { key: '기업봉사', label: '기업 CSR · ESG 봉사', badge: String(corpCount) },
        { key: '단체봉사', label: '공공기관 · 대학 · 단체봉사', badge: String(groupCount) },
    ], [totalCount, otsCount, corpCount, groupCount]);

    const filteredList = useMemo(() => {
        let list = mockData.portfolioItems;
        if (activeTab === 'ots') {
            list = list.filter(isOTSItem);
        } else if (activeTab !== 'all') {
            list = list.filter((item) => item.orgType === activeTab);
        }
        // 항상 최신 일자(period) 기준 내림차순 정렬
        return [...list].sort((a, b) => b.period.localeCompare(a.period));
    }, [activeTab]);

    const previewItems = useMemo(() => filteredList.slice(0, 6), [filteredList]);

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
                            오픈더쉐어(OPEN THE SHARE) 및 기업·단체가 직접 참여한 {totalCount}건의 실제 사회공헌 현장 기록입니다.
                        </p>
                    </div>
                    <button
                        onClick={() => onViewAllClick(activeTab)}
                        className="self-start md:self-auto inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-emerald-600 transition-colors shadow-sm whitespace-nowrap shrink-0"
                    >
                        <span>포트폴리오 전체보기 ({totalCount}건)</span>
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* 분류 필터 탭 */}
                <div className="flex flex-wrap items-center gap-2.5 mb-10">
                    {orgTabs.map((tab) => {
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
                            {...clickableProps(() => onPortfolioItemClick(item), `${item.title} 상세 보기`)}
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
                                    {isOTSItem(item) && (
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

                            {/* 카드 본문 콘텐츠 */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    {/* 상단 메타 (테마 칩 + 진행일자) */}
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-lg text-xs font-extrabold border whitespace-nowrap ${getCategoryPillStyle(
                                                item.category
                                            )}`}
                                        >
                                            {item.category}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-600 tracking-tight whitespace-nowrap">
                                            {item.period}
                                        </span>
                                    </div>

                                    {/* 파트너명 */}
                                    <p className="text-xs font-black text-emerald-800 tracking-wide uppercase mb-1 line-clamp-1 break-keep">
                                        {item.partner}
                                    </p>

                                    {/* 활동 제목 */}
                                    <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors break-keep">
                                        {item.title}
                                    </h3>

                                    {/* 활동 스토리 요약 */}
                                    <p className="text-slate-600 text-xs sm:text-sm mt-2.5 line-clamp-2 leading-relaxed break-keep">
                                        {item.story}
                                    </p>
                                </div>

                                {/* 하단 자세히 보기 유도 */}
                                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-emerald-800">
                                    <span className="whitespace-nowrap">현장 스토리 & 갤러리</span>
                                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* 하단 전체보기 유도 배너 */}
                <div className="mt-14 text-center">
                    <button
                        onClick={() => onViewAllClick(activeTab)}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white border-2 border-slate-900 text-slate-900 font-extrabold hover:bg-slate-900 hover:text-white transition-all shadow-sm hover:shadow-md text-sm md:text-base whitespace-nowrap"
                    >
                        <span>참여기관 사회공헌 전체 포트폴리오 둘러보기 ({totalCount}건)</span>
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PortfolioSection;

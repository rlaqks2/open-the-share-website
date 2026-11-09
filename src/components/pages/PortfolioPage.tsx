/**
 * @file PortfolioPage.tsx
 * @description 카카오 같이가치 및 네이버 해피빈 스타일을 참고하여 설계된
 * 오픈더쉐어 전용 포트폴리오 아카이브 페이지 컴포넌트입니다.
 * 포트폴리오 데이터가 계속 늘어나는 구조에 맞춰 다중 필터(기업/단체/OPEN THE SHARE/테마/연도),
 * 실시간 검색, 그리고 번호형 페이지네이션(Pagination) 기능을 제공합니다.
 */
import React, { useState, useMemo, useEffect } from 'react';
import { mockData } from '../../data/mockData';
import { PortfolioItem } from '../../types';
import { clickableProps } from '../../utils/a11y';

interface PortfolioPageProps {
    onPortfolioItemClick: (item: PortfolioItem) => void;
    onBackToHome: () => void;
    onInquiryClick: () => void;
    initialFilter?: string;
}

const ORG_TABS = [
    { id: 'all', label: '전체 스토리', badge: 'ALL' },
    { id: 'ots', label: 'OPEN THE SHARE', badge: '최신' },
    { id: '기업봉사', label: '기업 사회공헌', badge: 'CSR·ESG' },
    { id: '단체봉사', label: '단체·학교 봉사', badge: 'GROUP' },
];

const CATEGORY_CHIPS = [
    { id: 'all', label: '전체 테마', icon: '🌈' },
    { id: '원데이메이킹', label: '원데이메이킹 (온앤온·온팅)', icon: '🎁' },
    { id: '찾아가는 과학교실', label: '찾아가는 과학교실', icon: '🔬' },
    { id: '스페이스 업사이클링', label: '스페이스 업사이클링', icon: '🏠' },
    { id: '친환경 ESG', label: '친환경 ESG', icon: '🌱' },
    { id: '지역사회 나눔', label: '지역사회 나눔', icon: '💛' },
];

// 진행 연도 목록은 포트폴리오 데이터에서 동적 추출

const PortfolioPage: React.FC<PortfolioPageProps> = ({
    onPortfolioItemClick,
    onBackToHome,
    onInquiryClick,
    initialFilter = 'all',
}) => {
    const [orgFilter, setOrgFilter] = useState<string>(initialFilter);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [yearFilter, setYearFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(12);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [orgFilter, categoryFilter, yearFilter, searchQuery, itemsPerPage]);

    const isOTSItem = (item: PortfolioItem) => item.period >= '2025.01.01';

    const availableYears = useMemo(() => {
        const yearsSet = new Set<string>(mockData.portfolioItems.map((item) => item.year || item.period.slice(0, 4)));
        return Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
    }, []);

    const stats = useMemo(() => {
        const items = mockData.portfolioItems;
        const corpCount = items.filter((i) => i.orgType === '기업봉사').length;
        const groupCount = items.filter((i) => i.orgType === '단체봉사').length;
        const otsCount = items.filter(isOTSItem).length;
        return {
            total: items.length,
            corpCount,
            groupCount,
            otsCount,
        };
    }, []);

    const filteredItems = useMemo(() => {
        const list = mockData.portfolioItems.filter((item) => {
            if (orgFilter === 'ots') {
                if (!isOTSItem(item)) return false;
            } else if (orgFilter !== 'all') {
                if (item.orgType !== orgFilter) return false;
            }

            if (categoryFilter !== 'all' && item.category !== categoryFilter) {
                return false;
            }

            if (yearFilter !== 'all' && item.year !== yearFilter) {
                return false;
            }

            if (searchQuery.trim() !== '') {
                const q = searchQuery.toLowerCase().trim();
                const matchTitle = item.title.toLowerCase().includes(q);
                const matchPartner = item.partner.toLowerCase().includes(q);
                const matchCategory = item.category.toLowerCase().includes(q);
                const matchStory = item.story.toLowerCase().includes(q);
                return matchTitle || matchPartner || matchCategory || matchStory;
            }

            return true;
        });

        // 항상 최신 일자(period) 기준 내림차순 정렬 (최신 활동이 항상 상단에 노출되도록 보장)
        return [...list].sort((a, b) => b.period.localeCompare(a.period));
    }, [orgFilter, categoryFilter, yearFilter, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
    const paginatedItems = useMemo(() => {
        const startIdx = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(startIdx, startIdx + itemsPerPage);
    }, [filteredItems, currentPage, itemsPerPage]);

    const pageNumbers = useMemo(() => {
        const maxButtons = 5;
        let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        const end = Math.min(totalPages, start + maxButtons - 1);
        if (end - start + 1 < maxButtons) {
            start = Math.max(1, end - maxButtons + 1);
        }
        const pages: number[] = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    }, [currentPage, totalPages]);

    const handlePageChange = (page: number) => {
        const next = Math.max(1, Math.min(totalPages, page));
        setCurrentPage(next);
        const listEl = document.getElementById('portfolio-archive-top');
        if (listEl) {
            listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const resetFilters = () => {
        setOrgFilter('all');
        setCategoryFilter('all');
        setYearFilter('all');
        setSearchQuery('');
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* 상단 캠페인 헤더 배너 */}
            <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-700 text-white pt-12 pb-16 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <button
                            onClick={onBackToHome}
                            className="inline-flex items-center gap-2 text-sm font-semibold bg-white/15 hover:bg-white/25 backdrop-blur-sm px-4 py-2 rounded-full transition-colors whitespace-nowrap"
                        >
                            <span>&larr;</span>
                            <span>메인 홈으로 돌아가기</span>
                        </button>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-emerald-100 whitespace-nowrap">
                            <span>홈</span>
                            <span>/</span>
                            <span className="font-bold text-white">포트폴리오 아카이브</span>
                        </div>
                    </div>

                    <div className="max-w-3xl">
                        <span className="inline-block bg-amber-400 text-slate-900 text-xs font-extrabold px-3 py-1 rounded-full mb-4 tracking-wide">
                            OPEN THE SHARE STORY ARCHIVE
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4 break-keep">
                            함께 만든 따뜻한 변화, 나눔 스토리 아카이브
                        </h1>
                        <p className="text-base md:text-lg text-emerald-50/90 leading-relaxed break-keep">
                            오픈더쉐어가 기업 및 학교·기관·단체와 함께 만들어온 실제 사회공헌 활동 기록입니다.
                            임직원과 참여자들의 손끝에서 탄생한 나눔의 순간들을 확인해 보세요.
                        </p>
                    </div>

                    {/* 실시간 스토리 카운트 배지 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-10">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-0">
                            <p className="text-xs text-emerald-100 font-medium break-keep">전체 등록 스토리</p>
                            <p className="text-2xl md:text-3xl font-black mt-1 whitespace-nowrap">
                                {stats.total}
                                <span className="text-base font-normal ml-1">건</span>
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-0">
                            <p className="text-xs text-emerald-100 font-medium break-keep">OPEN THE SHARE 최신</p>
                            <p className="text-2xl md:text-3xl font-black mt-1 whitespace-nowrap">
                                {stats.otsCount}
                                <span className="text-base font-normal ml-1">건</span>
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-0">
                            <p className="text-xs text-emerald-100 font-medium break-keep">기업 사회공헌 (CSR)</p>
                            <p className="text-2xl md:text-3xl font-black mt-1 whitespace-nowrap">
                                {stats.corpCount}
                                <span className="text-base font-normal ml-1">건</span>
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-0">
                            <p className="text-xs text-emerald-100 font-medium break-keep">단체·학교 봉사활동</p>
                            <p className="text-2xl md:text-3xl font-black mt-1 whitespace-nowrap">
                                {stats.groupCount}
                                <span className="text-base font-normal ml-1">건</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 필터 및 검색 컨트롤 영역 */}
            <div id="portfolio-archive-top" className="max-w-7xl mx-auto px-4 -mt-6 relative z-20">
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-5 md:p-8">
                    {/* 1차 탭: 참여 주체별 분류 */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div className="flex flex-wrap gap-2">
                            {ORG_TABS.map((tab) => {
                                const isActive = orgFilter === tab.id;
                                const count =
                                    tab.id === 'all'
                                        ? stats.total
                                        : tab.id === 'ots'
                                        ? stats.otsCount
                                        : tab.id === '기업봉사'
                                        ? stats.corpCount
                                        : stats.groupCount;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setOrgFilter(tab.id)}
                                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                                            isActive
                                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                                                isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* 검색창 */}
                        <div className="relative w-full md:w-80">
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="참여기관(예: 삼성, 무라타), 활동명 검색"
                                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                            />
                            <svg
                                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* 2차 칩: 프로그램 테마 필터 */}
                    <div className="pt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 mr-1 whitespace-nowrap">테마별 보기</span>
                            {CATEGORY_CHIPS.map((chip) => {
                                const isActive = categoryFilter === chip.id;
                                return (
                                    <button
                                        key={chip.id}
                                        onClick={() => setCategoryFilter(chip.id)}
                                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold border transition-all whitespace-nowrap ${
                                            isActive
                                                ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold'
                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span>{chip.icon}</span>
                                        <span>{chip.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* 연도 필터 & 페이지당 노출 개수 */}
                        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto shrink-0">
                            <select
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                                aria-label="진행 연도 선택"
                                className="text-xs md:text-sm font-semibold rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="all">전체 연도</option>
                                {availableYears.map((y) => (
                                    <option key={y} value={y}>
                                        {y}년 활동
                                    </option>
                                ))}
                            </select>

                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                aria-label="페이지당 표시 개수"
                                className="text-xs md:text-sm font-semibold rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value={9}>9개씩 보기</option>
                                <option value={12}>12개씩 보기</option>
                                <option value={24}>24개씩 보기</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 검색 결과 요약 바 */}
                <div className="flex flex-wrap items-center justify-between gap-2 mt-8 mb-6 px-1">
                    <p className="text-sm md:text-base text-slate-600">
                        총 <strong className="font-extrabold text-emerald-600">{filteredItems.length}</strong>건의 나눔 스토리가 있습니다
                        <span className="text-xs text-slate-400 ml-2 whitespace-nowrap">
                            ({currentPage} / {totalPages} 페이지)
                        </span>
                    </p>
                    {(orgFilter !== 'all' ||
                        categoryFilter !== 'all' ||
                        yearFilter !== 'all' ||
                        searchQuery !== '') && (
                        <button
                            onClick={resetFilters}
                            className="text-xs font-semibold text-slate-500 hover:text-emerald-600 underline underline-offset-4 whitespace-nowrap"
                        >
                            필터 초기화
                        </button>
                    )}
                </div>

                {/* 포트폴리오 카드 그리드 */}
                {paginatedItems.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center my-8">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2 break-keep">
                            검색 조건에 맞는 포트폴리오가 없습니다
                        </h3>
                        <p className="text-sm text-slate-500 mb-6 break-keep">
                            다른 검색어나 카테고리를 선택해 보세요.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-full hover:bg-emerald-700 transition-colors text-sm"
                        >
                            전체 포트폴리오 보기
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {paginatedItems.map((item) => (
                            <article
                                key={item.id}
                                {...clickableProps(() => onPortfolioItemClick(item), `${item.title} 상세 보기`)}
                                className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col min-w-0"
                            >
                                {/* 썸네일 영역 */}
                                <div className="relative h-64 bg-slate-100 overflow-hidden">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* 상단 배지 오버레이 */}
                                    <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5 pr-3">
                                        <span
                                            className={`text-xs font-extrabold px-3 py-1 rounded-full shadow-sm backdrop-blur-md whitespace-nowrap ${
                                                item.orgType === '기업봉사'
                                                    ? 'bg-emerald-600/95 text-white'
                                                    : 'bg-sky-600/95 text-white'
                                            }`}
                                        >
                                            {item.orgType}
                                        </span>
                                        {isOTSItem(item) && (
                                            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-rose-500/95 text-white shadow-sm whitespace-nowrap">
                                                OPEN THE SHARE
                                            </span>
                                        )}
                                    </div>
                                    {/* 사진 개수 표시 */}
                                    {item.galleryUrls && item.galleryUrls.length > 1 && (
                                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                                            <span>📷</span>
                                            <span>+{item.galleryUrls.length}</span>
                                        </div>
                                    )}
                                </div>

                                {/* 카드 본문 */}
                                <div className="p-6 flex flex-col flex-grow min-w-0">
                                    {/* 카테고리 & 태그 */}
                                    <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md whitespace-nowrap">
                                            {item.category}
                                        </span>
                                        {item.tags &&
                                            item.tags.slice(2, 3).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-xs text-slate-400 font-medium truncate max-w-[160px]"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                    </div>

                                    {/* 제목 */}
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2.5 leading-snug break-keep">
                                        {item.title}
                                    </h3>

                                    {/* 본문 요약 */}
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-5 leading-relaxed flex-grow break-keep">
                                        {item.story}
                                    </p>

                                    {/* 하단 파트너 & 날짜 푸터 */}
                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs min-w-0">
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                            <span className="font-bold text-slate-700 truncate" title={item.partner}>
                                                {item.partner}
                                            </span>
                                        </div>
                                        <span className="text-slate-400 font-medium whitespace-nowrap shrink-0">
                                            {item.period}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* 번호형 페이지네이션 */}
                {totalPages > 1 && (
                    <nav
                        aria-label="포트폴리오 페이지 탐색"
                        className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <div className="inline-flex items-center gap-1.5 bg-white px-3 py-2 rounded-2xl shadow-sm border border-slate-200">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                aria-label="첫 페이지"
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                                &laquo;
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                aria-label="이전 페이지"
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                                &lsaquo;
                            </button>

                            {pageNumbers.map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    aria-current={currentPage === page ? 'page' : undefined}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold transition-all ${
                                        currentPage === page
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                aria-label="다음 페이지"
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                                &rsaquo;
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                aria-label="마지막 페이지"
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                                &raquo;
                            </button>
                        </div>
                    </nav>
                )}

                {/* 하단 맞춤형 제안 배너 */}
                <div className="mt-16 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
                    <div className="min-w-0">
                        <span className="text-xs font-extrabold text-emerald-400 tracking-wider uppercase">
                            CUSTOM CSR &amp; ESG PROGRAM
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black mt-1 mb-2 break-keep">
                            우리 기업·단체만의 특별한 나눔 스토리를 시작해 보세요
                        </h3>
                        <p className="text-sm md:text-base text-slate-300 break-keep">
                            가용 예산과 참여 인원, 희망 지원 대상에 맞춘 최적의 온앤온(대면)·온팅(비대면) 기획안을 제안해 드립니다.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 shrink-0">
                        <button
                            onClick={onInquiryClick}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-7 py-3.5 rounded-full transition-colors text-sm md:text-base whitespace-nowrap"
                        >
                            파트너십 문의하기
                        </button>
                        <a
                            href={mockData.companyInfo.socials.blog}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-full transition-colors text-sm md:text-base whitespace-nowrap"
                        >
                            공식 블로그 방문 &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioPage;

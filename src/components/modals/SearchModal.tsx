/**
 * @file SearchModal.tsx
 * @description 웹사이트 전체 포트폴리오(97건) 및 파트너사를 실시간으로 검색할 수 있는 모달 컴포넌트입니다.
 */
import React, { useState, useMemo } from 'react';
import { mockData } from '../../data/mockData';
import { PortfolioItem } from '../../types';

interface SearchModalProps {
    onClose: () => void;
    onSelectPortfolioItem?: (item: PortfolioItem) => void;
    onOpenPortfolioPage?: (searchQuery?: string) => void;
}

const RECOMMENDED_KEYWORDS = [
    'OPEN THE SHARE',
    '기업봉사',
    '단체봉사',
    '목공',
    '벽화',
    '플로깅',
    '김장',
    '화분',
    '비대면',
];

const SearchModal: React.FC<SearchModalProps> = ({
    onClose,
    onSelectPortfolioItem,
    onOpenPortfolioPage,
}) => {
    const [query, setQuery] = useState('');

    const searchResults = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return mockData.portfolioItems
            .filter(
                (item) =>
                    item.title.toLowerCase().includes(q) ||
                    item.partner.toLowerCase().includes(q) ||
                    item.category.toLowerCase().includes(q) ||
                    item.orgType.toLowerCase().includes(q) ||
                    item.story.toLowerCase().includes(q)
            )
            .slice(0, 6);
    }, [query]);

    return (
        <div
            className="fixed inset-0 z-50 animate-modalFadeIn"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="포트폴리오 검색창"
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
            <div
                className="relative bg-white pt-6 pb-8 shadow-xl animate-slideDown border-b border-slate-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="max-w-3xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
                            PORTFOLIO &amp; PARTNER SEARCH
                        </span>
                        <button
                            onClick={onClose}
                            className="text-xs font-bold text-slate-400 hover:text-slate-700"
                        >
                            닫기 ✕
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="파트너사명(예: 삼성, DB생명, 한국무라타전자) 또는 활동 키워드(예: 목공, 벽화, 키트)를 입력하세요"
                            className="w-full pl-5 pr-12 py-4 rounded-2xl border-2 border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm font-medium"
                            autoFocus
                        />
                        <svg
                            className="w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    {/* 추천 검색어 */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 mr-1">추천 키워드:</span>
                        {RECOMMENDED_KEYWORDS.map((kw) => (
                            <button
                                key={kw}
                                onClick={() => setQuery(kw)}
                                className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                            >
                                #{kw}
                            </button>
                        ))}
                    </div>

                    {/* 검색 결과 리스트 */}
                    {query.trim() !== '' && (
                        <div className="mt-6 border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-slate-500">
                                    검색 결과 (상위 {searchResults.length}건)
                                </span>
                                {onOpenPortfolioPage && (
                                    <button
                                        onClick={() => {
                                            onClose();
                                            onOpenPortfolioPage(query.trim());
                                        }}
                                        className="text-xs font-extrabold text-emerald-600 hover:underline"
                                    >
                                        포트폴리오 전용 페이지에서 전체 결과 보기 &rarr;
                                    </button>
                                )}
                            </div>

                            {searchResults.length === 0 ? (
                                <p className="text-sm text-slate-400 py-6 text-center">
                                    일치하는 포트폴리오가 없습니다. 다른 검색어를 입력해 보세요.
                                </p>
                            ) : (
                                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                                    {searchResults.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                onClose();
                                                if (onSelectPortfolioItem) {
                                                    onSelectPortfolioItem(item);
                                                }
                                            }}
                                            className="w-full text-left py-3 px-2 hover:bg-slate-50 rounded-xl flex items-center gap-3.5 transition-colors"
                                        >
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-200 bg-slate-100"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 mb-0.5 min-w-0">
                                                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 whitespace-nowrap shrink-0">
                                                        {item.orgType}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-600 truncate">
                                                        {item.partner}
                                                    </span>
                                                    <span className="text-xs text-slate-400 ml-auto whitespace-nowrap shrink-0">
                                                        {item.period}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-900 truncate">
                                                    {item.title}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;

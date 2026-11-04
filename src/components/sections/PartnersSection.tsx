/**
 * @file PartnersSection.tsx
 * @description 네이버 공식 블로그(https://blog.naver.com/5penthe)의 '파트너 기업' 카테고리(72개) 및
 * 최신 포트폴리오 참여기관(17개)을 통합한 총 89개 실제 참여기관 로고를 분류 탭과 함께 보여주는 섹션입니다.
 */
import React, { useState, useMemo } from 'react';
import { mockData } from '../../data/mockData';
import { PartnerItem } from '../../types';

const PARTNER_TABS: { key: 'ALL' | PartnerItem['group']; label: string }[] = [
    { key: 'ALL', label: '전체 참여기관' },
    { key: '기업', label: '기업 파트너' },
    { key: '공공기관·재단', label: '공공기관 · 재단' },
    { key: '학교·교육기관', label: '학교 · 교육기관' },
    { key: '단체·NGO', label: '단체 · 협회 · NGO' },
];

const PartnersSection: React.FC = () => {
    const [activeGroup, setActiveGroup] = useState<'ALL' | PartnerItem['group']>('ALL');
    const [isExpanded, setIsExpanded] = useState(false);

    const filteredPartners = useMemo(() => {
        if (activeGroup === 'ALL') return mockData.partners;
        return mockData.partners.filter((p) => p.group === activeGroup);
    }, [activeGroup]);

    const displayedPartners = isExpanded ? filteredPartners : filteredPartners.slice(0, 24);

    return (
        <section id="partners" className="py-24 bg-[#F8FAF9] border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold mb-3">
                        PARTICIPATING ORGANIZATIONS · {mockData.partners.length} PARTNERS
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 break-keep">
                        오픈더쉐어와 함께한 참여기관
                    </h2>
                    <p className="text-slate-600 text-base break-keep">
                        국내외 주요 대기업, 중견·강소기업, 공공기관, 재단 및 대학교·교육기관 등 총 {mockData.partners.length}개 참여기관이 오픈더쉐어와 함께 지속 가능한 나눔을 실천하고 있습니다.
                    </p>
                </div>

                {/* 분류 탭 */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {PARTNER_TABS.map((tab) => {
                        const count =
                            tab.key === 'ALL'
                                ? mockData.partners.length
                                : mockData.partners.filter((p) => p.group === tab.key).length;
                        const isActive = activeGroup === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setActiveGroup(tab.key);
                                    setIsExpanded(false);
                                }}
                                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                    isActive
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-400'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`px-1.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                                        isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* 참여기관 로고 그리드 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {displayedPartners.map((partner) => {
                        const cardContent = (
                            <>
                                <div className="h-12 w-full flex items-center justify-center overflow-hidden mb-2 px-2">
                                    <img
                                        src={partner.logo}
                                        alt={`${partner.name} 로고`}
                                        loading="lazy"
                                        className="max-h-11 max-w-[136px] w-auto h-auto object-contain group-hover:scale-105 transition-transform"
                                    />
                                </div>
                                <span className="w-full text-center px-1 text-[11px] font-bold text-slate-600 group-hover:text-emerald-700 truncate">
                                    {partner.name}
                                </span>
                            </>
                        );

                        return partner.blogLink ? (
                            <a
                                key={partner.name}
                                href={partner.blogLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all flex flex-col items-center justify-center h-28 min-w-0 overflow-hidden"
                                title={`${partner.name} 공식 블로그 소개 보기`}
                            >
                                {cardContent}
                            </a>
                        ) : (
                            <div
                                key={partner.name}
                                className="group bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all flex flex-col items-center justify-center h-28 min-w-0 overflow-hidden"
                                title={partner.name}
                            >
                                {cardContent}
                            </div>
                        );
                    })}
                </div>

                {/* 더보기 / 접기 버튼 */}
                {filteredPartners.length > 24 && (
                    <div className="mt-10 text-center">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:border-emerald-500 hover:text-emerald-600 transition-colors shadow-sm whitespace-nowrap"
                        >
                            <span>
                                {isExpanded
                                    ? '참여기관 목록 접기'
                                    : `전체 참여기관 모두 보기 (+${filteredPartners.length - 24}개 더보기)`}
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PartnersSection;

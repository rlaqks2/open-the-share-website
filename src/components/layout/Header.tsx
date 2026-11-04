/**
 * @file Header.tsx
 * @description 웹사이트 상단 네비게이션 헤더 컴포넌트입니다.
 * 메인 랜딩 화면('home')과 포트폴리오 전용 페이지('portfolio') 간 전환을 지원하며,
 * 기존 사이트(https://openthe.kr/)의 공식 원본 로고(logo.png) 및 빠른 파트너십 문의/검색 버튼을 제공합니다.
 */
import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/logo.png';

interface HeaderProps {
    currentView: 'home' | 'portfolio';
    onNavigateHome: (sectionId?: string) => void;
    onNavigatePortfolio: () => void;
    onInquiryClick: () => void;
    onSearchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
    currentView,
    onNavigateHome,
    onNavigatePortfolio,
    onInquiryClick,
    onSearchClick,
}) => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: '회사소개', sectionId: 'about', type: 'section' as const },
        { name: '사업안내', sectionId: 'programs', type: 'section' as const },
        { name: '진행절차', sectionId: 'process', type: 'section' as const },
        { name: '포트폴리오', sectionId: 'portfolio', type: 'page' as const },
        { name: '언론보도', sectionId: 'testimonials', type: 'section' as const },
        { name: '참여기관', sectionId: 'partners', type: 'section' as const },
        { name: 'FAQ', sectionId: 'faq', type: 'section' as const },
    ];

    const handleNavClick = (link: (typeof navLinks)[number]) => {
        setMenuOpen(false);
        if (link.type === 'page') {
            onNavigatePortfolio();
        } else {
            onNavigateHome(link.sectionId);
        }
    };

    const solidHeader = isScrolled || currentView === 'portfolio';

    return (
        <header
            className={`sticky top-0 z-40 w-full transition-all duration-300 ${
                solidHeader
                    ? 'bg-white/95 shadow-sm border-b border-slate-200/80 backdrop-blur-md'
                    : 'bg-white/90 backdrop-blur-sm border-b border-slate-100'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between gap-4 h-20">
                    {/* 공식 원본 로고 (openthe.kr logo.png) */}
                    <button
                        onClick={() => onNavigateHome()}
                        className="flex items-center shrink-0 text-left group focus:outline-none"
                        aria-label="오픈더쉐어 홈으로 이동"
                    >
                        <img
                            src={logoImg}
                            alt="Open The Share 오픈더쉐어 공식 로고"
                            className="h-8 sm:h-9 w-auto object-contain"
                        />
                    </button>

                    {/* 데스크톱 네비게이션 (줄바꿈 및 밀림 방지 적용) */}
                    <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
                        {navLinks.map((link) => {
                            const isPortfolioPage = link.type === 'page' && currentView === 'portfolio';
                            return (
                                <button
                                    key={link.name}
                                    onClick={() => handleNavClick(link)}
                                    className={`text-sm font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                                        isPortfolioPage
                                            ? 'text-emerald-600'
                                            : 'text-slate-700 hover:text-emerald-600'
                                    }`}
                                >
                                    <span>{link.name}</span>
                                    {link.type === 'page' && (
                                        <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-700">
                                            97
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* 우측 액션 버튼 */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <button
                            onClick={onSearchClick}
                            className="p-2.5 rounded-full text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors shrink-0"
                            aria-label="포트폴리오 검색"
                            title="포트폴리오 검색"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={onInquiryClick}
                            className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap shrink-0"
                        >
                            <span>파트너십 문의</span>
                        </button>

                        {/* 모바일 메뉴 버튼 */}
                        <button
                            onClick={() => setMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-slate-700 shrink-0"
                            aria-label="메뉴 열기"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* 모바일 드롭다운 메뉴 */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg animate-slideDown">
                    <nav className="flex flex-col p-4 space-y-1">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNavClick(link)}
                                className="w-full text-left px-4 py-3 rounded-xl font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-between"
                            >
                                <span>{link.name}</span>
                                {link.type === 'page' && (
                                    <span className="px-2 py-0.5 text-xs font-extrabold rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                                        97건 전체보기
                                    </span>
                                )}
                            </button>
                        ))}
                        <div className="border-t border-slate-100 pt-3 mt-2">
                            <button
                                onClick={() => {
                                    onInquiryClick();
                                    setMenuOpen(false);
                                }}
                                className="w-full text-center py-3 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                파트너십 문의하기
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;

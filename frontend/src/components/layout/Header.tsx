/**
 * @file Header.tsx
 * @description 웹사이트의 헤더(상단 탐색 바) 컴포넌트입니다.
 * 로고, 주요 섹션으로 이동하는 네비게이션 링크, 검색, 문의, 로그인/로그아웃 버튼을 포함합니다.
 * 반응형 디자인으로, 모바일 화면에서는 햄버거 메뉴가 나타납니다.
 */
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import Navigation from './Navigation';
import UserActions from './UserActions';

// Header 컴포넌트가 받는 props의 타입을 정의
interface HeaderProps {
    isLoggedIn: boolean;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    onInquiryClick: () => void;
    onSearchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLoginClick, onLogoutClick, onInquiryClick, onSearchClick }) => {
    // 모바일 메뉴의 열림/닫힘 상태를 관리
    const [isMenuOpen, setMenuOpen] = useState(false);
    // 스크롤 위치에 따라 헤더 배경을 변경하기 위한 상태
    const [isScrolled, setScrolled] = useState(false);

    // 스크롤 이벤트를 감지하여 isScrolled 상태를 업데이트하는 useEffect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 네비게이션 링크 데이터
    const navLinks = [
        { name: '소개', href: '/about' },
        { name: '사업분야', href: '/programs' },
        { name: '포트폴리오', href: '/portfolio' },
        { name: 'FAQ', href: '/faq' },
    ];

    return (
        <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? 'bg-white/80 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* 로고 */}
                    <Logo />

                    {/* 데스크톱 네비게이션 */}
                    <div className="hidden lg:flex">
                        <Navigation links={navLinks} />
                    </div>

                    {/* 오른쪽 액션 버튼 및 메뉴 토글 */}
                    <div className="flex items-center space-x-4">
                        <UserActions
                            isLoggedIn={isLoggedIn}
                            onSearchClick={onSearchClick}
                            onInquiryClick={onInquiryClick}
                            onLoginClick={onLoginClick}
                            onLogoutClick={onLogoutClick}
                        />

                        {/* 모바일 메뉴 토글 버튼 */}
                        <button
                            onClick={() => setMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2"
                            aria-label="메뉴 열기"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* 모바일 메뉴 (오버레이 방식) */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg animate-slideDown">
                    <div className="flex flex-col p-4 space-y-2">
                        <Navigation
                            links={navLinks}
                            onLinkClick={() => setMenuOpen(false)}
                        />
                        <UserActions
                            isLoggedIn={isLoggedIn}
                            onSearchClick={() => { onSearchClick(); setMenuOpen(false); }}
                            onInquiryClick={() => { onInquiryClick(); setMenuOpen(false); }}
                            onLoginClick={() => { onLoginClick(); setMenuOpen(false); }}
                            onLogoutClick={() => { onLogoutClick(); setMenuOpen(false); }}
                            isMobile={true}
                        />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
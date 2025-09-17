/**
 * @file Header.tsx
 * @description 웹사이트의 헤더(상단 탐색 바) 컴포넌트입니다.
 * 로고, 주요 섹션으로 이동하는 네비게이션 링크, 검색, 문의, 로그인/로그아웃 버튼을 포함합니다.
 * 반응형 디자인으로, 모바일 화면에서는 햄버거 메뉴가 나타납니다.
 */
import React, { useState, useEffect } from 'react';

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
        { name: '소개', href: '#about' },
        { name: '사업분야', href: '#programs' },
        { name: '포트폴리오', href: '#portfolio' },
        { name: 'FAQ', href: '#faq' },
    ];

    return (
        <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? 'bg-white/80 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* 로고 */}
                    <a href="#" className="text-2xl font-black text-emerald-600">OpenTheShare</a>

                    {/* 데스크톱 네비게이션 */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <a key={link.name} href={link.href} className="font-semibold text-slate-700 hover:text-emerald-600 transition-colors">{link.name}</a>
                        ))}
                    </nav>

                    {/* 오른쪽 아이콘 및 버튼 그룹 */}
                    <div className="flex items-center space-x-4">
                        <button onClick={onSearchClick} className="p-2 text-slate-600 hover:text-emerald-600" aria-label="검색">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                        <button onClick={onInquiryClick} className="hidden sm:block bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-full hover:bg-emerald-700 transition-colors">파트너십 문의</button>
                        {isLoggedIn ? (
                            <button onClick={onLogoutClick} className="hidden sm:block font-semibold text-slate-700 hover:text-emerald-600">로그아웃</button>
                        ) : (
                            <button onClick={onLoginClick} className="hidden sm:block font-semibold text-slate-700 hover:text-emerald-600">로그인</button>
                        )}
                        {/* 모바일 메뉴 토글 버튼 */}
                        <button onClick={() => setMenuOpen(!isMenuOpen)} className="lg:hidden p-2" aria-label="메뉴 열기">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* 모바일 메뉴 (오버레이 방식으로 수정) */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg animate-slideDown">
                    <nav className="flex flex-col p-4 space-y-2">
                        {navLinks.map(link => (
                            <a key={link.name} href={link.href} className="block px-4 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-600" onClick={() => setMenuOpen(false)}>{link.name}</a>
                        ))}
                        <div className="border-t pt-4 space-y-2">
                            {isLoggedIn ? (
                                <button onClick={() => { onLogoutClick(); setMenuOpen(false); }} className="w-full text-left block px-4 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-600">로그아웃</button>
                            ) : (
                                <button onClick={() => { onLoginClick(); setMenuOpen(false); }} className="w-full text-left block px-4 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-600">로그인</button>
                            )}
                            <button onClick={() => { onInquiryClick(); setMenuOpen(false); }} className="w-full text-left block px-4 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-600">파트너십 문의</button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
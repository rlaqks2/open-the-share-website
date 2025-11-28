/**
 * @file App.tsx
 * @description 애플리케이션의 최상위 루트 컴포넌트입니다.
 * 모든 페이지 섹션과 레이아웃(헤더, 푸터)을 조립하고,
 * 모달 창들의 상태를 관리하는 중심적인 역할을 합니다.
 */
import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import ImpactSection from './components/sections/ImpactSection';
import ProgramsSection from './components/sections/ProgramsSection';
import ProcessSection from './components/sections/ProcessSection';
import PortfolioSection from './components/sections/PortfolioSection';
import TestimonialsSection from './components/sections/TestimonialsSection';
import PartnersSection from './components/sections/PartnersSection';
import FAQSection from './components/sections/FAQSection';
import CTASection from './components/sections/CTASection';
import LoginModal from './components/modals/LoginModal';
import SignupModal from './components/modals/SignupModal';
import FindAccountModal from './components/modals/FindAccountModal';
import SearchModal from './components/modals/SearchModal';
import InquiryModal from './components/modals/InquiryModal';
import PortfolioDetailModal from './components/modals/PortfolioDetailModal';
import { useScrollObserver } from './hooks/useScrollObserver';
import { PortfolioItem } from './types';
import { fetchContent } from './api';

function App() {
    // 스크롤에 따른 섹션 애니메이션 활성화 훅
    useScrollObserver();

    // 모달 상태 관리를 위한 state
    const [activeModal, setActiveModal] = useState<string | null>(null);
    // 로그인 상태 관리
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // 포트폴리오 상세 모달에 표시할 아이템 정보
    const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);

    // 백엔드 데이터 상태
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        const loadContent = async () => {
            const data = await fetchContent();
            if (data) {
                setContent(data);
            }
        };
        loadContent();
    }, []);

    // 로그인 처리 함수
    const handleLogin = () => {
        setIsLoggedIn(true);
        setActiveModal(null); // 로그인 성공 시 모든 모달 닫기
    };

    // 로그아웃 처리 함수
    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    // 포트폴리오 상세 모달 열기 함수
    const openPortfolioDetail = (item: PortfolioItem) => {
        setSelectedPortfolioItem(item);
        setActiveModal('portfolioDetail');
    };

    // 모든 모달을 닫는 함수
    const closeModal = () => {
        setActiveModal(null);
        // 포트폴리오 모달을 닫을 때 선택된 아이템 정보 초기화
        if (selectedPortfolioItem) {
            setSelectedPortfolioItem(null);
        }
    };

    if (!content) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="font-sans antialiased text-slate-800 bg-white">
            <Header
                isLoggedIn={isLoggedIn}
                onLoginClick={() => setActiveModal('login')}
                onLogoutClick={handleLogout}
                onInquiryClick={() => setActiveModal('inquiry')}
                onSearchClick={() => setActiveModal('search')}
            />
            <main>
                <HeroSection onInquiryClick={() => setActiveModal('inquiry')} />
                <AboutSection data={content.about} />
                <ImpactSection data={content.impactStats} />
                <ProgramsSection data={content.programs} />
                <ProcessSection data={content.processSteps} />
                <PortfolioSection data={content.portfolioItems} onPortfolioItemClick={openPortfolioDetail} />
                <TestimonialsSection data={content.testimonials} />
                <PartnersSection data={content.partners} />
                <FAQSection data={content.faqs} />
                <CTASection onInquiryClick={() => setActiveModal('inquiry')} />
            </main>
            <Footer />

            {/* 활성화된 모달 렌더링 */}
            {activeModal === 'login' && (
                <LoginModal
                    onClose={closeModal}
                    onLogin={handleLogin}
                    onSignupClick={() => setActiveModal('signup')}
                    onFindAccountClick={() => setActiveModal('findAccount')}
                />
            )}
            {activeModal === 'signup' && (
                <SignupModal
                    onClose={closeModal}
                    onLoginClick={() => setActiveModal('login')}
                />
            )}
            {activeModal === 'findAccount' && <FindAccountModal onClose={closeModal} />}
            {activeModal === 'search' && <SearchModal onClose={closeModal} />}
            {activeModal === 'inquiry' && <InquiryModal onClose={closeModal} />}
            {activeModal === 'portfolioDetail' && (
                <PortfolioDetailModal item={selectedPortfolioItem} onClose={closeModal} />
            )}
        </div>
    );
}

export default App;

/**
 * @file App.tsx
 * @description 애플리케이션의 최상위 루트 컴포넌트입니다.
 * 메인 랜딩 페이지('home')와 별도로 분리된 페이지네이션 포트폴리오 아카이브 페이지('portfolio') 간
 * 화면 전환 및 상세/문의/검색 모달 상태를 관리합니다.
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
import PortfolioPage from './components/pages/PortfolioPage';
import SearchModal from './components/modals/SearchModal';
import InquiryModal from './components/modals/InquiryModal';
import PortfolioDetailModal from './components/modals/PortfolioDetailModal';
import { useScrollObserver } from './hooks/useScrollObserver';
import { PortfolioItem } from './types';

function App() {
    useScrollObserver();

    // 브라우저 탭 파비콘 동적 강제 주입
    useEffect(() => {
        const setFavicon = (href: string) => {
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.type = 'image/png';
            link.href = href;
        };
        setFavicon('data:image/png;base64,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');
    }, []);


    // 현재 화면 뷰 상태 ('home' 메인 페이지 | 'portfolio' 전용 페이지네이션 페이지)
    const [currentView, setCurrentView] = useState<'home' | 'portfolio'>('home');
    // 포트폴리오 전용 페이지 진입 시 초기 선택 탭 ('all' | 'ots' | '기업봉사' | '단체봉사')
    const [initialPortfolioFilter, setInitialPortfolioFilter] = useState<string>('all');

    // 모달 상태 관리
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);

    // 포트폴리오 상세 모달 열기
    const openPortfolioDetail = (item: PortfolioItem) => {
        setSelectedPortfolioItem(item);
        setActiveModal('portfolioDetail');
    };

    // 모달 닫기
    const closeModal = () => {
        setActiveModal(null);
        if (selectedPortfolioItem) {
            setSelectedPortfolioItem(null);
        }
    };

    // 홈으로 이동 및 특정 섹션 스크롤
    const handleNavigateHome = (sectionId?: string) => {
        setCurrentView('home');
        if (sectionId) {
            setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            }, 60);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // 포트폴리오 전용 페이지로 이동
    const handleNavigatePortfolio = (filter: string = 'all') => {
        setInitialPortfolioFilter(filter);
        setCurrentView('portfolio');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="font-sans antialiased text-slate-800 bg-white min-h-screen flex flex-col">
            <Header
                currentView={currentView}
                onNavigateHome={handleNavigateHome}
                onNavigatePortfolio={() => handleNavigatePortfolio('all')}
                onInquiryClick={() => setActiveModal('inquiry')}
                onSearchClick={() => setActiveModal('search')}
            />

            {currentView === 'home' ? (
                <main className="flex-grow">
                    <HeroSection
                        onInquiryClick={() => setActiveModal('inquiry')}
                        onPortfolioPageClick={() => handleNavigatePortfolio('all')}
                    />
                    <AboutSection />
                    <ImpactSection />
                    <ProgramsSection />
                    <ProcessSection />
                    <PortfolioSection
                        onPortfolioItemClick={openPortfolioDetail}
                        onViewAllClick={(filter) => handleNavigatePortfolio(filter || 'all')}
                    />
                    <TestimonialsSection />
                    <PartnersSection />
                    <FAQSection />
                    <CTASection onInquiryClick={() => setActiveModal('inquiry')} />
                </main>
            ) : (
                <main className="flex-grow">
                    <PortfolioPage
                        initialFilter={initialPortfolioFilter}
                        onPortfolioItemClick={openPortfolioDetail}
                        onBackToHome={() => handleNavigateHome()}
                        onInquiryClick={() => setActiveModal('inquiry')}
                    />
                </main>
            )}

            <Footer
                onNavigateHome={handleNavigateHome}
                onNavigatePortfolio={() => handleNavigatePortfolio('all')}
            />

            {/* 활성화된 모달 렌더링 */}
            {activeModal === 'search' && (
                <SearchModal
                    onClose={closeModal}
                    onSelectPortfolioItem={openPortfolioDetail}
                    onOpenPortfolioPage={() => handleNavigatePortfolio('all')}
                />
            )}
            {activeModal === 'inquiry' && <InquiryModal onClose={closeModal} />}
            {activeModal === 'portfolioDetail' && (
                <PortfolioDetailModal item={selectedPortfolioItem} onClose={closeModal} />
            )}
        </div>
    );
}

export default App;

/**
 * @file App.tsx
 * @description 애플리케이션의 최상위 루트 컴포넌트입니다.
 * 메인 랜딩 페이지('home')와 별도로 분리된 페이지네이션 포트폴리오 아카이브 페이지('portfolio') 간
 * 화면 전환 및 상세/문의/검색/방문자로그 모달 상태를 관리합니다.
 */
import { useState, useEffect, useCallback } from 'react';
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
import PrivacyPolicyModal from './components/modals/PrivacyPolicyModal';
import Modal from './components/ui/Modal';
import { trackVisitor } from './utils/visitorTracker';
import { useScrollObserver } from './hooks/useScrollObserver';
import { PortfolioItem } from './types';

type ModalType = 'search' | 'inquiry' | 'portfolioDetail' | 'privacy';

function App() {
    useScrollObserver();

    // 현재 화면 뷰 상태 ('home' 메인 페이지 | 'portfolio' 전용 페이지네이션 페이지)
    const [currentView, setCurrentView] = useState<'home' | 'portfolio'>('home');
    // 헤더에서 현재 선택된 섹션 ID (선택했을 때만 초록색 활성화)
    const [activeSection, setActiveSection] = useState<string | null>(null);
    // 포트폴리오 전용 페이지 진입 시 초기 선택 탭 ('all' | 'ots' | '기업봉사' | '단체봉사')
    const [initialPortfolioFilter, setInitialPortfolioFilter] = useState<string>('all');

    // 모달 상태 관리
    const [activeModal, setActiveModal] = useState<ModalType | null>(null);
    const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);

    // 방문자 로그 수집 (화면 전환 시마다) — 데이터는 관리자 구글 시트로만 전송, 사이트에 UI 없음 (docs/VISITOR_LOG.md)
    useEffect(() => {
        const pageTitle =
            currentView === 'home'
                ? '오픈더쉐어 - 메인 홈'
                : `오픈더쉐어 - 포트폴리오 (${initialPortfolioFilter})`;
        trackVisitor(pageTitle);
    }, [currentView, initialPortfolioFilter]);

    // 포트폴리오 상세 모달 열기
    const openPortfolioDetail = (item: PortfolioItem) => {
        setSelectedPortfolioItem(item);
        setActiveModal('portfolioDetail');
    };

    // 모달 닫기
    const closeModal = useCallback(() => {
        setActiveModal(null);
        setSelectedPortfolioItem(null);
    }, []);

    // 홈으로 이동 및 특정 섹션 스크롤
    const handleNavigateHome = (sectionId?: string) => {
        setCurrentView('home');
        setActiveSection(sectionId || null);
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
        setActiveSection('portfolio');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="font-sans antialiased text-slate-800 bg-white min-h-screen flex flex-col">
            <Header
                currentView={currentView}
                activeSection={activeSection}
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
                        onPortfolioItemClick={openPortfolioDetail}
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
                onOpenPrivacy={() => setActiveModal('privacy')}
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
            {activeModal === 'privacy' && (
                <Modal open onClose={closeModal} maxWidth="max-w-3xl" noPadding>
                    <PrivacyPolicyModal onClose={closeModal} />
                </Modal>
            )}
        </div>
    );
}

export default App;

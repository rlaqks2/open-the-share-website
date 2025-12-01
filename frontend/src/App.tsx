/**
 * @file App.tsx
 * @description 애플리케이션의 최상위 루트 컴포넌트입니다.
 * React Router를 사용하여 페이지 라우팅을 관리하고,
 * 헤더, 푸터 및 전역 모달을 포함합니다.
 */
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import PortfolioPage from './pages/PortfolioPage';
import FAQPage from './pages/FAQPage';
import LoginModal from './components/modals/LoginModal';
import SignupModal from './components/modals/SignupModal';
import FindAccountModal from './components/modals/FindAccountModal';
import SearchModal from './components/modals/SearchModal';
import InquiryModal from './components/modals/InquiryModal';
import PortfolioDetailModal from './components/modals/PortfolioDetailModal';
import ProgramDetailModal from './components/modals/ProgramDetailModal';
import QuoteRequestModal from './components/modals/QuoteRequestModal';
import LoadingScreen from './components/ui/LoadingScreen';
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
    // 프로그램 상세/견적 모달에 표시할 프로그램 정보
    const [selectedProgram, setSelectedProgram] = useState<any>(null);

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

    // 프로그램 상세 모달 열기 함수
    const openProgramDetail = (program: any) => {
        setSelectedProgram(program);
        setActiveModal('programDetail');
    };

    // 견적 요청 모달 열기 함수
    const openQuoteRequest = (program: any) => {
        setSelectedProgram(program);
        setActiveModal('quoteRequest');
    };

    // 모든 모달을 닫는 함수
    const closeModal = () => {
        setActiveModal(null);
        // 모달을 닫을 때 선택된 아이템 정보 초기화
        if (selectedPortfolioItem) setSelectedPortfolioItem(null);
        if (selectedProgram) setSelectedProgram(null);
    };

    if (!content) {
        return <LoadingScreen />;
    }

    return (
        <Router>
            <div className="font-sans antialiased text-slate-800 bg-white">
                <Header
                    isLoggedIn={isLoggedIn}
                    onLoginClick={() => setActiveModal('login')}
                    onLogoutClick={handleLogout}
                    onInquiryClick={() => setActiveModal('inquiry')}
                    onSearchClick={() => setActiveModal('search')}
                />
                <main>
                    <Routes>
                        <Route path="/" element={<AboutPage data={content.about} />} />
                        <Route path="/home" element={<HomePage content={content} onInquiryClick={() => setActiveModal('inquiry')} />} />
                        <Route path="/about" element={<AboutPage data={content.about} />} />
                        <Route path="/programs" element={
                            <ProgramsPage
                                data={content.programs}
                            />
                        } />
                        <Route path="/portfolio" element={<PortfolioPage data={content.portfolioItems} onItemClick={openPortfolioDetail} />} />
                        <Route path="/faq" element={<FAQPage faqs={content.faqs} />} />
                    </Routes>
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
                {activeModal === 'programDetail' && (
                    <ProgramDetailModal
                        program={selectedProgram}
                        onClose={closeModal}
                        onRequestQuote={() => openQuoteRequest(selectedProgram)}
                    />
                )}
                {activeModal === 'quoteRequest' && (
                    <QuoteRequestModal program={selectedProgram} onClose={closeModal} />
                )}
            </div>
        </Router>
    );
}

export default App;

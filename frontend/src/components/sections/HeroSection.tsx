/**
 * @file HeroSection.tsx
 * @description 웹사이트의 메인 '히어로' 섹션 컴포넌트입니다.
 * 방문자의 시선을 사로잡는 강력한 헤드라인과 서브텍스트,
 * 그리고 행동을 유도하는(Call-to-Action) 버튼을 포함합니다.
 * 배경에는 동적인 효과나 이미지를 사용하여 시각적 매력을 더합니다.
 */
import React from 'react';

// HeroSection 컴포넌트가 받는 props의 타입을 정의
interface HeroSectionProps {
    onInquiryClick: () => void; // '파트너십 문의하기' 버튼 클릭 시 호출될 함수
}

const HeroSection: React.FC<HeroSectionProps> = ({ onInquiryClick }) => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center text-center bg-cover bg-center text-white overflow-hidden" style={{ backgroundImage: "url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')" }}>
            {/* Gradient overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-900/70 to-emerald-900/80"></div>

            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Content container */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
                {/* Trust badges */}
                <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fadeInUp">
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                        ⭐ 150+ 파트너사
                    </span>
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                        🏆 ESG 전문 기관
                    </span>
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                        ✓ 3,000+ 임직원 참여
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black mb-6 animate-fadeInUp leading-tight" style={{ animationDelay: '200ms' }}>
                    기업의 가치를 높이는<br />
                    <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        사회공헌 파트너
                    </span>
                </h1>

                <p className="text-xl md:text-2xl mb-4 text-slate-100 animate-fadeInUp max-w-3xl mx-auto leading-relaxed" style={{ animationDelay: '400ms' }}>
                    오픈더쉐어는 기업의 ESG 경영 목표 달성을 위한<br className="hidden md:block" />
                    맞춤형 사회공헌 프로그램을 기획하고 실행합니다
                </p>

                <p className="text-base md:text-lg mb-10 text-slate-300 animate-fadeInUp max-w-2xl mx-auto" style={{ animationDelay: '600ms' }}>
                    형식적인 봉사활동을 넘어, 진정성 있는 사회적 가치를 창출하세요
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp" style={{ animationDelay: '800ms' }}>
                    <button
                        onClick={onInquiryClick}
                        className="group bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold px-10 py-4 rounded-full hover:shadow-2xl transition-all duration-300 text-lg hover:scale-105 shadow-lg"
                    >
                        <span className="flex items-center gap-2">
                            무료 컨설팅 신청
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </button>
                    <button
                        onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-white/10 backdrop-blur-sm text-white font-bold px-10 py-4 rounded-full hover:bg-white/20 transition-all duration-300 text-lg border-2 border-white/30 hover:border-white/50"
                    >
                        프로그램 둘러보기
                    </button>
                </div>

                {/* Value propositions */}
                <div className="grid md:grid-cols-3 gap-6 mt-16 animate-fadeInUp" style={{ animationDelay: '1000ms' }}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="text-4xl mb-3">💡</div>
                        <h3 className="font-bold text-lg mb-2">맞춤형 기획</h3>
                        <p className="text-sm text-slate-200">귀사의 비전에 맞는 프로그램 설계</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="text-4xl mb-3">🚀</div>
                        <h3 className="font-bold text-lg mb-2">원스톱 운영</h3>
                        <p className="text-sm text-slate-200">기획부터 실행, 보고까지 전담</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="text-4xl mb-3">📊</div>
                        <h3 className="font-bold text-lg mb-2">ESG 데이터</h3>
                        <p className="text-sm text-slate-200">정량적 성과 측정 및 보고서 제공</p>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
};

export default HeroSection;

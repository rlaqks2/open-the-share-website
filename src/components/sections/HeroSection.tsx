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
        <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center bg-cover bg-center text-white" style={{ backgroundImage: "url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}>
            {/* 배경 어둡게 처리 */}
            <div className="absolute inset-0 bg-black/50"></div>
            {/* 콘텐츠 컨테이너 */}
            <div className="relative z-10 p-4">
                <h1 className="text-4xl md:text-6xl font-black mb-4 animate-fadeInUp">
                    기업의 가치를 높이는<br />
                    가장 확실한 선택
                </h1>
                <p className="text-lg md:text-xl mb-8 text-slate-200 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                    오픈더쉐어는 기업의 사회적 책임과 ESG 경영 목표 달성을 돕는<br className="hidden md:block" />
                    가장 신뢰할 수 있는 사회공헌 파트너입니다.
                </p>
                <button
                    onClick={onInquiryClick}
                    className="bg-emerald-600 text-white font-bold px-10 py-4 rounded-full hover:bg-emerald-700 transition-transform hover:scale-105 text-lg animate-fadeInUp"
                    style={{ animationDelay: '600ms' }}
                >
                    파트너십 문의하기
                </button>
            </div>
        </section>
    );
};

export default HeroSection;

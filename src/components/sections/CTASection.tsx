/**
 * @file CTASection.tsx
 * @description '행동 유도(Call-to-Action)' 섹션 컴포넌트입니다.
 * 페이지의 마지막 부분에서 사용자의 특정 행동(여기서는 파트너십 문의)을 강력하게 유도하는 역할을 합니다.
 * 눈에 띄는 배경색과 명확한 메시지, 그리고 클릭 가능한 큰 버튼으로 구성됩니다.
 * 버튼 클릭 시 부모 컴포넌트로부터 받은 `onInquiryClick` 함수를 호출하여 문의 모달을 엽니다.
 */
import React from 'react';

// CTASection 컴포넌트가 받는 props의 타입을 정의
interface CTASectionProps {
    onInquiryClick: () => void; // '파트너십 문의하기' 버튼 클릭 시 호출될 함수
}

const CTASection: React.FC<CTASectionProps> = ({ onInquiryClick }) => {
    return (
        <section className="py-20 bg-emerald-600 text-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-4">지금 바로<br />성공적인 ESG 파트너십을 시작하세요.</h2>
                <p className="mb-8 text-emerald-200">오픈더쉐어가 기업의 가치를 높이는 최고의 파트너가 되겠습니다.</p>
                <button onClick={onInquiryClick} className="bg-white text-emerald-600 font-bold px-10 py-4 rounded-full hover:bg-slate-100 transition-colors text-lg">파트너십 문의하기</button>
            </div>
        </section>
    );
};

export default CTASection;
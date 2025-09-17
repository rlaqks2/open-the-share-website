/**
 * @file FAQSection.tsx
 * @description '자주 묻는 질문(FAQ)' 섹션을 렌더링하는 컴포넌트입니다.
 * 사용자들이 자주 궁금해하는 질문과 답변을 아코디언 인터페이스로 제공합니다.
 * 질문을 클릭하면 해당 답변이 펼쳐지고, 다시 클릭하면 접힙니다.
 * 어떤 질문이 열려 있는지를 관리하기 위해 자체적인 `openId` 상태를 가집니다.
 */
import React, { useState } from 'react';
import { mockData } from '../../data/mockData';

const FAQSection: React.FC = () => {
    // 현재 열려 있는 FAQ 항목의 ID를 저장하는 state. null이면 모두 닫힌 상태.
    const [openId, setOpenId] = useState<number | null>(null);

    // FAQ 항목을 열고 닫는 토글 함수
    const toggle = (id: number) => {
        // 현재 열려 있는 항목을 다시 클릭하면 닫고, 다른 항목을 클릭하면 그 항목을 엶.
        setOpenId(openId === id ? null : id);
    };

    return (
        <section id="faq" className="py-20 bg-slate-50">
            <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">자주 묻는 질문</h2>
                <div className="space-y-4">
                    {mockData.faqs.map(faq => (
                        <div key={faq.id} className="border border-slate-200 rounded-lg">
                            {/* 질문 버튼: 클릭 시 toggle 함수 호출 */}
                            <button
                                onClick={() => toggle(faq.id)}
                                className="w-full flex justify-between items-center p-5 text-left font-semibold"
                                aria-expanded={openId === faq.id} // 웹 접근성을 위해 확장 상태를 명시
                            >
                                <span>{faq.question}</span>
                                {/* 아이콘: 열림/닫힘 상태에 따라 회전 */}
                                <span className={`transform transition-transform ${openId === faq.id ? 'rotate-180' : ''}`}>&#9660;</span>
                            </button>
                            {/* 답변 영역: openId가 현재 faq의 id와 같을 때만 렌더링 */}
                            {openId === faq.id && (
                                <div className="px-5 pb-5 text-slate-600">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
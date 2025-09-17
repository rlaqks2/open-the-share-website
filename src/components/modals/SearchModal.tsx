/**
 * @file SearchModal.tsx
 * @description 웹사이트 전체 콘텐츠를 '검색'하기 위한 모달 컴포넌트입니다.
 * 헤더의 검색 아이콘을 클릭하면 화면 상단에 나타나며,
 * 검색어 입력 필드, 최근 검색어, 추천 검색어 등을 포함하는
 * 몰입감 있는 검색 인터페이스를 제공합니다.
 */
import React from 'react';

// SearchModal 컴포넌트가 받는 props의 타입을 정의
interface SearchModalProps {
    onClose: () => void; // 모달을 닫을 때 호출될 함수
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
    return (
        // role, aria-* 속성을 사용하여 웹 접근성을 준수
        <div className="fixed inset-0 z-50 animate-modalFadeIn" onClick={onClose} role="dialog" aria-modal="true" aria-label="검색창">
            {/* 반투명 배경 */}
            <div className="absolute inset-0 bg-black/60"></div>
            {/* 검색 콘텐츠 영역: 클릭 시 이벤트 전파를 막아 모달이 닫히지 않게 함 */}
            <div className="relative bg-white pt-6 pb-8 shadow-lg animate-slideDown" onClick={e => e.stopPropagation()}>
                <div className="max-w-3xl mx-auto px-4">
                    <div className="relative">
                        <input
                          type="search"
                          placeholder="무엇을 도와드릴까요?"
                          className="w-full pl-5 pr-12 py-4 rounded-full border-2 border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          autoFocus // 모달이 열리면 자동으로 포커스
                        />
                        <svg className="w-6 h-6 absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    {/* 최근 검색어 및 추천 검색어 */}
                    <div className="mt-6 flex justify-between text-sm">
                        <div>
                            <h3 className="font-semibold mb-2">최근 검색어</h3>
                            <div className="flex gap-2">
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">ESG</span>
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">벽화 그리기</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">추천 검색어</h3>
                            <div className="flex gap-2">
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">임직원 봉사</span>
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">사회공헌</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
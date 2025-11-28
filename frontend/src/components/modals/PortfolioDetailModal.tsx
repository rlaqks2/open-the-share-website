/**
 * @file PortfolioDetailModal.tsx
 * @description 선택된 '포트폴리오' 항목의 상세 정보를 보여주는 모달 컴포넌트입니다.
 * 포트폴리오 섹션에서 '자세히 보기'를 클릭했을 때 나타나며,
 * 큰 대표 이미지, 프로젝트 개요(파트너사, 기간, 참여 인원),
 * 그리고 상세한 프로젝트 스토리를 포함하여 풍부한 정보를 제공합니다.
 */
import React from 'react';
import Modal from '../ui/Modal';
import { PortfolioItem } from '../../types'; // 포트폴리오 아이템의 타입 정의

// PortfolioDetailModal 컴포넌트가 받는 props의 타입을 정의
interface PortfolioDetailModalProps {
    item: PortfolioItem | null; // 상세 정보를 표시할 포트폴리오 아이템 객체, 없을 경우 null
    onClose: () => void;        // 모달을 닫을 때 호출될 함수
}

const PortfolioDetailModal: React.FC<PortfolioDetailModalProps> = ({ item, onClose }) => {
    // 표시할 아이템 데이터가 없으면 아무것도 렌더링하지 않음
    if (!item) return null;

    return (
        // `noPadding={true}`를 전달하여 Modal 컴포넌트의 기본 패딩을 제거하고, 내부에서 직접 레이아웃을 제어
        <Modal open={true} onClose={onClose} maxWidth="max-w-4xl" noPadding={true}>
            <div className="relative">
                {/* 닫기 버튼 */}
                <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors" aria-label="닫기">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                {/* 콘텐츠가 길어질 경우를 대비해 스크롤 가능한 영역 설정 */}
                <div className="max-h-[85vh] overflow-y-auto">
                    {/* 대표 이미지 */}
                    <div className="w-full h-80 bg-slate-200">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    {/* 텍스트 콘텐츠 */}
                    <div className="p-8 md:p-12">
                        <h2 className="text-3xl font-bold mb-2" id="modal-title">{item.title}</h2>
                        <p className="text-emerald-600 font-semibold mb-6">{item.category}</p>
                        {/* 프로젝트 개요 */}
                        <div className="bg-slate-50 rounded-lg p-6 mb-8 border border-slate-200">
                            <h3 className="text-lg font-bold mb-4">프로젝트 개요</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-600">
                                <div><strong className="font-semibold text-slate-800 block">파트너사</strong> {item.partner}</div>
                                <div><strong className="font-semibold text-slate-800 block">프로젝트 기간</strong> {item.period}</div>
                                <div><strong className="font-semibold text-slate-800 block">참여 인원</strong> {item.participants}명</div>
                            </div>
                        </div>
                        {/* 프로젝트 상세 스토리 */}
                        <div className="prose max-w-none text-slate-700">
                            <p>{item.story}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PortfolioDetailModal;
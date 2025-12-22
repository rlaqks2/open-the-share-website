/**
 * @file InquiryModal.tsx
 * @description '파트너십 문의' 기능을 위한 모달 컴포넌트입니다.
 * 이 컴포넌트는 내부적으로 두 가지 상태를 가집니다:
 * 1. 문의 폼(`InquiryForm`)을 보여주는 초기 상태
 * 2. 폼 제출이 완료된 후 성공 메시지(`SuccessMessage`)를 보여주는 상태
 * `isSubmitted` state를 통해 두 상태를 전환합니다.
 */
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import InquiryForm from '../forms/InquiryForm';

// InquiryModal 컴포넌트가 받는 props의 타입을 정의
interface InquiryModalProps {
    onClose: () => void; // 모달을 닫을 때 호출될 함수
}

// 폼 제출 성공 시 보여줄 메시지 컴포넌트
const SuccessMessage: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="text-center p-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-4xl">✓</div>
        <h3 className="text-xl font-bold mb-2">신청이 접수되었습니다</h3>
        <p className="text-slate-600 mb-6">담당자가 확인 후 연락드리겠습니다. 감사합니다.</p>
        <button onClick={onClose} className="w-full bg-emerald-600 text-white font-semibold py-2.5 rounded-lg hover:bg-emerald-700">확인</button>
    </div>
);

// 폼 제출 실패 시 보여줄 메시지 컴포넌트
const ErrorMessage: React.FC<{ onClose: () => void, onRetry: () => void }> = ({ onClose, onRetry }) => (
    <div className="text-center p-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-4xl">✕</div>
        <h3 className="text-xl font-bold mb-2">신청이 실패하였습니다</h3>
        <p className="text-slate-600 mb-6">일시적인 오류가 발생했습니다.<br />잠시 후 다시 시도해주세요.</p>
        <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-300">닫기</button>
            <button onClick={onRetry} className="flex-1 bg-rose-600 text-white font-semibold py-2.5 rounded-lg hover:bg-rose-700">다시 시도</button>
        </div>
    </div>
);

const InquiryModal: React.FC<InquiryModalProps> = ({ onClose }) => {
    // 폼 제출 여부를 관리하는 state
    const [isSubmitted, setSubmitted] = useState(false);
    // 폼 제출 실패 여부를 관리하는 state
    const [isError, setError] = useState(false);

    // content to render based on state
    let content;
    if (isSubmitted) {
        content = <SuccessMessage onClose={onClose} />;
    } else if (isError) {
        content = <ErrorMessage onClose={onClose} onRetry={() => setError(false)} />;
    } else {
        content = (
            <>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors" aria-label="닫기">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center" id="modal-title">파트너십 문의</h2>
                {/* InquiryForm의 onSubmitted prop으로 setSubmitted(true)를 전달하여,
                    폼 제출이 완료되면 isSubmitted 상태를 true로 변경 */}
                <InquiryForm
                    onSubmitted={() => setSubmitted(true)}
                    onError={() => setError(true)}
                />
            </>
        );
    }

    return (
        // 상태에 따라 모달의 최대 너비를 동적으로 변경
        <Modal open={true} onClose={onClose} maxWidth={(isSubmitted || isError) ? "max-w-sm" : "max-w-2xl"}>
            {content}
        </Modal>
    );
};

export default InquiryModal;
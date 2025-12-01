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

const InquiryModal: React.FC<InquiryModalProps> = ({ onClose }) => {
    // 폼 제출 여부를 관리하는 state
    const [isSubmitted, setSubmitted] = useState(false);

    return (
        // isSubmitted 값에 따라 모달의 최대 너비를 동적으로 변경
        <Modal open={true} onClose={onClose} maxWidth={isSubmitted ? "max-w-sm" : "max-w-lg"}>
            {isSubmitted ? (
                // 제출 완료 시 성공 메시지 렌더링
                <SuccessMessage onClose={onClose} />
            ) : (
                // 초기 상태일 때 문의 폼 렌더링
                <>
                    <h2 className="text-2xl font-bold mb-6 text-center" id="modal-title">파트너십 문의</h2>
                    {/* InquiryForm의 onSubmitted prop으로 setSubmitted(true)를 전달하여,
                        폼 제출이 완료되면 isSubmitted 상태를 true로 변경 */}
                    <InquiryForm onSubmitted={() => setSubmitted(true)} />
                </>
            )}
        </Modal>
    );
};

export default InquiryModal;
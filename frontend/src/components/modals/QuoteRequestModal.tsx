/**
 * @file QuoteRequestModal.tsx
 * @description 프로그램 견적 요청을 위한 모달입니다.
 * InquiryForm을 재사용하거나 별도의 폼을 구성할 수 있습니다.
 * 여기서는 InquiryForm을 재사용하되, 프로그램 정보를 미리 채워넣는 방식으로 구현합니다.
 */
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import InquiryForm from '../forms/InquiryForm';

interface QuoteRequestModalProps {
    program: any;
    onClose: () => void;
}

const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({ program, onClose }) => {
    const [isSubmitted, setSubmitted] = useState(false);

    return (
        <Modal open={true} onClose={onClose} maxWidth={isSubmitted ? "max-w-sm" : "max-w-2xl"}>
            {isSubmitted ? (
                <div className="text-center p-4">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-4xl">✓</div>
                    <h3 className="text-xl font-bold mb-2">견적 요청이 접수되었습니다</h3>
                    <p className="text-slate-600 mb-6">담당자가 확인 후 {program?.title} 관련 견적서를 보내드리겠습니다.</p>
                    <button onClick={onClose} className="w-full bg-emerald-600 text-white font-semibold py-2.5 rounded-lg hover:bg-emerald-700">확인</button>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-2 text-center">견적 요청</h2>
                    <p className="text-center text-slate-500 mb-6">
                        <span className="font-bold text-emerald-600">{program?.title}</span> 프로그램에 대한 견적을 문의합니다.
                    </p>
                    <InquiryForm
                        onSubmitted={() => setSubmitted(true)}
                        initialMessage={`[견적 요청] ${program?.title} 프로그램에 대한 견적을 문의합니다.`}
                    />
                </>
            )}
        </Modal>
    );
};

export default QuoteRequestModal;

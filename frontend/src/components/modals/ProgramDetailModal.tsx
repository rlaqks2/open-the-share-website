/**
 * @file ProgramDetailModal.tsx
 * @description 프로그램 상세 정보를 보여주는 모달입니다.
 */
import React from 'react';
import Modal from '../ui/Modal';

interface ProgramDetailModalProps {
    program: any;
    onClose: () => void;
    onRequestQuote: () => void;
}

const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({ program, onClose, onRequestQuote }) => {
    if (!program) return null;

    return (
        <Modal open={true} onClose={onClose} maxWidth="max-w-3xl">
            <div className="p-6">
                <div className="flex justify-center mb-6 text-6xl">
                    {program.icon}
                </div>
                <h2 className="text-3xl font-bold mb-4 text-center">{program.title}</h2>
                <p className="text-slate-600 mb-8 text-lg leading-relaxed text-center">
                    {program.description}
                </p>

                <div className="bg-slate-50 p-6 rounded-xl mb-8">
                    <h3 className="font-bold text-lg mb-3">프로그램 특징</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-700">
                        <li>맞춤형 커리큘럼 제공</li>
                        <li>전문 강사진의 체계적인 교육</li>
                        <li>실습 중심의 참여형 프로그램</li>
                        <li>결과물 도출 및 피드백 제공</li>
                    </ul>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-6 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                    >
                        닫기
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            onRequestQuote();
                        }}
                        className="flex-1 py-3 px-6 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                        견적 문의하기
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ProgramDetailModal;

/**
 * @file FindAccountModal.tsx
 * @description '계정 찾기' 기능을 위한 모달 컴포넌트입니다.
 * 사용자가 비밀번호를 잊었거나 계정 정보를 찾고 싶을 때 사용됩니다.
 * 가입 시 사용한 이메일 주소를 입력받아, 계정 복구 링크를 해당 이메일로
 * 발송하는 기능을 수행하는 UI를 제공합니다.
 */
import React from 'react';
import Modal from '../ui/Modal';

// FindAccountModal 컴포넌트가 받는 props의 타입을 정의
interface FindAccountModalProps {
    onClose: () => void; // 모달을 닫을 때 호출될 함수
}

const FindAccountModal: React.FC<FindAccountModalProps> = ({ onClose }) => {
    return (
        <Modal open={true} onClose={onClose} maxWidth="max-w-md">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-6" id="modal-title">계정찾기</h2>
            </div>
            <p className="text-center text-slate-600 mb-4">가입 시 사용한 이메일을 입력해주세요.</p>
            <form className="space-y-4">
                <input type="email" placeholder="이메일" className="w-full px-4 py-3 rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500" aria-label="이메일" />
                <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors">계정찾기 링크 발송</button>
            </form>
        </Modal>
    );
};

export default FindAccountModal;
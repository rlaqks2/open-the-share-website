/**
 * @file SignupModal.tsx
 * @description 사용자 '회원가입'을 위한 모달 컴포넌트입니다.
 * 사용자가 새로운 계정을 생성하는 데 필요한 정보(이름, 이메일, 비밀번호)를
 * 입력받는 폼을 제공합니다.
 * 이미 계정이 있는 사용자를 위해 '로그인' 모달로 이동할 수 있는 링크도 포함되어 있습니다.
 */
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { signup } from '../../api';

// SignupModal 컴포넌트가 받는 props의 타입을 정의
interface SignupModalProps {
    onClose: () => void;        // 모달을 닫을 때 호출될 함수
    onLoginClick: () => void;   // '로그인' 링크 클릭 시 호출될 함수
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onLoginClick }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await signup({ name, email, password });
            console.log('Signup successful:', response);
            alert('회원가입이 완료되었습니다!');
            onLoginClick(); // Redirect to login modal
        } catch (err: any) {
            setError(err.message || '회원가입에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={true} onClose={onClose} maxWidth="max-w-md">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-6" id="modal-title">회원가입</h2>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                <input
                    type="text"
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                    aria-label="이름"
                    required
                    disabled={loading}
                />
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                    aria-label="이메일"
                    required
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                    aria-label="비밀번호"
                    required
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? '가입 중...' : '가입하기'}
                </button>
                <div className="text-center text-sm text-slate-500 pt-4">
                    이미 계정이 있으신가요? <button type="button" onClick={onLoginClick} className="font-semibold text-emerald-600 hover:underline">로그인</button>
                </div>
            </form>
        </Modal>
    );
};

export default SignupModal;
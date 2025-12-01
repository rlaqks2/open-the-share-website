/**
 * @file LoginModal.tsx
 * @description 사용자 '로그인'을 위한 모달 컴포넌트입니다.
 * 이메일과 비밀번호 입력 필드, 로그인 상태 유지 체크박스,
 * 그리고 카카오/네이버와 같은 소셜 로그인 옵션을 제공합니다.
 * 또한, '회원가입'이나 '계정찾기' 등 다른 인증 관련 모달로 이동할 수 있는 링크를 포함합니다.
 */
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { login } from '../../api';

// LoginModal 컴포넌트가 받는 props의 타입을 정의
interface LoginModalProps {
    onClose: () => void;            // 모달을 닫을 때 호출될 함수
    onSignupClick: () => void;      // '회원가입' 링크 클릭 시 호출될 함수
    onFindAccountClick: () => void; // '계정찾기' 링크 클릭 시 호출될 함수
    onLogin: () => void;            // 로그인 성공 시 호출될 함수
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSignupClick, onFindAccountClick, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 폼 제출 이벤트 핸들러
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login({ email, password });
            console.log('Login successful:', response);
            onLogin();
        } catch (err: any) {
            setError(err.message || '로그인에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={true} onClose={onClose} maxWidth="max-w-md">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-6" id="modal-title">로그인</h2>
            </div>
            <form className="space-y-4" onSubmit={handleLogin}>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}
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
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                        로그인 상태 유지
                    </label>
                </div>
                <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? '로그인 중...' : '로그인'}
                </button>
                <div className="text-center text-sm text-slate-500 py-4">
                    <span className="px-2">또는</span>
                </div>
                {/* 소셜 로그인 버튼 */}
                <div className="flex gap-4">
                    <button type="button" className="w-full bg-[#FEE500] text-slate-800 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1.5-10.5c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5-3.5-1.57-3.5-3.5zm-5 4.5c.167-.833 1.5-2.5 4-2.5s3.833 1.667 4 2.5v1H5.5v-1z" /></svg>
                        카카오 로그인
                    </button>
                    <button type="button" className="w-full bg-[#03C75A] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16"><path d="M15.353 3.353l-9.899 9.899L0 7.899l1.414-1.414L5.454 10.07l8.485-8.485L15.353 3.353z" /></svg>
                        네이버 로그인
                    </button>
                </div>
                {/* 회원가입 및 계정찾기 링크 */}
                <div className="text-center text-sm text-slate-500 pt-4">
                    <button type="button" onClick={onSignupClick} className="hover:underline">회원가입</button>
                    <span className="mx-2">|</span>
                    <button type="button" onClick={onFindAccountClick} className="hover:underline">계정찾기</button>
                </div>
            </form>
        </Modal>
    );
};

export default LoginModal;
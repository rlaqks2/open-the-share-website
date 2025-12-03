/**
 * @file Modal.tsx
 * @description 재사용 가능한 범용 모달(팝업) 컴포넌트입니다.
 * 반투명한 배경(backdrop)과 콘텐츠를 담을 수 있는 영역을 제공합니다.
 * 주요 기능:
 * - `open` prop을 통해 표시 여부를 제어합니다.
 * - 모달이 열려 있는 동안 페이지의 배경 스크롤을 막습니다.
 * - 배경을 클릭하거나 키보드의 'Escape' 키를 누르면 모달이 닫힙니다.
 * - `maxWidth`, `noPadding` 등의 옵션을 통해 유연하게 스타일을 조절할 수 있습니다.
 */
import React, { useEffect } from 'react';

// Modal 컴포넌트가 받는 props들의 타입을 정의
interface ModalProps {
    open: boolean;                  // 모달의 열림 상태 (true: 열림, false: 닫힘)
    onClose: () => void;            // 모달을 닫을 때 호출될 함수
    children: React.ReactNode;      // 모달 내부에 표시될 콘텐츠
    maxWidth?: string;              // 모달의 최대 너비 (Tailwind CSS 클래스, 예: 'max-w-lg')
    noPadding?: boolean;            // 내부 패딩 제거 여부
    showCloseButton?: boolean;      // 닫기 버튼 표시 여부
}

const Modal: React.FC<ModalProps> = ({
    open,
    onClose,
    children,
    maxWidth = 'max-w-lg', // 기본 최대 너비 설정
    noPadding = false,
    showCloseButton = true
}) => {
    // useEffect를 사용하여 모달의 열림/닫힘 상태에 따른 부수 효과(side effect)를 관리
    useEffect(() => {
        // 키보드 이벤트 핸들러
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose(); // 'Escape' 키를 누르면 onClose 함수 호출
        };

        if (open) {
            // 모달이 열리면 body의 스크롤을 막음
            document.body.style.overflow = 'hidden';
            // 키다운 이벤트 리스너 등록
            document.addEventListener('keydown', onKey);
        } else {
            // 모달이 닫히면 body 스크롤을 다시 허용
            document.body.style.overflow = 'auto';
        }

        // 컴포넌트가 언마운트되거나 open 상태가 변경되기 전에 실행될 클린업(정리) 함수
        return () => {
            document.body.style.overflow = 'auto';
            document.removeEventListener('keydown', onKey); // 이벤트 리스너 제거
        }
    }, [open, onClose]); // open 또는 onClose가 변경될 때만 이 useEffect를 다시 실행

    // open 상태가 false이면 아무것도 렌더링하지 않음
    if (!open) return null;

    return (
        // role, aria-* 속성을 사용하여 웹 접근성을 준수
        <div className="fixed inset-0 z-50 animate-modalFadeIn" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* 반투명 배경. 클릭 시 onClose 함수 호출 */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    // 전달받은 props에 따라 동적으로 클래스 적용
                    className={`relative w-full ${maxWidth} rounded-2xl bg-white shadow-xl ${noPadding ? '' : 'p-6'}`}
                    role="document"
                    // 모달 콘텐츠 영역 클릭 시 이벤트가 배경으로 전파되는 것을 막음(이벤트 버블링 방지)
                    onClick={(e) => e.stopPropagation()}
                >
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
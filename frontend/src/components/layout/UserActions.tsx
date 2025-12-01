import React from 'react';

interface UserActionsProps {
    isLoggedIn: boolean;
    onSearchClick: () => void;
    onInquiryClick: () => void;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    isMobile?: boolean;
}

const UserActions: React.FC<UserActionsProps> = ({
    isLoggedIn,
    onSearchClick,
    onInquiryClick,
    onLoginClick,
    onLogoutClick,
    isMobile = false
}) => {
    if (isMobile) {
        // Mobile layout
        return (
            <div className="border-t pt-4 space-y-2">
                {isLoggedIn ? (
                    <button
                        onClick={onLogoutClick}
                        className="w-full text-left block px-4 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-600"
                    >
                        로그아웃
                    </button>
                ) : (
                    <button
                        onClick={onLoginClick}
                        className="w-full text-left block px-4 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-600"
                    >
                        로그인
                    </button>
                )}
                <button
                    onClick={onInquiryClick}
                    className="w-full text-left block px-4 py-2 rounded-md font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-600"
                >
                    파트너십 문의
                </button>
            </div>
        );
    }

    // Desktop layout
    return (
        <div className="flex items-center space-x-3">
            <button
                onClick={onSearchClick}
                className="p-2.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all duration-300"
                aria-label="검색"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </button>
            <button
                onClick={onInquiryClick}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold px-6 py-2.5 rounded-full hover:from-emerald-500 hover:to-emerald-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
                <span>파트너십 문의</span>
            </button>
            {isLoggedIn ? (
                <button
                    onClick={onLogoutClick}
                    className="hidden sm:block font-medium text-slate-700 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-all duration-300"
                >
                    로그아웃
                </button>
            ) : (
                <button
                    onClick={onLoginClick}
                    className="hidden sm:block font-medium text-slate-700 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-all duration-300"
                >
                    로그인
                </button>
            )}
        </div>
    );
};

export default UserActions;

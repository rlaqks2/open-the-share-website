/**
 * @file LoadingScreen.tsx
 * @description 브랜디드 로딩 화면 컴포넌트
 */

const LoadingScreen = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <div className="text-center">
                <div className="inline-block relative">
                    {/* Animated circles */}
                    <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span className="text-2xl">🤝</span>
                    </div>
                </div>
                <h2 className="mt-6 text-xl font-semibold text-slate-700">
                    오픈더쉐어
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    기업 사회공헌을 준비하고 있습니다...
                </p>
            </div>
        </div>
    );
};

export default LoadingScreen;

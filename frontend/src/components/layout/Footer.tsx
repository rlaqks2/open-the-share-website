/**
 * @file Footer.tsx
 * @description 웹사이트의 푸터(하단 정보) 컴포넌트입니다.
 * 이 컴포넌트는 모든 페이지의 맨 아래에 공통적으로 표시되며,
 * 사이트맵 링크, 정책 관련 링크, 소셜 미디어 링크, 회사 주소 및 연락처,
 * 그리고 저작권 정보를 포함합니다.
 */
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-50 border-t">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* 로고 및 슬로건 */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <h3 className="text-2xl font-black text-emerald-600 mb-4">OpenThe Share</h3>
                        <p className="text-sm text-slate-500">기업의 ESG 경영을 위한 최적의 사회공헌 파트너</p>
                    </div>
                    {/* 바로가기 링크 */}
                    <div>
                        <h4 className="font-semibold text-slate-800 mb-4">바로가기</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#about" className="text-slate-600 hover:text-emerald-600">소개</a></li>
                            <li><a href="#programs" className="text-slate-600 hover:text-emerald-600">사업분야</a></li>
                            <li><a href="#portfolio" className="text-slate-600 hover:text-emerald-600">포트폴리오</a></li>
                            <li><a href="#faq" className="text-slate-600 hover:text-emerald-600">FAQ</a></li>
                        </ul>
                    </div>
                    {/* 정책 관련 링크 */}
                    <div>
                        <h4 className="font-semibold text-slate-800 mb-4">정책</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-slate-600 hover:text-emerald-600">개인정보처리방침</a></li>
                            <li><a href="#" className="text-slate-600 hover:text-emerald-600">이용약관</a></li>
                        </ul>
                    </div>
                    {/* 소셜 미디어 링크 */}
                    <div>
                        <h4 className="font-semibold text-slate-800 mb-4">소셜</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-slate-500 hover:text-emerald-600" aria-label="블로그"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" role="img"><path d="M19.5 3h-15A2.5 2.5 0 002 5.5v13A2.5 2.5 0 004.5 21h15a2.5 2.5 0 002.5-2.5v-13A2.5 2.5 0 0019.5 3zM6.5 18H5V9h1.5v9zm.75-10.5a.75.75 0 110-1.5.75.75 0 010 1.5zM18 18h-1.5v-4.25c0-1.09-.02-2.49-1.5-2.49s-1.74 1.18-1.74 2.41V18H11V9h1.44v.66h.02c.2-.38.69-.78 1.48-.78 1.58 0 1.87 1.04 1.87 2.39V18z"></path></svg></a>
                            <a href="#" className="text-slate-500 hover:text-emerald-600" aria-label="페이스북"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" role="img"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89H8.078v-2.89h2.36V9.601c0-2.328 1.38-3.626 3.518-3.626 1.002 0 1.865.074 2.115.108v2.585h-1.51c-1.129 0-1.35.536-1.35 1.325v1.743h2.88l-.373 2.89h-2.508v7.008C18.343 21.128 22 16.991 22 12z"></path></svg></a>
                            <a href="#" className="text-slate-500 hover:text-emerald-600" aria-label="인스타그램"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" role="img"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.802C8.906 3.965 8.57 3.977 7.292 4.03c-2.936.134-4.14 1.34-4.274 4.274-.053 1.277-.064 1.613-.064 4.695s.011 3.418.064 4.695c.134 2.936 1.338 4.14 4.274 4.274 1.277.053 1.613.064 4.695.064s3.418-.011 4.695-.064c2.936-.134 4.14-1.338 4.274-4.274.053-1.277.064-1.613.064-4.695s-.011-3.418-.064-4.695c-.134-2.936-1.338-4.14-4.274-4.274-1.277-.053-1.613-.064-4.695-.064zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z"></path></svg></a>
                        </div>
                    </div>
                </div>
                {/* 하단 정보 및 저작권 */}
                <div className="mt-12 border-t border-slate-200 pt-8">
                    <div className="text-sm text-slate-500 space-y-1">
                        <p>(주)오픈더쉐어 | 대표 : 김진솔 | 사업자등록번호 : 504-81-28956</p>
                        <p>경기도 성남시 수정구 창업로 54, 822호</p>
                        <p>Tel : 031-8039-7034 | Mobile : 010-7512-7032 | Fax : 031-8057-7032 | E-mail : opentheshare@naver.com</p>
                    </div>
                    <p className="mt-4 text-xs text-slate-400">&copy; {new Date().getFullYear()} OpenThe Share Inc. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
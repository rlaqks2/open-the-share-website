/**
 * @file Footer.tsx
 * @description 웹사이트 하단 푸터 컴포넌트입니다.
 * 실제 openthe.kr의 공식 푸터 로고(footer_logo.png)와 기업 정보((주)오픈더쉐어, 대표 김진솔, 사업자등록번호, 판교 주소, 연락처),
 * 공식 네이버 블로그(https://blog.naver.com/5penthe), 유튜브, 인스타그램, 페이스북 링크를 표시합니다.
 */
import React from 'react';
import { mockData } from '../../data/mockData';
import footerLogoImg from '../../assets/footer_logo.png';

/* 공식 채널 로고 아이콘 (인라인 SVG — 외부 이미지 요청 없음, currentColor 로 색 전환) */
const YouTubeIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const InstagramIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.25" />
        <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
);

const SOCIAL_LINKS = [
    { key: 'youtube', label: 'YouTube', hoverClass: 'hover:bg-[#FF0000]', Icon: YouTubeIcon },
    {
        key: 'instagram',
        label: 'Instagram',
        hoverClass: 'hover:bg-gradient-to-tr hover:from-[#FEDA75] hover:via-[#D62976] hover:to-[#4F5BD5]',
        Icon: InstagramIcon,
    },
    { key: 'facebook', label: 'Facebook', hoverClass: 'hover:bg-[#1877F2]', Icon: FacebookIcon },
] as const;

interface FooterProps {
    onNavigateHome?: (sectionId?: string) => void;
    onNavigatePortfolio?: () => void;
    /** 개인정보 처리방침 모달 열기 */
    onOpenPrivacy?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateHome, onNavigatePortfolio, onOpenPrivacy }) => {
    const { companyInfo, partners, portfolioItems } = mockData;

    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* 공식 푸터 로고 및 슬로건 */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <div className="mb-4">
                            <img
                                src={footerLogoImg}
                                alt="Open The Share 오픈더쉐어"
                                className="h-8 w-auto object-contain brightness-0 invert opacity-90"
                            />
                            <p className="text-xs text-emerald-400 font-bold mt-2">(주)오픈더쉐어</p>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed break-keep">
                            더 나은 사회를 위한 고민, 오픈더쉐어가 함께합니다. 기업 맞춤형 대면 사회공헌(온앤온) 및 비대면 사회공헌(온팅) 전문 파트너.
                        </p>
                    </div>

                    {/* 바로가기 링크 */}
                    <div>
                        <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">바로가기</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <button
                                    onClick={() => onNavigateHome && onNavigateHome('about')}
                                    className="text-slate-400 hover:text-emerald-400 transition-colors text-left"
                                >
                                    회사소개 · 핵심가치(O.P.E.N)
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onNavigateHome && onNavigateHome('programs')}
                                    className="text-slate-400 hover:text-emerald-400 transition-colors text-left"
                                >
                                    사업소개 (온앤온 · 온팅)
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onNavigatePortfolio && onNavigatePortfolio()}
                                    className="hover:text-emerald-400 transition-colors font-semibold text-emerald-300 text-left"
                                >
                                    포트폴리오 전용 페이지 ({portfolioItems.length}건)
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onNavigateHome && onNavigateHome('partners')}
                                    className="text-slate-400 hover:text-emerald-400 transition-colors text-left"
                                >
                                    함께한 참여기관 ({partners.length}개)
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => onNavigateHome && onNavigateHome('faq')}
                                    className="text-slate-400 hover:text-emerald-400 transition-colors text-left"
                                >
                                    자주 묻는 질문 (FAQ)
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* 문의 안내 */}
                    <div>
                        <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">파트너십 상담센터</h4>
                        <div className="space-y-2 text-sm text-slate-400">
                            <p className="text-lg font-extrabold text-white whitespace-nowrap">{companyInfo.tel}</p>
                            <p className="whitespace-nowrap">휴대전화 : {companyInfo.mobile}</p>
                            <p className="whitespace-nowrap">팩스 : {companyInfo.fax}</p>
                            <p className="break-all">이메일 : {companyInfo.email}</p>
                            <p className="text-xs text-slate-500 pt-1">평일 09:00 - 18:00 (주말·공휴일 휴무)</p>
                        </div>
                    </div>

                    {/* 공식 채널 */}
                    <div>
                        <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">공식 채널</h4>
                        <div className="flex flex-col space-y-2.5 text-sm">
                            <a
                                href={companyInfo.socials.blog}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#03C75A]/15 text-[#03C75A] hover:bg-[#03C75A] hover:text-white font-bold transition-colors whitespace-nowrap"
                            >
                                <span className="w-2 h-2 rounded-full bg-current shrink-0"></span>
                                <span>네이버 공식 블로그</span>
                            </a>
                            <div className="flex items-center gap-2.5 pt-2">
                                {SOCIAL_LINKS.map(({ key, label, hoverClass, Icon }) => (
                                    <a
                                        key={key}
                                        href={companyInfo.socials[key]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`오픈더쉐어 ${label} (새 창)`}
                                        title={label}
                                        className={`w-11 h-11 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center transition-all hover:text-white hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${hoverClass}`}
                                    >
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 사업자 정보 */}
                <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="text-xs text-slate-400 space-y-1.5 break-keep">
                        <p>
                            {companyInfo.name} | 대표 : {companyInfo.ceo} | 사업자등록번호 : {companyInfo.bizNo}
                        </p>
                        <p>주소 : {companyInfo.address}</p>
                        <p>
                            Tel : {companyInfo.tel} | Mobile : {companyInfo.mobile} | Fax : {companyInfo.fax} | E-mail :{' '}
                            {companyInfo.email}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 whitespace-nowrap shrink-0">
                        {onOpenPrivacy && (
                            <button
                                type="button"
                                onClick={onOpenPrivacy}
                                className="font-bold text-slate-200 hover:text-white underline-offset-4 hover:underline transition-colors"
                            >
                                개인정보처리방침
                            </button>
                        )}
                        <span>&copy; {new Date().getFullYear()} OPEN THE SHARE Inc. All Rights Reserved.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

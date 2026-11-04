/**
 * @file Footer.tsx
 * @description 웹사이트 하단 푸터 컴포넌트입니다.
 * 실제 openthe.kr의 공식 푸터 로고(footer_logo.png)와 기업 정보((주)오픈더쉐어, 대표 김진솔, 사업자등록번호, 판교 주소, 연락처),
 * 공식 네이버 블로그(https://blog.naver.com/5penthe), 유튜브, 인스타그램, 페이스북 링크를 표시합니다.
 */
import React from 'react';
import { mockData } from '../../data/mockData';
import footerLogoImg from '../../assets/footer_logo.png';

interface FooterProps {
    onNavigateHome?: (sectionId?: string) => void;
    onNavigatePortfolio?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateHome, onNavigatePortfolio }) => {
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
                                <span>네이버 공식 블로그 (5penthe)</span>
                            </a>
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                                <a
                                    href={companyInfo.socials.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors whitespace-nowrap"
                                >
                                    YouTube
                                </a>
                                <a
                                    href={companyInfo.socials.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors whitespace-nowrap"
                                >
                                    Instagram
                                </a>
                                <a
                                    href={companyInfo.socials.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors whitespace-nowrap"
                                >
                                    Facebook
                                </a>
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
                    <p className="text-xs text-slate-500 whitespace-nowrap shrink-0">
                        &copy; {new Date().getFullYear()} OPEN THE SHARE Inc. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

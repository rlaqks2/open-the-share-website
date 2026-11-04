/**
 * @file TestimonialsSection.tsx
 * @description openthe.kr의 실제 '언론보도(Press Release)' 소식과 파트너사 담당자 후기를 함께 보여주는 섹션입니다.
 */
import React from 'react';
import { mockData } from '../../data/mockData';

const TestimonialsSection: React.FC = () => {
    const { pressReleases, testimonials } = mockData;

    return (
        <section id="testimonials" className="py-24 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 space-y-20">
                {/* 1. 언론보도 & 공지 소식 (openthe.kr 실 데이터) */}
                <div>
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold mb-3">
                            PRESS &amp; MEDIA
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
                            언론에 보도된 오픈더쉐어 소식
                        </h2>
                        <p className="text-slate-600 text-base">
                            다양한 기업·기관과 함께 만들어가는 사회공헌 활동 소식을 전해드립니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pressReleases.map((news) => (
                            <a
                                key={news.id}
                                href={news.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-[#F8FAF9] rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-400 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                                            {news.source}
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium">{news.date}</span>
                                    </div>
                                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug mb-2">
                                        {news.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                        {news.summary}
                                    </p>
                                </div>
                                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-emerald-600">
                                    <span>보도자료 자세히 보기</span>
                                    <span>&rarr;</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* 2. 파트너사 담당자 후기 */}
                <div>
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="inline-block px-3.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-extrabold mb-3">
                            PARTNER VOICES
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                            함께한 파트너사 담당자 후기
                        </h3>
                        <p className="text-slate-500 text-sm">
                            기획부터 현장 운영, 결과 보고까지 오픈더쉐어와 함께한 실제 파트너들의 목소리입니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                        {testimonials.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="text-emerald-500 text-2xl font-serif mb-3">“</div>
                                    <p className="text-slate-700 text-sm leading-relaxed mb-6">{item.quote}</p>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center">
                                        {item.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-extrabold text-slate-900 text-sm">{item.name} 담당자</div>
                                        <div className="text-xs text-slate-500">{item.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;

/**
 * @file TestimonialsSection.tsx
 * @description openthe.kr의 실제 '언론보도(Press Release)' 소식과 파트너사 담당자 후기를 함께 보여주는 섹션입니다.
 * 언론보도는 사용자가 옆으로 매끄럽게 넘겨볼 수 있는 반응형 슬라이더(Carousel)와 네비게이션 버튼을 제공합니다.
 */
import React, { useRef, useState, useEffect } from 'react';
import { mockData } from '../../data/mockData';

const TestimonialsSection: React.FC = () => {
    const { pressReleases, testimonials } = mockData;
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    // 스크롤 위치 감지하여 좌우 화살표 활성화 여부 갱신
    const checkScrollPosition = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        checkScrollPosition();
        el.addEventListener('scroll', checkScrollPosition, { passive: true });
        window.addEventListener('resize', checkScrollPosition);
        return () => {
            el.removeEventListener('scroll', checkScrollPosition);
            window.removeEventListener('resize', checkScrollPosition);
        };
    }, []);

    // 4.5초마다 부드럽게 다음 카드로 자동 슬라이드 (마우스 오버 시 일시정지)
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            if (!scrollRef.current) return;
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            if (scrollLeft >= scrollWidth - clientWidth - 20) {
                // 맨 끝에 도달하면 처음으로 부드럽게 되돌아감
                scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                scroll('right');
            }
        }, 4500);

        return () => clearInterval(interval);
    }, [isPaused]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const cardWidth = 380; // 카드 너비 + 간격 기준
        const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return (
        <section id="testimonials" className="py-24 bg-white border-t border-slate-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 space-y-24">
                {/* 1. 언론보도 슬라이더 섹션 */}
                <div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold mb-3">
                                PRESS &amp; MEDIA
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                언론에 보도된 오픈더쉐어 소식
                            </h2>
                            <p className="text-slate-600 text-sm md:text-base mt-2">
                                주요 언론사를 통해 보도된 신뢰할 수 있는 공식 활동 소식입니다.
                            </p>
                        </div>

                        {/* 슬라이드 좌우 이동 컨트롤러 버튼 */}
                        <div className="flex items-center gap-2 self-end md:self-auto">
                            <button
                                onClick={() => scroll('left')}
                                disabled={!canScrollLeft}
                                aria-label="이전 언론보도 보기"
                                className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
                                    canScrollLeft
                                        ? 'border-slate-300 bg-white text-slate-700 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700 shadow-sm'
                                        : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                disabled={!canScrollRight}
                                aria-label="다음 언론보도 보기"
                                className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
                                    canScrollRight
                                        ? 'border-slate-300 bg-white text-slate-700 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700 shadow-sm'
                                        : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* 가로 슬라이더 컨테이너 (스크롤바 숨김 + 스냅 기능) */}
                    <div
                        ref={scrollRef}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                        className="flex gap-5 overflow-x-auto pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth no-scrollbar snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {pressReleases.map((news) => (
                            <a
                                key={news.id}
                                href={news.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="snap-start shrink-0 w-[300px] sm:w-[350px] md:w-[370px] bg-[#F8FAF9] rounded-3xl p-6 md:p-7 border border-slate-200/90 hover:border-emerald-500 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black">
                                                {news.source}
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold text-slate-500 bg-slate-100">
                                                {news.category}
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-400 font-medium">{news.date}</span>
                                    </div>

                                    <h3 className="text-base md:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2 mb-3">
                                        {news.title}
                                    </h3>

                                    <p className="text-xs md:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                        {news.summary}
                                    </p>
                                </div>

                                <div className="pt-4 mt-6 border-t border-slate-200/70 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                                    <span className="flex items-center gap-1.5">
                                        기사 원문 읽기
                                        <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </span>
                                    <span className="text-slate-300 group-hover:text-emerald-600 font-black transition-colors">&rarr;</span>
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

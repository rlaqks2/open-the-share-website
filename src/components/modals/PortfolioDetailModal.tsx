/**
 * @file PortfolioDetailModal.tsx
 * @description 선택된 '포트폴리오' 항목의 상세 스토리와 현장 스케치 갤러리를 보여주는 모달 컴포넌트입니다.
 * 카카오 같이가치 / 네이버 해피빈 스타일의 스토리텔링 레이아웃과 현장 사진 슬라이더,
 * 공식 네이버 블로그(https://blog.naver.com/5penthe) 원문 바로가기 기능을 제공합니다.
 */
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { PortfolioItem } from '../../types';

interface PortfolioDetailModalProps {
    item: PortfolioItem | null;
    onClose: () => void;
}

const PortfolioDetailModal: React.FC<PortfolioDetailModalProps> = ({ item, onClose }) => {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        setActiveImageIndex(0);
    }, [item]);

    if (!item) return null;

    const images =
        item.galleryUrls && item.galleryUrls.length > 0 ? item.galleryUrls : [item.imageUrl];
    const currentImage = images[activeImageIndex] || item.imageUrl;

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (e.currentTarget.src !== item.imageUrl) {
            e.currentTarget.src = item.imageUrl;
        }
    };

    return (
        <Modal open={true} onClose={onClose} maxWidth="max-w-4xl" noPadding={true}>
            <div className="relative bg-white rounded-2xl overflow-hidden">
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-black/55 text-white rounded-full p-2.5 hover:bg-black/80 transition-colors shadow-md"
                    aria-label="닫기"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="max-h-[88vh] overflow-y-auto">
                    {/* 메인 대표/선택 이미지 영역 */}
                    <div className="relative w-full h-80 md:h-[420px] bg-slate-900 flex items-center justify-center overflow-hidden">
                        <img
                            src={currentImage}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            onError={handleImageError}
                            className="w-full h-full object-contain bg-slate-950"
                        />

                        {/* 이전/다음 이미지 네비게이션 버튼 */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() =>
                                        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)
                                    }
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2.5 transition-colors"
                                    aria-label="이전 사진"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-2.5 transition-colors"
                                    aria-label="다음 사진"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <div className="absolute bottom-3 right-4 bg-black/65 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                                    {activeImageIndex + 1} / {images.length}
                                </div>
                            </>
                        )}
                    </div>

                    {/* 현장 스케치 썸네일 스트립 */}
                    {images.length > 1 && (
                        <div className="bg-slate-900 px-6 py-3 flex items-center gap-2.5 overflow-x-auto border-t border-slate-800">
                            {images.map((imgUrl, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                                        activeImageIndex === idx
                                            ? 'border-emerald-400 scale-105 opacity-100'
                                            : 'border-transparent opacity-60 hover:opacity-90'
                                    }`}
                                >
                                    <img
                                        src={imgUrl}
                                        alt={`${item.title} 현장사진 ${idx + 1}`}
                                        referrerPolicy="no-referrer"
                                        onError={handleImageError}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 상세 텍스트 콘텐츠 */}
                    <div className="p-6 md:p-10">
                        {/* 상단 배지 */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white whitespace-nowrap">
                                {item.orgType}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                                {item.category}
                            </span>
                            <span className="text-xs text-slate-400 font-medium ml-auto whitespace-nowrap">
                                {item.period}
                            </span>
                        </div>

                        {/* 제목 */}
                        <h2
                            className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-snug break-keep"
                            id="modal-title"
                        >
                            {item.title}
                        </h2>

                        {/* 해시태그 */}
                        {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {item.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* 프로젝트 요약 정보 박스 */}
                        <div className="bg-[#F8FAF9] rounded-2xl p-5 md:p-6 mb-8 border border-emerald-100">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-100 min-w-0">
                                    <span className="block text-xs font-semibold text-slate-400 mb-1">함께한 참여기관</span>
                                    <span className="font-extrabold text-slate-900 text-sm sm:text-base break-keep block">
                                        {item.partner}
                                    </span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-100 min-w-0">
                                    <span className="block text-xs font-semibold text-slate-400 mb-1">진행 일자</span>
                                    <span className="font-extrabold text-slate-900 text-sm sm:text-base whitespace-nowrap block">
                                        {item.period}
                                    </span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-100 min-w-0">
                                    <span className="block text-xs font-semibold text-slate-400 mb-1">활동 구분 · 규모</span>
                                    <span className="font-extrabold text-emerald-700 text-sm sm:text-base break-keep block">
                                        {item.orgType} (약 {item.participants}명 참여)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 본문 스토리 */}
                        <div className="mb-8">
                            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                                PROJECT STORY
                            </h3>
                            <div className="text-slate-700 leading-relaxed whitespace-pre-line text-base bg-slate-50/70 p-6 rounded-2xl border border-slate-100 break-keep">
                                {item.story}
                            </div>
                        </div>

                        {/* 하단 액션 버튼 */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-slate-200">
                            <div className="text-xs text-slate-500 break-keep">
                                * 공식 네이버 블로그에서 전체 현장 스케치 사진과 상세 후기를 확인하실 수 있습니다.
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-3 rounded-full border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors whitespace-nowrap"
                                >
                                    닫기
                                </button>
                                {item.blogLink && (
                                    <a
                                        href={item.blogLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 sm:flex-initial text-center inline-flex items-center justify-center gap-2 bg-[#03C75A] text-white font-bold px-6 py-3 rounded-full hover:bg-[#02b350] transition-colors text-sm shadow-sm whitespace-nowrap"
                                    >
                                        <span>네이버 공식 블로그 원문 보기</span>
                                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2.5"
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PortfolioDetailModal;

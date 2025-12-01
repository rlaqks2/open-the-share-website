/**
 * @file ProgramFilterSection.tsx
 * @description 봉사 프로그램 필터 및 검색 섹션
 */
import { useState } from 'react';

interface Program {
    id: number;
    title: string;
    description: string;
    icon: string;
    category: string;
    minParticipants: number;
    maxParticipants: number;
    duration: string;
    location: string[];
    price: string;
}

const ProgramFilterSection = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [selectedSize, setSelectedSize] = useState('전체');

    const programs: Program[] = [
        {
            id: 1,
            title: '도심 숲 가꾸기',
            description: '미세먼지 저감과 도시 열섬 현상 완화를 위한 나무 심기 및 관리 활동',
            icon: '🌳',
            category: '환경보호',
            minParticipants: 30,
            maxParticipants: 150,
            duration: '4시간',
            location: ['서울', '경기', '인천'],
            price: '견적 문의'
        },
        {
            id: 2,
            title: '주거 환경 개선 봉사',
            description: '취약계층 가정의 도배, 장판 교체, 청소 등 주거 환경 개선',
            icon: '🏘️',
            category: '지역사회 기여',
            minParticipants: 20,
            maxParticipants: 60,
            duration: '5-6시간',
            location: ['전국'],
            price: '견적 문의'
        },
        {
            id: 3,
            title: '청소년 코딩 멘토링',
            description: '소외계층 청소년 대상 IT 교육 및 진로 멘토링 프로그램',
            icon: '🎓',
            category: '아동/청소년 지원',
            minParticipants: 10,
            maxParticipants: 40,
            duration: '3시간 × 4회',
            location: ['서울', '수도권'],
            price: '견적 문의'
        },
        {
            id: 4,
            title: '해양 정화 활동',
            description: '해변 및 해양 쓰레기 수거를 통한 해양 생태계 보호',
            icon: '🌊',
            category: '환경보호',
            minParticipants: 40,
            maxParticipants: 200,
            duration: '3-4시간',
            location: ['부산', '인천', '강원'],
            price: '견적 문의'
        },
        {
            id: 5,
            title: '문화소외계층 공연 지원',
            description: '문화 혜택을 받기 어려운 분들을 위한 공연 및 전시 관람 지원',
            icon: '🎨',
            category: '문화/예술 나눔',
            minParticipants: 15,
            maxParticipants: 50,
            duration: '2-3시간',
            location: ['전국'],
            price: '견적 문의'
        },
        {
            id: 6,
            title: '벽화 그리기',
            description: '노후 주택가 담벼락에 희망을 그리는 마을 벽화 봉사',
            icon: '🎨',
            category: '지역사회 기여',
            minParticipants: 25,
            maxParticipants: 80,
            duration: '4-5시간',
            location: ['서울', '경기', '지방'],
            price: '견적 문의'
        },
        {
            id: 7,
            title: '독거 어르신 도시락 나눔',
            description: '거동이 불편한 독거 어르신들에게 영양 도시락 배달 및 안부 확인',
            icon: '🍱',
            category: '지역사회 기여',
            minParticipants: 20,
            maxParticipants: 100,
            duration: '3-4시간',
            location: ['전국'],
            price: '견적 문의'
        },
        {
            id: 8,
            title: '학습 환경 개선',
            description: '교육 소외 지역 학교 및 도서관 환경 개선 및 도서 기증',
            icon: '📚',
            category: '아동/청소년 지원',
            minParticipants: 30,
            maxParticipants: 100,
            duration: '5-6시간',
            location: ['전국'],
            price: '견적 문의'
        }
    ];

    const categories = ['전체', '환경보호', '지역사회 기여', '아동/청소년 지원', '문화/예술 나눔'];
    const sizes = [
        { label: '전체', value: '전체' },
        { label: '소규모 (10-30명)', value: 'small' },
        { label: '중규모 (31-80명)', value: 'medium' },
        { label: '대규모 (81명 이상)', value: 'large' }
    ];

    const filteredPrograms = programs.filter(program => {
        const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            program.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === '전체' || program.category === selectedCategory;

        let matchesSize = true;
        if (selectedSize === 'small') matchesSize = program.maxParticipants <= 30;
        else if (selectedSize === 'medium') matchesSize = program.minParticipants <= 80 && program.maxParticipants >= 31;
        else if (selectedSize === 'large') matchesSize = program.minParticipants >= 50;

        return matchesSearch && matchesCategory && matchesSize;
    });

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 scroll-animate">
                    <h2 className="text-4xl font-bold text-slate-800 mb-4">
                        프로그램 찾기
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        우리 회사에 딱 맞는 봉사 프로그램을 찾아보세요
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="max-w-5xl mx-auto mb-12 scroll-animate">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="프로그램 검색... (예: 환경, 청소년, 벽화)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-6 py-4 pl-14 text-lg border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                            />
                            <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                카테고리
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Size Filter */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                참여 규모
                            </label>
                            <select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                {sizes.map(size => (
                                    <option key={size.value} value={size.value}>{size.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="max-w-5xl mx-auto mb-6">
                    <p className="text-slate-600">
                        <span className="font-semibold text-blue-600">{filteredPrograms.length}</span>개의 프로그램을 찾았습니다
                    </p>
                </div>

                {/* Program Grid */}
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
                    {filteredPrograms.map((program) => (
                        <div
                            key={program.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group scroll-animate border-2 border-transparent hover:border-blue-200"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="text-5xl">{program.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2">
                                            {program.title}
                                        </h3>
                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                            {program.category}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    {program.description}
                                </p>

                                <div className="space-y-2 mb-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">👥 참여 인원:</span>
                                        <span>{program.minParticipants}~{program.maxParticipants}명</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">⏱️ 소요 시간:</span>
                                        <span>{program.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">📍 지역:</span>
                                        <span>{program.location.join(', ')}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="text-lg font-bold text-blue-600">
                                        {program.price}
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                                            자세히 보기
                                        </button>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                            견적 문의
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredPrograms.length === 0 && (
                    <div className="max-w-5xl mx-auto text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                            검색 결과가 없습니다
                        </h3>
                        <p className="text-slate-600 mb-6">
                            다른 검색어나 필터를 시도해보세요
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('전체');
                                setSelectedSize('전체');
                            }}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            필터 초기화
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProgramFilterSection;

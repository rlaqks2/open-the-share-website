/**
 * @file ResourceLibrary.tsx
 * @description ESG 리소스 라이브러리 - 기업에게 유용한 자료 제공
 */

interface Resource {
    id: number;
    title: string;
    description: string;
    category: string;
    icon: string;
    fileType: string;
}

const ResourceLibrary = () => {
    const resources: Resource[] = [
        {
            id: 1,
            title: 'ESG 보고서 작성 가이드',
            description: '봉사활동 결과를 ESG 보고서에 효과적으로 반영하는 방법',
            category: 'ESG 보고',
            icon: '📊',
            fileType: 'PDF'
        },
        {
            id: 2,
            title: '기업 봉사 프로그램 기획 템플릿',
            description: '성공적인 봉사 프로그램 기획을 위한 단계별 템플릿',
            category: '프로그램 기획',
            icon: '📋',
            fileType: 'DOCX'
        },
        {
            id: 3,
            title: '임직원 참여 유도 전략',
            description: '봉사활동 참여율을 높이는 실전 노하우',
            category: '운영 관리',
            icon: '🎯',
            fileType: 'PDF'
        },
        {
            id: 4,
            title: '사회공헌 활동 성과 측정 방법론',
            description: '봉사활동의 사회적 가치를 정량적으로 측정하는 방법',
            category: '임팩트 측정',
            icon: '📈',
            fileType: 'PDF'
        },
        {
            id: 5,
            title: '성공 사례 모음집 2024',
            description: '국내 주요 기업들의 우수 사회공헌 사례 분석',
            category: '사례 연구',
            icon: '⭐',
            fileType: 'PDF'
        },
        {
            id: 6,
            title: '봉사활동 참가자 설문 템플릿',
            description: '프로그램 만족도 및 개선사항 파악을 위한 설문지',
            category: '운영 관리',
            icon: '📝',
            fileType: 'XLSX'
        }
    ];

    const categories = ['전체', 'ESG 보고', '프로그램 기획', '운영 관리', '임팩트 측정', '사례 연구'];
    const [selectedCategory, setSelectedCategory] = useState('전체');

    const filteredResources = selectedCategory === '전체'
        ? resources
        : resources.filter(r => r.category === selectedCategory);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 scroll-animate">
                    <h2 className="text-4xl font-bold text-slate-800 mb-4">
                        리소스 라이브러리
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        기업 사회공헌 활동에 필요한 다양한 자료와 가이드를 제공합니다
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-10 scroll-animate">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === category
                                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Resource Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource) => (
                        <div
                            key={resource.id}
                            className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-100 rounded-xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 scroll-animate group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-4xl">{resource.icon}</div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                    {resource.fileType}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                                {resource.title}
                            </h3>

                            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                                {resource.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <span className="text-xs text-slate-500 font-medium">
                                    {resource.category}
                                </span>
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                    <span>다운로드</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-12 text-center scroll-animate">
                    <div className="inline-block bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8">
                        <p className="text-slate-700 mb-4">
                            <span className="font-semibold">더 많은 자료가 필요하신가요?</span>
                        </p>
                        <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl">
                            맞춤 자료 요청하기
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

import { useState } from 'react';
export default ResourceLibrary;

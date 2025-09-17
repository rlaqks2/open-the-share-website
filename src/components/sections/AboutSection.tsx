/**
 * @file AboutSection.tsx
 * @description '회사 소개(About Us)' 섹션을 담당하는 컴포넌트입니다.
 * 회사의 정체성과 핵심 가치를 설명하는 제목, 상세 설명,
 * 그리고 세 가지 주요 특징을 아이콘과 함께 보여줍니다.
 * 관련된 이미지를 함께 배치하여 시각적인 이해를 돕습니다.
 * 표시되는 모든 콘텐츠는 `mockData` 파일로부터 가져옵니다.
 */
import React from 'react';
import { mockData } from '../../data/mockData';

const AboutSection: React.FC = () => {
    // mockData에서 'about' 섹션에 필요한 데이터들을 구조 분해 할당으로 가져옴
    const { title, description, features, imageUrl } = mockData.about;

    return (
        <section id="about" className="py-20">
            <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                {/* 텍스트 콘텐츠 영역 */}
                <div>
                    <h2 className="text-3xl font-bold mb-4">{title}</h2>
                    <p className="text-slate-600 mb-8">{description}</p>
                    <div className="space-y-6">
                        {features.map(feature => (
                            <div key={feature.title} className="flex items-start gap-4">
                                <span className="text-2xl">{feature.icon}</span>
                                <div>
                                    <h3 className="font-bold">{feature.title}</h3>
                                    <p className="text-slate-500">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* 이미지 영역 */}
                <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img src={imageUrl} alt="오픈더쉐어 회사 소개 이미지" className="w-full h-full object-cover" />
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
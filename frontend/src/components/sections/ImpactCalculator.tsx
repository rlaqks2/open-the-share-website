/**
 * @file ImpactCalculator.tsx
 * @description 봉사 활동 임팩트 계산기 - 기업이 예상 결과를 미리 확인할 수 있는 인터랙티브 도구
 */
import { useState } from 'react';

const ImpactCalculator = () => {
    const [participants, setParticipants] = useState(50);
    const [hours, setHours] = useState(4);
    const [programType, setProgramType] = useState('environment');

    // 임팩트 계산 로직
    const calculateImpact = () => {
        const totalHours = participants * hours;
        const beneficiaries = Math.floor(participants * 2.5); // 1명당 2.5명 수혜
        const co2Reduction = programType === 'environment' ? Math.floor(participants * 15) : 0; // kg
        const esgScore = Math.floor((totalHours / 100) * 10) / 10;

        return { totalHours, beneficiaries, co2Reduction, esgScore };
    };

    const impact = calculateImpact();

    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 scroll-animate">
                    <h2 className="text-4xl font-bold text-slate-800 mb-4">
                        임팩트 계산기
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        우리 회사의 봉사활동이 만들어낼 사회적 가치를 미리 확인해보세요
                    </p>
                </div>

                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 scroll-animate">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Input Section */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">
                                프로그램 정보 입력
                            </h3>

                            {/* Participants */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    참여 인원
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="10"
                                        max="200"
                                        step="10"
                                        value={participants}
                                        onChange={(e) => setParticipants(Number(e.target.value))}
                                        className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-xl font-bold text-blue-600 min-w-[60px] text-right">
                                        {participants}명
                                    </span>
                                </div>
                            </div>

                            {/* Hours */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    활동 시간
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="8"
                                        step="0.5"
                                        value={hours}
                                        onChange={(e) => setHours(Number(e.target.value))}
                                        className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-xl font-bold text-green-600 min-w-[60px] text-right">
                                        {hours}시간
                                    </span>
                                </div>
                            </div>

                            {/* Program Type */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    프로그램 유형
                                </label>
                                <select
                                    value={programType}
                                    onChange={(e) => setProgramType(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value="environment">환경보호</option>
                                    <option value="community">지역사회 기여</option>
                                    <option value="education">아동/청소년 지원</option>
                                    <option value="culture">문화/예술 나눔</option>
                                </select>
                            </div>
                        </div>

                        {/* Results Section */}
                        <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-xl p-8 text-white">
                            <h3 className="text-2xl font-bold mb-6">
                                예상 임팩트
                            </h3>

                            <div className="space-y-6">
                                {/* Total Hours */}
                                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                                    <div className="text-sm opacity-90 mb-1">총 봉사 시간</div>
                                    <div className="text-3xl font-bold">
                                        {impact.totalHours.toLocaleString()}
                                        <span className="text-lg ml-2">시간</span>
                                    </div>
                                </div>

                                {/* Beneficiaries */}
                                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                                    <div className="text-sm opacity-90 mb-1">예상 수혜 인원</div>
                                    <div className="text-3xl font-bold">
                                        {impact.beneficiaries.toLocaleString()}
                                        <span className="text-lg ml-2">명</span>
                                    </div>
                                </div>

                                {/* CO2 Reduction (환경 프로그램만) */}
                                {programType === 'environment' && (
                                    <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                                        <div className="text-sm opacity-90 mb-1">CO₂ 감축량</div>
                                        <div className="text-3xl font-bold">
                                            {impact.co2Reduction.toLocaleString()}
                                            <span className="text-lg ml-2">kg</span>
                                        </div>
                                    </div>
                                )}

                                {/* ESG Score */}
                                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                                    <div className="text-sm opacity-90 mb-1">ESG 평가 기여도</div>
                                    <div className="text-3xl font-bold">
                                        {impact.esgScore}
                                        <span className="text-lg ml-2">/ 10</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-white/10 rounded-lg">
                                <p className="text-sm opacity-90">
                                    💡 이 수치는 평균 데이터를 기반으로 한 예측값입니다.
                                    실제 결과는 프로그램 특성에 따라 달라질 수 있습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImpactCalculator;

/**
 * @file InquiryForm.tsx
 * @description openthe.kr/yc/sub/sub3_2.php의 온라인 상담 신청 양식을 반영한 파트너십 문의 폼 컴포넌트입니다.
 * 단체 유형(기업/관공서/학교/기타), 희망 방식(대면 온앤온 / 비대면 온팅), 예상 인원 등을 포함하며,
 * 브라우저 기본 alert() 대신 인라인 상태 메시지를 사용하여 보안 및 UX 가이드라인을 준수합니다.
 */
import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { siteConfig } from '../../config/site';
import { mockData } from '../../data/mockData';
import { inquiryConsentSummary } from '../../data/privacyPolicy';
import { trackEvent } from '../../services/analytics';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+\-()\s]{8,20}$/;

interface InquiryFormProps {
    onSubmitted: () => void;
    onError?: () => void;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ onSubmitted, onError }) => {
    const [form, setForm] = useState({
        orgCategory: '기업',
        programType: '온앤온 (대면 사회공헌)',
        company: '',
        manager: '',
        title: '',
        phone: '',
        email: '',
        participants: '',
        message: '',
        agree: false,
        website: '', // 스팸봇 차단용 허니팟 (사람에게는 보이지 않음)
    });

    const [validationError, setValidationError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);

    const set = (key: string, value: string | boolean) => {
        setValidationError(null);
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.company.trim() || !form.manager.trim() || !form.phone.trim() || !form.email.trim()) {
            setValidationError('기업/단체명, 담당자명, 연락처, 이메일을 모두 입력해 주세요.');
            return;
        }

        if (!EMAIL_PATTERN.test(form.email.trim())) {
            setValidationError('이메일 주소 형식을 확인해 주세요. (예: name@company.com)');
            return;
        }

        if (!PHONE_PATTERN.test(form.phone.trim())) {
            setValidationError('연락처 형식을 확인해 주세요. (숫자와 - 만 입력, 예: 010-0000-0000)');
            return;
        }

        if (!form.agree) {
            setValidationError('개인정보 수집 및 이용에 동의해 주세요.');
            return;
        }

        // 허니팟 필드가 채워져 있으면 봇으로 간주하고 조용히 성공 처리 (메일 미발송)
        if (form.website) {
            onSubmitted();
            return;
        }

        setIsSending(true);

        const { serviceId, templateId, publicKey, toEmail } = siteConfig.emailjs;

        const templateParams = {
            to_email: toEmail,
            from_name: form.manager,
            from_company: `[${form.orgCategory}] ${form.company}`,
            from_email: form.email,
            // EmailJS 템플릿 설정란용: From Name = {{name}}, Reply To = {{email}} (답장 시 고객 이메일로 바로 회신)
            name: `${form.company} ${form.manager}`,
            email: form.email,
            phone: form.phone,
            title: `${form.title} (${form.programType} / 예상인원: ${form.participants || '미정'})`,
            message: form.message,
        };

        emailjs
            .send(serviceId, templateId, templateParams, publicKey)
            .then(() => {
                setIsSending(false);
                // 전환 측정: 개인정보(기관명·이름·연락처·내용)는 보내지 않고 유형만 기록
                trackEvent('generate_lead', { org_category: form.orgCategory, program_type: form.programType });
                onSubmitted();
            })
            .catch(() => {
                setIsSending(false);
                trackEvent('inquiry_error', { org_category: form.orgCategory });
                if (onError) {
                    onError();
                } else {
                    setValidationError(
                        `문의 접수 중 일시적인 네트워크 오류가 발생했습니다. 대표전화(${mockData.companyInfo.tel}) 또는 이메일(${mockData.companyInfo.email})로 연락 부탁드립니다.`
                    );
                }
            });
    };

    return (
        <form onSubmit={onSubmit} noValidate className="relative grid grid-cols-1 gap-4 text-left">
            {validationError && (
                <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold"
                >
                    {validationError}
                </div>
            )}

            {/* 단체 분류 & 희망 프로그램 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="orgCategory" className="block text-xs font-bold text-slate-700 mb-1">
                        기업 · 단체 유형 <span className="text-rose-500">*</span>
                    </label>
                    <select
                        id="orgCategory"
                        value={form.orgCategory}
                        onChange={(e) => set('orgCategory', e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        <option value="기업">기업 (대기업·중견·강소기업)</option>
                        <option value="공공기관·재단">관공서 · 공공기관 · 재단</option>
                        <option value="학교·교육기관">학교 · 대학교 · 교육기관</option>
                        <option value="단체·기타">협회 · 단체 · 기타</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="programType" className="block text-xs font-bold text-slate-700 mb-1">
                        희망 프로그램 방식 <span className="text-rose-500">*</span>
                    </label>
                    <select
                        id="programType"
                        value={form.programType}
                        onChange={(e) => set('programType', e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        <option value="온앤온 (대면 사회공헌)">온앤온 ON&amp;ON (대면 봉사활동)</option>
                        <option value="온팅 (비대면 사회공헌)">온팅 ON-ting (비대면·기부키트 봉사)</option>
                        <option value="대면+비대면 복합 컨설팅">대면 + 비대면 맞춤형 컨설팅</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="company" className="block text-xs font-bold text-slate-700 mb-1">
                        기업 · 단체명 <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="company"
                        maxLength={100}
                        value={form.company}
                        onChange={(e) => set('company', e.target.value)}
                        required
                        placeholder="예: (주)오픈더쉐어"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        autoComplete="organization"
                    />
                </div>
                <div>
                    <label htmlFor="manager" className="block text-xs font-bold text-slate-700 mb-1">
                        담당자 성함 / 직책 <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="manager"
                        maxLength={50}
                        value={form.manager}
                        onChange={(e) => set('manager', e.target.value)}
                        required
                        placeholder="예: 홍길동 매니저"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        autoComplete="name"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1">
                        연락처 <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="phone"
                        maxLength={20}
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set('phone', e.target.value)}
                        placeholder="010-0000-0000"
                        required
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        autoComplete="tel"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1">
                        이메일 <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="email"
                        maxLength={100}
                        type="email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="name@company.com"
                        required
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        autoComplete="email"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="participants" className="block text-xs font-bold text-slate-700 mb-1">
                    예상 참여 인원 및 희망 시기
                </label>
                <input
                    id="participants"
                    maxLength={200}
                    value={form.participants}
                    onChange={(e) => set('participants', e.target.value)}
                    placeholder="예: 임직원 약 40명 / 2026년 5월 중 희망"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-xs font-bold text-slate-700 mb-1">
                    상세 문의 내용
                </label>
                <textarea
                    id="message"
                    maxLength={3000}
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    rows={3}
                    placeholder="관심 있는 테마(환경·업사이클링, 목공, 벽화, 요리·베이킹, 기부키트 등)나 예산, 궁금하신 점을 자유롭게 남겨주세요."
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
            </div>

            {/* 허니팟: 화면·스크린리더에서 숨김. 봇만 채움 */}
            <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                <label htmlFor="website">웹사이트</label>
                <input
                    id="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => set('website', e.target.value)}
                />
            </div>

            {/* 개인정보 수집·이용 고지 (개인정보 보호법 제15조 제2항) */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-[11px] leading-relaxed text-slate-600 break-keep">
                <p className="font-bold text-slate-800 mb-1">개인정보 수집·이용 안내</p>
                <ul className="space-y-0.5">
                    <li>· 목적: {inquiryConsentSummary.purpose}</li>
                    <li>· 항목: {inquiryConsentSummary.items}</li>
                    <li>· 보유기간: {inquiryConsentSummary.retention}</li>
                    <li>· {inquiryConsentSummary.refusal}</li>
                </ul>
            </div>

            <div className="flex items-center gap-2 text-xs">
                <input
                    id="agree"
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => set('agree', e.target.checked)}
                    required
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="agree" className="text-slate-600 font-medium">
                    (필수) 위 개인정보 수집 및 이용에 동의합니다.
                </label>
            </div>

            <button
                type="submit"
                disabled={isSending}
                className="mt-1 w-full rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-extrabold text-white hover:bg-emerald-700 transition-colors disabled:opacity-60"
            >
                {isSending ? '문의 접수 중...' : '맞춤형 사회공헌 상담 신청하기'}
            </button>
        </form>
    );
};

export default InquiryForm;

/**
 * @file InquiryForm.tsx
 * @description '파트너십 문의'를 위한 상세 입력 폼 컴포넌트입니다.
 * 회사명, 담당자 정보, 연락처, 문의 내용 등 사용자의 입력을 처리합니다.
 * 모든 필수 필드가 채워졌는지 유효성을 검사하고,
 * 제출 시 부모 컴포넌트로부터 받은 `onSubmitted` 콜백 함수를 호출합니다.
 */
import React, { useState } from 'react';

// InquiryForm 컴포넌트가 받는 props의 타입을 정의
interface InquiryFormProps {
  onSubmitted: () => void; // 폼 제출이 성공적으로 완료되었을 때 호출될 함수
  initialMessage?: string;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ onSubmitted, initialMessage }) => {
  // 폼의 각 필드 값을 관리하는 state
  const [form, setForm] = useState({
    company: '',
    companySize: '',
    manager: '',
    title: '',
    phone: '',
    email: '',
    programType: '',
    participants: '',
    preferredDate: '',
    budget: '',
    message: initialMessage || '',
    agree: false,
  });

  // 입력 필드의 값이 변경될 때마다 form state를 업데이트하는 함수
  const set = (key: string, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));

  // 폼 제출중 상태 관리
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 폼 제출 이벤트 핸들러
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 기본 동작을 막음

    // 필수 항목 유효성 검사
    if (!form.company || !form.companySize || !form.manager || !form.phone || !form.email || !form.agree) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // 백엔드로 데이터 전송
      const { submitPartnershipInquiry } = await import('../../api');
      await submitPartnershipInquiry({
        company: form.company,
        companySize: form.companySize,
        manager: form.manager,
        title: form.title,
        phone: form.phone,
        email: form.email,
        programType: form.programType,
        participants: form.participants,
        preferredDate: form.preferredDate,
        budget: form.budget,
        message: form.message,
      });

      console.log("제출된 폼 데이터:", form);
      onSubmitted();
    } catch (err: any) {
      console.error('Partnership inquiry submission failed:', err);
      setSubmitError(err.message || '문의 제출에 실패했습니다. 다시 시도해주세요.');
      alert('문의 제출에 실패했습니다: ' + (err.message || '알 수 없는 오류'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5">
      {/* 기업 정보 섹션 */}
      <div className="pb-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">기업 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1">회사명<span className="text-rose-500 ml-1">*</span></label>
            <input
              id="company"
              value={form.company}
              onChange={e => set('company', e.target.value)}
              required
              className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              autoComplete="organization"
              placeholder="예: 카카오"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="companySize" className="block text-sm font-medium text-slate-700 mb-1">기업 규모<span className="text-rose-500 ml-1">*</span></label>
            <select
              id="companySize"
              value={form.companySize}
              onChange={e => set('companySize', e.target.value)}
              required
              className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={isSubmitting}
            >
              <option value="">선택해주세요</option>
              <option value="small">50명 미만</option>
              <option value="medium">50-300명</option>
              <option value="large">300명 이상</option>
            </select>
          </div>
        </div>
      </div>

      {/* 담당자 정보 섹션 */}
      <div className="pb-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">담당자 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="manager" className="block text-sm font-medium text-slate-700 mb-1">담당자명<span className="text-rose-500 ml-1">*</span></label>
            <input
              id="manager"
              value={form.manager}
              onChange={e => set('manager', e.target.value)}
              required
              className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              autoComplete="name"
              placeholder="홍길동"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">직책</label>
            <input
              id="title"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              autoComplete="organization-title"
              placeholder="예: ESG팀 매니저"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">연락처<span className="text-rose-500 ml-1">*</span></label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="010-0000-0000"
              required
              className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              autoComplete="tel"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">이메일<span className="text-rose-500 ml-1">*</span></label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="name@company.com"
              required
              className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              autoComplete="email"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* 프로그램 정보 섹션 */}
      <div className="pb-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">프로그램 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="programType" className="block text-sm font-medium text-slate-700 mb-1">관심 프로그램</label>
            <select
              id="programType"
              value={form.programType}
              onChange={e => set('programType', e.target.value)}
              className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={isSubmitting}
            >
              <option value="">선택해주세요</option>
              <option value="environment">환경보호</option>
              <option value="community">지역사회 기여</option>
              <option value="education">아동/청소년 지원</option>
              <option value="culture">문화/예술 나눔</option>
              <option value="custom">맞춤형 프로그램</option>
            </select>
          </div>
          <div>
            <label htmlFor="participants" className="block text-sm font-medium text-slate-700 mb-1">예상 참여 인원</label>
            <input
              id="participants"
              type="number"
              value={form.participants}
              onChange={e => set('participants', e.target.value)}
              placeholder="50"
              className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              min="1"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="preferredDate" className="block text-sm font-medium text-slate-700 mb-1">희망 시기</label>
            <input
              id="preferredDate"
              type="text"
              value={form.preferredDate}
              onChange={e => set('preferredDate', e.target.value)}
              placeholder="예: 2024년 3월 중"
              className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-1">예산 규모</label>
            <select
              id="budget"
              value={form.budget}
              onChange={e => set('budget', e.target.value)}
              className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={isSubmitting}
            >
              <option value="">선택해주세요</option>
              <option value="under500">500만원 미만</option>
              <option value="500to1000">500만원 - 1,000만원</option>
              <option value="1000to3000">1,000만원 - 3,000만원</option>
              <option value="over3000">3,000만원 이상</option>
              <option value="flexible">협의 가능</option>
            </select>
          </div>
        </div>
      </div>

      {/* 추가 문의 사항 */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">추가 문의 사항</label>
        <textarea
          id="message"
          value={form.message}
          onChange={e => set('message', e.target.value)}
          rows={4}
          placeholder="프로그램에 대한 특별한 요구사항이나 궁금한 점을 자유롭게 작성해주세요."
          className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          disabled={isSubmitting}
        />
      </div>

      {/* 개인정보 동의 */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
        <input
          id="agree"
          type="checkbox"
          checked={form.agree}
          onChange={e => set('agree', e.target.checked)}
          required
          className="h-5 w-5 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        <label htmlFor="agree" className="text-sm text-slate-700 leading-relaxed">
          개인정보 수집 및 이용에 동의합니다. 수집된 정보는 문의 응대 목적으로만 사용되며, 관련 법령에 따라 안전하게 관리됩니다.
        </label>
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-4 text-lg font-semibold text-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? '제출 중...' : '무료 컨설팅 신청하기'}
      </button>
    </form>
  );
}

export default InquiryForm;
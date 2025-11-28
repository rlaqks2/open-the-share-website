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
}

const InquiryForm: React.FC<InquiryFormProps> = ({ onSubmitted }) => {
  // 폼의 각 필드 값을 관리하는 state
  const [form, setForm] = useState({
    company: '',
    manager: '',
    title: '',
    phone: '',
    email: '',
    message: '',
    agree: false,
  });

  // 입력 필드의 값이 변경될 때마다 form state를 업데이트하는 함수
  const set = (key: string, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }));

  // 폼 제출 이벤트 핸들러
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 기본 동작을 막음

    // 필수 항목 유효성 검사
    if (!form.company || !form.manager || !form.phone || !form.email || !form.agree) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 실제 애플리케이션에서는 여기서 서버로 폼 데이터를 전송하는 로직이 들어갑니다.
    // 이 예제에서는 콘솔에 데이터를 출력하고 onSubmitted 콜백을 호출합니다.
    console.log("제출된 폼 데이터:", form);
    onSubmitted();
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-slate-700">회사명<span className="text-rose-500">*</span></label>
          <input id="company" value={form.company} onChange={e => set('company', e.target.value)} required className="mt-1 w-full rounded-lg border-slate-300 px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500" autoComplete="organization" />
        </div>
        <div>
          <label htmlFor="manager" className="block text-sm font-medium text-slate-700">담당자<span className="text-rose-500">*</span></label>
          <input id="manager" value={form.manager} onChange={e => set('manager', e.target.value)} required className="mt-1 w-full rounded-lg border-slate-300 px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500" autoComplete="name" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">직책</label>
          <input id="title" value={form.title} onChange={e => set('title', e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500" autoComplete="organization-title" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">연락처<span className="text-rose-500">*</span></label>
          <input id="phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="010-0000-0000" required className="mt-1 w-full rounded-lg border-slate-300 px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500" autoComplete="tel" />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">이메일<span className="text-rose-500">*</span></label>
        <input id="email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="name@example.com" required className="mt-1 w-full rounded-lg border-slate-300 px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500" autoComplete="email" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700">문의 내용</label>
        <textarea id="message" value={form.message} onChange={e => set('message', e.target.value)} rows={4} placeholder="원하시는 프로그램, 참여 인원, 시기 등" className="mt-1 w-full rounded-lg border-slate-300 px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500" />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <input id="agree" type="checkbox" checked={form.agree} onChange={e => set('agree', e.target.checked)} required className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
        <label htmlFor="agree" className="text-slate-600">개인정보 수집·이용에 동의합니다.</label>
      </div>
      <button type="submit" className="mt-2 w-full rounded-lg bg-emerald-600 px-4 py-3 text-base font-semibold text-white hover:bg-emerald-700 transition-colors">문의 제출</button>
    </form>
  );
}

export default InquiryForm;
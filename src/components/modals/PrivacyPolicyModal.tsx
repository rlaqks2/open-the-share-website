/**
 * @file PrivacyPolicyModal.tsx
 * @description 개인정보 처리방침 모달. 본문은 src/data/privacyPolicy.ts 에서 관리합니다.
 */
import React from 'react';
import { privacyPolicy } from '../../data/privacyPolicy';

interface PrivacyPolicyModalProps {
    onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
    return (
        <div className="relative flex flex-col max-h-[80vh]">
            <button
                type="button"
                onClick={onClose}
                aria-label="개인정보 처리방침 닫기"
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
            </button>
            <div className="px-6 md:px-8 pt-7 pb-4 border-b border-slate-100 pr-14">
                <h2 id="modal-title" className="text-xl md:text-2xl font-black text-slate-900">
                    개인정보 처리방침
                </h2>
                <p className="text-xs text-slate-500 mt-1">시행일: {privacyPolicy.effectiveDate}</p>
            </div>

            <div className="overflow-y-auto px-6 md:px-8 py-6 space-y-7 text-sm text-slate-700 leading-relaxed break-keep">
                <p>{privacyPolicy.intro}</p>

                {privacyPolicy.sections.map((section) => (
                    <section key={section.title} className="space-y-2.5">
                        <h3 className="font-extrabold text-slate-900 text-base">{section.title}</h3>

                        {section.paragraphs?.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}

                        {section.bullets && (
                            <ul className="list-disc pl-5 space-y-1">
                                {section.bullets.map((b, i) => (
                                    <li key={i}>{b}</li>
                                ))}
                            </ul>
                        )}

                        {section.table && (
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full text-xs md:text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-900">
                                        <tr>
                                            {section.table.head.map((h) => (
                                                <th key={h} scope="col" className="px-3 py-2 font-bold whitespace-nowrap">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {section.table.rows.map((row, ri) => (
                                            <tr key={ri}>
                                                {row.map((cell, ci) => (
                                                    <td key={ci} className={`px-3 py-2 align-top ${ci === 0 ? 'font-semibold text-slate-900 whitespace-nowrap' : ''}`}>
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
};

export default PrivacyPolicyModal;

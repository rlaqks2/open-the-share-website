import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminPageProps {
    user: any;
}

const AdminPage: React.FC<AdminPageProps> = ({ user }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user || user.role !== 'ADMIN') {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 py-20">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex border-b border-slate-200">
                        <button
                            className={`px-6 py-4 font-medium ${activeTab === 'users' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setActiveTab('users')}
                        >
                            사용자 관리
                        </button>
                        <button
                            className={`px-6 py-4 font-medium ${activeTab === 'inquiries' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setActiveTab('inquiries')}
                        >
                            문의 관리
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'users' && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">가입된 사용자 목록</h2>
                                <p className="text-slate-500">사용자 목록을 불러오는 중...</p>
                                {/* TODO: Fetch and display users */}
                            </div>
                        )}
                        {activeTab === 'inquiries' && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">접수된 문의 목록</h2>
                                <p className="text-slate-500">문의 목록을 불러오는 중...</p>
                                {/* TODO: Fetch and display inquiries */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;

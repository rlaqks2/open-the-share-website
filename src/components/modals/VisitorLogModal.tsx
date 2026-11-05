import React, { useState, useEffect } from 'react';
import { VisitorLogData, trackVisitor, getStoredWebhookUrl, setStoredWebhookUrl } from '../../utils/visitorTracker';

interface VisitorLogModalProps {
    onClose: () => void;
}

const VisitorLogModal: React.FC<VisitorLogModalProps> = ({ onClose }) => {
    const [logs, setLogs] = useState<VisitorLogData[]>([]);
    const [webhookUrl, setWebhookUrl] = useState<string>('');
    const [isSavingUrl, setIsSavingUrl] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [testMessage, setTestMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'logs' | 'settings' | 'guide'>('logs');

    // 로컬 로그 및 웹훅 URL 로드
    useEffect(() => {
        loadLogs();
        const savedUrl = getStoredWebhookUrl();
        setWebhookUrl(savedUrl);
    }, []);

    const loadLogs = () => {
        try {
            const raw = localStorage.getItem('ots_local_visitor_logs');
            if (raw) {
                setLogs(JSON.parse(raw));
            }
        } catch {
            setLogs([]);
        }
    };

    const handleSaveUrl = () => {
        setIsSavingUrl(true);
        setStoredWebhookUrl(webhookUrl.trim());
        setTimeout(() => {
            setIsSavingUrl(false);
            setTestMessage('구글 시트 웹앱 URL이 성공적으로 저장되었습니다.');
        }, 300);
    };

    const handleTestTrack = async () => {
        setIsTesting(true);
        setTestMessage(null);
        try {
            // 강제 전송 플래그로 trackVisitor 실행
            await trackVisitor('방문자 로그 관리자 - 테스트 전송', true);
            loadLogs();
            setTestMessage('✅ 테스트 방문 로그가 성공적으로 기록 및 구글 시트로 전송되었습니다!');
        } catch (err: any) {
            setTestMessage(`❌ 전송 실패: ${err?.message || '네트워크 오류'}`);
        } finally {
            setIsTesting(false);
        }
    };

    const handleExportCSV = () => {
        if (logs.length === 0) return;
        const headers = [
            '방문일시',
            'IP주소',
            '국가',
            '시도',
            '도시',
            '기관/기업명',
            'ISP통신사',
            '접속페이지',
            '유입경로',
            '디바이스',
            'OS',
            '브라우저',
            '해상도',
            '세션ID'
        ];
        const rows = logs.map(l => [
            `"${l.visited_at}"`,
            `"${l.ip_address}"`,
            `"${l.country}"`,
            `"${l.region}"`,
            `"${l.city}"`,
            `"${l.org_name}"`,
            `"${l.isp}"`,
            `"${l.page_title}"`,
            `"${l.referrer}"`,
            `"${l.device_type}"`,
            `"${l.os}"`,
            `"${l.browser}"`,
            `"${l.screen_res}"`,
            `"${l.session_id}"`
        ]);

        const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `openthe_visitor_logs_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 통계 계산
    const totalCount = logs.length;
    const desktopCount = logs.filter(l => l.device_type === 'Desktop').length;
    const mobileCount = logs.filter(l => l.device_type === 'Mobile' || l.device_type === 'Tablet').length;
    const directCount = logs.filter(l => !l.referrer || l.referrer.includes('Direct') || l.referrer.includes('직접')).length;
    const naverCount = logs.filter(l => l.referrer.includes('naver') || l.browser.includes('Naver')).length;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 animate-fadeIn">
                {/* 헤더 */}
                <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                            📊
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-white">사이트 방문자 실시간 데이터 센터</h3>
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    Google 생태계 연동
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                                접속 IP, 기관/ISP, 유입 경로, 기기 환경을 자동 수집하여 구글 스프레드시트 및 시각화 대시보드로 전달합니다.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        title="닫기"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* 탭 네비게이션 */}
                <div className="flex items-center justify-between px-6 border-b border-slate-200 bg-slate-50">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('logs')}
                            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                                activeTab === 'logs'
                                    ? 'border-emerald-600 text-emerald-700 bg-white'
                                    : 'border-transparent text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            실시간 방문 로그 ({totalCount}건)
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                                activeTab === 'settings'
                                    ? 'border-emerald-600 text-emerald-700 bg-white'
                                    : 'border-transparent text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            구글 시트 연동 설정 {webhookUrl ? '🟢' : '⚪'}
                        </button>
                        <button
                            onClick={() => setActiveTab('guide')}
                            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                                activeTab === 'guide'
                                    ? 'border-emerald-600 text-emerald-700 bg-white'
                                    : 'border-transparent text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            비영리단체 전환 &amp; Looker Studio 연동 안내
                        </button>
                    </div>
                    <div className="flex items-center gap-2 py-2">
                        <button
                            onClick={handleTestTrack}
                            disabled={isTesting}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                            {isTesting ? (
                                <span className="animate-spin text-xs">⏳</span>
                            ) : (
                                <span>⚡</span>
                            )}
                            방문 전송 테스트
                        </button>
                        <button
                            onClick={handleExportCSV}
                            disabled={logs.length === 0}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-300 disabled:opacity-40"
                        >
                            CSV 다운로드
                        </button>
                    </div>
                </div>

                {/* 알림 메시지 */}
                {testMessage && (
                    <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
                        <span>{testMessage}</span>
                        <button
                            onClick={() => setTestMessage(null)}
                            className="text-emerald-600 hover:text-emerald-900 font-bold ml-4"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* 본문 콘텐츠 */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* 상단 통계 카드 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                            <p className="text-xs text-slate-500 font-medium">로컬 보관 로그</p>
                            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{totalCount}건</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">최근 50개 실시간 캐싱</p>
                        </div>
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                            <p className="text-xs text-slate-500 font-medium">데스크톱 접속</p>
                            <p className="text-xl font-extrabold text-blue-600 mt-0.5">
                                {desktopCount}건 <span className="text-xs font-normal text-slate-500">({totalCount ? Math.round((desktopCount / totalCount) * 100) : 0}%)</span>
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">PC / 노트북 환경</p>
                        </div>
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                            <p className="text-xs text-slate-500 font-medium">모바일 / 태블릿</p>
                            <p className="text-xl font-extrabold text-emerald-600 mt-0.5">
                                {mobileCount}건 <span className="text-xs font-normal text-slate-500">({totalCount ? Math.round((mobileCount / totalCount) * 100) : 0}%)</span>
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">스마트폰 / 패드</p>
                        </div>
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                            <p className="text-xs text-slate-500 font-medium">네이버 유입</p>
                            <p className="text-xl font-extrabold text-green-600 mt-0.5">
                                {naverCount}건 <span className="text-xs font-normal text-slate-500">(블로그/검색)</span>
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">직접 {directCount}건</p>
                        </div>
                    </div>

                    {/* 탭 1: 실시간 로그 테이블 */}
                    {activeTab === 'logs' && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <span>실시간 방문자 수집 목록</span>
                                    <span className="text-xs font-normal text-slate-500">
                                        (페이지 접속 시 자동 전송됩니다)
                                    </span>
                                </h4>
                                <button
                                    onClick={loadLogs}
                                    className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1"
                                >
                                    🔄 새로고침
                                </button>
                            </div>

                            {logs.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                    <p className="text-slate-500 text-sm">아직 수집된 방문 로그가 없습니다.</p>
                                    <p className="text-slate-400 text-xs mt-1">
                                        우측 상단의 <strong>[⚡ 방문 전송 테스트]</strong> 버튼을 누르면 즉시 첫 번째 로그가 생성됩니다.
                                    </p>
                                </div>
                            ) : (
                                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto max-h-96">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead className="bg-slate-100 text-slate-600 sticky top-0 border-b border-slate-200 font-semibold">
                                                <tr>
                                                    <th className="py-2.5 px-3">접속 시간 (KST)</th>
                                                    <th className="py-2.5 px-3">IP 주소</th>
                                                    <th className="py-2.5 px-3">접속 기관 / ISP</th>
                                                    <th className="py-2.5 px-3">지역 (도시)</th>
                                                    <th className="py-2.5 px-3">페이지</th>
                                                    <th className="py-2.5 px-3">유입 경로</th>
                                                    <th className="py-2.5 px-3">기기 / 브라우저</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                                                {logs.map((log, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                                                            {log.visited_at}
                                                        </td>
                                                        <td className="py-2.5 px-3 text-slate-800 font-semibold whitespace-nowrap">
                                                            {log.ip_address}
                                                        </td>
                                                        <td className="py-2.5 px-3 text-emerald-700 font-medium whitespace-nowrap">
                                                            {log.org_name || log.isp || '일반 접속'}
                                                        </td>
                                                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                                                            {log.city || log.region || log.country}
                                                        </td>
                                                        <td className="py-2.5 px-3 text-slate-700 max-w-[140px] truncate" title={log.page_title}>
                                                            {log.page_title}
                                                        </td>
                                                        <td className="py-2.5 px-3 text-slate-500 max-w-[150px] truncate" title={log.referrer}>
                                                            {log.referrer}
                                                        </td>
                                                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                                                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-sans text-[10px] mr-1">
                                                                {log.device_type}
                                                            </span>
                                                            <span className="font-sans text-[10px] text-slate-500">
                                                                {log.os} · {log.browser}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 탭 2: 구글 시트 웹훅 설정 */}
                    {activeTab === 'settings' && (
                        <div className="space-y-4">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 leading-relaxed">
                                <h5 className="font-bold text-sm mb-1 text-emerald-950">
                                    💡 구글 스프레드시트 웹앱(Web App) URL 설정
                                </h5>
                                <p>
                                    구글 드라이브에서 생성한 스프레드시트의 <strong>[확장 프로그램] → [Apps Script]</strong>에
                                    제공해드린 코드를 배포한 후 발급받은 웹앱 URL을 아래에 입력해 주시면,
                                    방문자가 사이트에 접속할 때마다 실시간으로 스프레드시트 행에 데이터가 자동 기록됩니다.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase">
                                    Google Apps Script Web App URL
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        placeholder="https://script.google.com/macros/s/.../exec"
                                        value={webhookUrl}
                                        onChange={e => setWebhookUrl(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <button
                                        onClick={handleSaveUrl}
                                        disabled={isSavingUrl}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        {isSavingUrl ? '저장 중...' : '저장하기'}
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-500">
                                    * 환경 변수 <code className="bg-slate-100 px-1 py-0.5 rounded">VITE_GOOGLE_SHEET_WEBHOOK_URL</code> 또는 브라우저 로컬 저장소에 안전하게 유지됩니다.
                                </p>
                            </div>

                            <div className="border-t border-slate-200 pt-4">
                                <h5 className="font-bold text-xs text-slate-800 mb-2">구글 Apps Script 등록 코드 (복사하여 붙여넣기):</h5>
                                <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs overflow-x-auto font-mono leading-relaxed select-all">
{`function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // 첫 번째 행이 비어있으면 자동으로 헤더 작성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "방문일시(KST)", "세션ID", "IP주소", "국가", "시도", "도시", 
        "기관/기업명", "ISP통신사", "접속페이지", "페이지명", "유입경로", 
        "UTM_SOURCE", "디바이스", "OS", "브라우저", "화면해상도", "언어"
      ]);
    }
    
    // 방문 데이터 행 추가
    sheet.appendRow([
      data.visited_at,
      data.session_id,
      data.ip_address,
      data.country,
      data.region,
      data.city,
      data.org_name,
      data.isp,
      data.page_url,
      data.page_title,
      data.referrer,
      data.utm_source,
      data.device_type,
      data.os,
      data.browser,
      data.screen_res,
      data.language
    ]);
    
    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
  } catch(err) {
    return ContentService.createTextOutput("ERROR: " + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}`}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* 탭 3: 비영리단체 전략 가이드 */}
                    {activeTab === 'guide' && (
                        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <h5 className="font-bold text-sm text-blue-950 mb-1">
                                    🌟 비영리단체 승인 시 구글 생태계의 압도적 혜택
                                </h5>
                                <p className="text-blue-900">
                                    오픈더쉐어가 비영리 사단법인이나 비영리민간단체(고유번호증)로 승인되면,
                                    <strong> Google for Nonprofits(구글 비영리단체 프로그램)</strong>을 통해 다음과 같은 지원을 100% 무료로 받으실 수 있습니다:
                                </p>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-blue-950 font-medium">
                                    <li><strong>Google Workspace for Nonprofits 무료</strong>: @openthe.kr 공식 도메인 이메일 및 무제한 클라우드 드라이브 무료 제공</li>
                                    <li><strong>Google Ad Grants</strong>: 매월 <strong>$10,000 (약 1,300만~1,400만 원 상당)</strong> 구글 검색 광고비 평생 무상 지원</li>
                                    <li><strong>Google Cloud Platform (GCP) 비영리 크레딧</strong>: 연간 대규모 인프라 무상 지원</li>
                                    <li><strong>Looker Studio (무료 대시보드)</strong>: 구글 시트와 원클릭 연동되는 최고급 통계 시각화 대시보드</li>
                                </ul>
                            </div>

                            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                                <h5 className="font-bold text-slate-800 text-xs mb-2">
                                    📈 Looker Studio로 실시간 대시보드 연동하는 방법 (3분 완성)
                                </h5>
                                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                                    <li>데이터가 쌓인 구글 스프레드시트 열기</li>
                                    <li>상단 메뉴에서 <strong>[확장 프로그램] ➜ [Looker Studio로 대시보드 만들기]</strong> 클릭</li>
                                    <li>접속 국가/도시 지도 차트, 기기별 도넛 차트, 일자별 방문자 꺾은선 그래프가 자동 생성됩니다.</li>
                                    <li>생성된 대시보드 URL을 북마크해두면 실시간으로 기관/방문자 유입을 감상하실 수 있습니다.</li>
                                </ol>
                            </div>
                        </div>
                    )}
                </div>

                {/* 푸터 */}
                <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-[11px] text-slate-500">
                        단축키 안내: 웹사이트 어디서든 <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-700 font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-700 font-mono">Shift</kbd> + <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-slate-700 font-mono">L</kbd> 키를 누르면 이 창이 열립니다.
                    </p>
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                        창 닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VisitorLogModal;

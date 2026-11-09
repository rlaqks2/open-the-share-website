# 방문자 로그 — 관리자 가이드

사이트(openthe.kr)에는 방문자 로그 화면이 **없습니다.** 방문 기록은 관리자만 볼 수 있는 **구글 시트**로 자동 전송되고, 확인·분석·삭제는 모두 시트에서 합니다.

```
방문자 브라우저 ──(방문 시 1회, 30초 중복 방지)──▶ Google Apps Script 웹앱 ──▶ 관리자 구글 시트 '방문자로그'
                                                        ▲
                     빌드 시 주입: VITE_GOOGLE_SHEET_WEBHOOK_URL (GitHub Actions Variables)
```

- 웹훅 URL 이 등록되지 않으면 **아무것도 수집하지 않습니다** (외부 IP 조회도 안 함).
- 로컬 개발 서버(`npm run dev`)에서는 수집하지 않습니다.
- 수집 항목·보유기간은 개인정보 처리방침(`src/data/privacyPolicy.ts`)과 일치해야 합니다. (현재 보유기간 **1년**)

---

## 1. 최초 설정 (한 번만, 약 10분)

### ① 구글 시트 만들기
1. 회사 관리자 구글 계정으로 [Google Sheets](https://sheets.google.com) → **빈 스프레드시트** 생성 (예: `오픈더쉐어 방문자 로그`)
2. **파일 → 설정 → 시간대 = (GMT+09:00) 서울** 확인
3. 공유는 **관리자만** (링크 공유 끄기). 방문자 IP 등 개인정보가 들어갑니다.

### ② Apps Script 붙여넣기
1. 시트 메뉴 **확장 프로그램 → Apps Script**
2. 기존 코드를 모두 지우고 아래 코드를 붙여넣기 → 💾 저장

```javascript
/**
 * 오픈더쉐어 방문자 로그 수집 웹앱 (openthe.kr → 이 시트)
 * 사이트 코드: src/utils/visitorTracker.ts / 가이드: docs/VISITOR_LOG.md
 */
const SHEET_NAME = '방문자로그';
const SITE_ID = 'openthe.kr';          // 사이트에서 보내는 식별값과 같아야 기록됨
const RETENTION_DAYS = 365;            // 개인정보 처리방침의 보유기간(1년)과 일치

const HEADERS = ['방문일시(KST)', '세션ID', 'IP주소', '국가', '시도', '도시', '기관/기업명', 'ISP통신사',
  '접속페이지', '페이지명', '유입경로', 'UTM_SOURCE', '디바이스', 'OS', '브라우저', '화면해상도', '언어'];
const KEYS = ['visited_at', 'session_id', 'ip_address', 'country', 'region', 'city', 'org_name', 'isp',
  'page_url', 'page_title', 'referrer', 'utm_source', 'device_type', 'os', 'browser', 'screen_res', 'language'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sh;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const data = JSON.parse(e.postData.contents);
    if (data.site !== SITE_ID) return ContentService.createTextOutput('IGNORED');
    const row = KEYS.map(function (k) {
      return String(data[k] == null ? '' : data[k]).slice(0, 500);
    });
    getSheet_().appendRow(row);
    return ContentService.createTextOutput('OK');
  } catch (err) {
    return ContentService.createTextOutput('ERROR');
  } finally {
    lock.releaseLock();
  }
}

/** 보유기간이 지난 기록 삭제 — 시간 기반 트리거로 매일 실행 (아래 ④) */
function deleteOldLogs() {
  const sh = getSheet_();
  const last = sh.getLastRow();
  if (last < 2) return;
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const values = sh.getRange(2, 1, last - 1, 1).getValues();
  let count = 0;
  for (let i = 0; i < values.length; i++) {
    const v = values[i][0];
    const d = v instanceof Date ? v : new Date(String(v).replace(' ', 'T') + '+09:00');
    if (!isNaN(d) && d < cutoff) count++;
    else break; // 오래된 순으로 쌓이므로 첫 최신 행에서 중단
  }
  if (count > 0) sh.deleteRows(2, count);
}
```

### ③ 웹앱으로 배포
1. Apps Script 오른쪽 위 **배포 → 새 배포**
2. 톱니바퀴 → 유형 **웹 앱**
3. 설정
   - 설명: `openthe.kr 방문자 로그`
   - **실행 사용자: 나**
   - **액세스 권한이 있는 사용자: 모든 사용자** (방문자 브라우저가 로그인 없이 보내야 하므로 필수. 시트 자체는 공개되지 않음)
4. **배포** → 권한 승인(본인 계정 선택 → 고급 → 안전하지 않은 페이지로 이동 → 허용)
5. 표시되는 **웹 앱 URL** (`https://script.google.com/macros/s/.../exec`) 복사

### ④ 1년 지난 기록 자동 삭제 (권장)
Apps Script 왼쪽 **⏰ 트리거 → 트리거 추가**
- 실행할 함수: `deleteOldLogs` / 이벤트 소스: **시간 기반** / 유형: **일 단위 타이머** / 시간: 오전 3~4시 → 저장

### ⑤ 사이트에 URL 등록 후 재배포
1. GitHub 저장소 → **Settings → Secrets and variables → Actions → Variables 탭 → New repository variable**
   - Name: `VITE_GOOGLE_SHEET_WEBHOOK_URL`
   - Value: ③에서 복사한 웹 앱 URL
2. 재배포: 저장소 **Actions → Deploy to GitHub Pages → Run workflow** (또는 아무 변경 push)
3. 확인: 배포 완료 후 https://openthe.kr 을 열고 1~2분 뒤 시트 `방문자로그` 탭에 행이 생기면 성공

> 로컬에서 테스트하려면 `.env.local` 에 같은 값을 넣고 `npm run build && npm run preview` (dev 서버에서는 수집 안 함)

---

## 2. 데이터 보기·분석

| 하고 싶은 것 | 방법 |
|-------------|------|
| 최근 방문 | `방문자로그` 탭 맨 아래 (새 기록이 아래에 추가됨) |
| 기간 필터 | 1행 선택 → **데이터 → 필터 만들기** → 방문일시 열 필터 |
| 기관별/일별 방문 수 | **삽입 → 피벗 테이블** → 행: `기관/기업명`(또는 `방문일시`를 날짜로 그룹), 값: `세션ID` 의 COUNTUNIQUE |
| 유입 경로 분석 | 피벗 행: `유입경로` / `UTM_SOURCE` |
| 엑셀로 받기 | **파일 → 다운로드 → Microsoft Excel(.xlsx)** |

**캠페인 추적 팁**: 홍보 링크에 `?utm_source=이름` 을 붙이면 `UTM_SOURCE` 열에 기록됩니다.
예) 제안서 PDF 링크 `https://openthe.kr/?utm_source=proposal_2026`, 뉴스레터 `?utm_source=newsletter`

**기관/기업명 열 해석**: IP 의 소유 기관(ipapi.co 기준)입니다. 회사 전용 회선이면 기업명이 보이고, 가정·모바일은 통신사(KT, SK Broadband 등)로 표시됩니다.

## 3. 관리·운영

- **시트 공유 금지**: 관리자 외 공유하지 않습니다. 보고용이면 피벗 결과만 별도 시트로 복사해 공유
- **삭제 요청 대응**: 정보주체가 삭제를 요청하면 IP·세션ID 로 해당 행을 찾아 삭제
- **Apps Script 코드 수정 시**: **배포 → 배포 관리 → ✏️ 수정 → 버전: 새 버전 → 배포** (이렇게 해야 URL 이 그대로 유지됨. "새 배포"를 하면 URL 이 바뀌어 GitHub 변수도 바꿔야 함)
- **수집 중단**: GitHub 변수 `VITE_GOOGLE_SHEET_WEBHOOK_URL` 삭제 → 재배포
- **한도**: ipapi.co 무료 하루 약 1,000건. 초과 시 IP·지역 열만 비고 나머지는 정상 기록
- **공개 URL 주의**: 웹 앱 URL 은 사이트 JS 안에 들어가므로 마음먹으면 누구나 볼 수 있습니다. 이상한 행이 쌓이면 Apps Script 를 **새 배포**로 URL 을 바꾸고 GitHub 변수를 교체하세요.

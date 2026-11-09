# NO_BACKEND_POLICY — 백엔드 없는 사이트의 설계 원칙

이 사이트는 **GitHub Pages 정적 호스팅**입니다. 서버 코드를 실행할 수 없고, DB 도 없습니다.
기능 요청을 받으면 아래 순서로 판단합니다.

## 1. 대원칙

1. **브라우저로 내려가는 것은 전부 공개된다.** JS 번들, `VITE_*` 환경변수, `public/` 파일 모두 누구나 볼 수 있다.
2. **"쓰기"가 필요하면 외부 SaaS 에 위임한다.** 사이트가 직접 데이터를 저장하지 않는다.
3. **"주기적 갱신"은 GitHub Actions 가 서버 역할을 한다.** (cron → 데이터 수집 → 커밋 → 재배포)
4. **실패해도 사이트는 멀쩡해야 한다.** 외부 호출은 전부 `try/catch` + 타임아웃 + 대체 UI.
5. **localStorage 는 "그 방문자 한 명의 브라우저"일 뿐이다.** 공유 상태·통계·관리 데이터로 쓰지 않는다.

## 2. 기능 유형별 허용 패턴

| 요청 유형 | ✅ 이렇게 한다 | ❌ 하지 않는다 |
|-----------|---------------|----------------|
| 콘텐츠 추가/수정 (포트폴리오, 공지, 언론보도) | `mockData.ts` 수정 → push → 재배포. 블로그 글은 `sync_blog.py` 가 자동 반영 | 관리자 페이지에서 직접 수정하는 CMS 흉내 |
| 문의/신청 폼 | EmailJS (현재), 또는 Google Forms·Tally·Formspree 임베드 | 폼 데이터를 localStorage 에 저장하고 "접수됨" 표시 |
| 방문 통계 | Google Apps Script → 관리자 Sheets (현재, [VISITOR_LOG](../VISITOR_LOG.md)). 사이트에 통계 UI 를 두지 않음, 또는 GA4 / Naver Analytics / Cloudflare Web Analytics | 클라이언트 localStorage 로그를 "전체 통계"로 표시 |
| 검색 | 번들된 데이터에 대한 클라이언트 필터 (현재) | 서버 검색 API |
| 로그인/회원/관리자 | **도입하지 않는다.** 필요 시 ROADMAP 의 백엔드 도입 단계로 승격 | 프론트에 하드코딩한 비밀번호로 "관리자 잠금" (누구나 우회 가능) |
| 예약/결제 | 외부 서비스 링크 또는 임베드 (네이버 예약, 토스페이먼츠 링크결제 등) | 자체 결제 처리 |
| 뉴스레터 구독 | Stibee / Mailchimp 임베드 폼 | 이메일을 Sheets 웹훅에 그대로 POST (스팸·유출 위험) |
| 파일 업로드 | Google Forms 파일 업로드 등 외부 서비스 | 브라우저에서 클라우드 스토리지 키로 직접 업로드 |

## 3. 비밀값 분류

| 값 | 공개 가능? | 현재 위치 |
|----|-----------|-----------|
| EmailJS Service ID / Template ID / **Public** Key | ✅ (EmailJS 설계상 공개용) | `src/config/site.ts` |
| EmailJS **Private** Key | ❌ 절대 금지 | 사용 안 함 |
| Google Apps Script 웹앱 URL | ⚠️ 공개됨(번들에 포함). 스팸 POST 가능성 인지 | GitHub Actions Variables `VITE_GOOGLE_SHEET_WEBHOOK_URL` |
| GitHub Token | ❌ | Actions 의 `secrets.GITHUB_TOKEN` 만 사용 |
| `.vscode/mcp.json` 의 `GITHUB_PERSONAL_ACCESS_TOKEN` | ❌ | **빈 값으로 유지. 실제 토큰을 넣고 커밋하지 말 것** |

**보호 조치 권장**
- EmailJS 도메인 허용목록(`https://openthe.kr` 만 허용) — **유료 플랜 기능**(무료 플랜 미포함). 무료 플랜에서는 허니팟·입력 검증(적용됨) + 월 사용량 모니터링으로 대응
- EmailJS 템플릿에 일일 발송 한도 설정
- Apps Script `doPost` 에서 필드 길이 제한·필수 필드 검증

## 4. 개인정보 (PIPA) 주의

- 문의 폼: 이름·연락처·이메일 수집 → **고지 + 동의 체크박스 유지 필수**. 처리방침 본문과 폼 고지는 `src/data/privacyPolicy.ts` 한 곳에서 관리.
- 방문자 로그: 웹훅(빌드 환경변수)이 설정된 경우에만 수집. 시트는 관리자만 접근, 1년 경과분은 Apps Script 트리거로 자동 삭제 (처리방침 제3조와 일치시킬 것).

## 5. 백엔드가 정말 필요해지는 시점 (승격 기준)

다음 중 하나라도 해당되면 "서버리스 백엔드" 도입을 검토합니다. ([ROADMAP](ROADMAP.md) Phase 3)

- 사람이 웹에서 콘텐츠를 직접 등록/수정해야 한다 (Git/코드 수정 불가 인력)
- 로그인이 필요한 기능 (참여기관 전용 리포트 열람 등)
- 폼 데이터를 DB 로 관리하고 상태(접수→진행→완료)를 추적해야 한다

**추천 경로 (기존 GitHub Pages 유지 + 점진 도입)**
1. Headless CMS (Notion API / Sanity / Decap CMS) → 빌드 시점에 JSON 생성 → 기존 구조 그대로 사용
2. Cloudflare Workers / Vercel Functions 로 API 몇 개만 추가 (`/api/inquiry` 등) + Supabase(DB·Auth)
3. 프론트는 `src/services/*.ts` 레이어를 두고 그 안에서만 외부 호출 → 백엔드 교체 시 컴포넌트 수정 최소화

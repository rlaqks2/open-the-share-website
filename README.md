# OPEN THE SHARE (오픈더쉐어) 공식 웹사이트

기업·단체 단위 사회공헌(봉사) 프로그램을 기획·운영하는 **(주)오픈더쉐어**의 공식 사이트입니다.
기업 소개, 기업·단체 봉사 히스토리(포트폴리오) 공유, 파트너십 문의 접수를 담당합니다.

* 🌐 **운영 사이트**: [https://openthe.kr](https://openthe.kr)
* 🤖 **작업 규칙(하네스)**: [CLAUDE.md](CLAUDE.md) → [docs/harness/](docs/harness/README.md)
* 📘 **기획자/비개발자 가이드**: [docs/PLANNER_GUIDE.md](docs/PLANNER_GUIDE.md)
* 📋 **현재 기능 명세**: [docs/current_specs.md](docs/current_specs.md)

**스택**: React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · GitHub Pages (정적 사이트, 백엔드 없음)

---

## 🚀 빠른 시작

```bash
npm install
npm run dev        # http://localhost:5173/
```

| 명령 | 설명 |
|------|------|
| `npm run build` | 타입체크 + 프로덕션 빌드 (커밋 전 필수) |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run sync:blog` | 네이버 블로그 새 글 → 포트폴리오 반영 (Python 3) |
| `npm run ship` / `deploy.bat` | pull → 빌드 검사 → commit → push → **GitHub Actions 가 자동 배포** |

## 🔄 자동화

- **배포**: `master` 에 push 하면 `.github/workflows/deploy.yml` 이 빌드 후 `gh-pages` 로 배포 (openthe.kr)
- **블로그 동기화**: `.github/workflows/sync-blog.yml` 이 매시간 [공식 블로그](https://blog.naver.com/5penthe) RSS 를 확인해 새 봉사 후기를 포트폴리오에 자동 추가·배포

## 📂 구조

```
src/
├── App.tsx            # 화면/모달 상태 관리
├── config/site.ts     # 외부 서비스 설정 (공개값만)
├── data/mockData.ts   # ★ 사이트 콘텐츠 전체 (문구·포트폴리오·파트너·FAQ·회사정보)
├── components/        # layout · sections · pages · modals · forms · ui
├── hooks/ utils/      # 스크롤 애니메이션, 방문자 로그, 접근성 헬퍼
public/                # CNAME, 파비콘, images/(portfolio, partners)
scripts/sync_blog.py   # 블로그 → 포트폴리오 동기화
docs/                  # 기획 문서 + harness/(작업 규칙)
.claude/commands/      # 에이전트 슬래시 커맨드
```

자세한 구조는 [docs/harness/ARCHITECTURE.md](docs/harness/ARCHITECTURE.md) 를 참고하세요.

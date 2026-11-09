# docs/harness — 작업 하네스

"하네스"는 사람과 AI 에이전트가 이 저장소에서 **같은 규칙으로, 안전하게, 검증 가능하게** 작업하도록 만드는 문서 묶음입니다.
코드는 없고 Markdown 만으로 구성됩니다.

```
CLAUDE.md                  ← 진입점 (규칙 요약 + 문서 지도)
AGENTS.md                  ← 다른 에이전트용 포인터
docs/harness/
├── ARCHITECTURE.md        ← 구조·데이터 흐름·외부 서비스
├── NO_BACKEND_POLICY.md   ← 백엔드 없는 환경의 허용/금지 패턴, 비밀값, 승격 기준
├── DATA_GUIDE.md          ← mockData.ts 스키마·자동화 마커·이미지 규격
├── WORKFLOWS.md           ← 작업 유형별 플레이북 (W1~W9)
├── VERIFICATION.md        ← 완료 기준 체크리스트 (L0~L4)
├── DEPLOYMENT.md          ← 배포 파이프라인·도메인·환경변수·롤백
├── ROADMAP.md             ← 확장 계획·기술부채 (P0~P3)
└── CHANGELOG.md           ← 구조 변경 이력
.claude/commands/          ← 슬래시 커맨드 (Claude Code 에서 /이름 으로 실행)
├── add-portfolio.md
├── new-section.md
├── verify.md
└── release.md
```

## 유지 규칙

- 구조·규칙이 바뀌는 PR/커밋에는 **해당 하네스 문서 수정이 함께** 들어가야 합니다.
- 문서끼리 내용이 겹치면 한 곳에만 쓰고 링크합니다. (CLAUDE.md 는 요약만)
- 사실과 다른 문서는 없는 문서보다 해롭습니다. 틀린 부분을 발견하면 바로 고칩니다.

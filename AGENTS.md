# AGENTS.md

이 저장소의 에이전트 작업 규칙은 **[CLAUDE.md](CLAUDE.md)** 에 있습니다. (Claude Code 외 Codex·Cursor·Copilot 등 다른 에이전트도 동일하게 따릅니다.)

핵심만 요약하면:

1. 백엔드가 없는 정적 사이트입니다 → [docs/harness/NO_BACKEND_POLICY.md](docs/harness/NO_BACKEND_POLICY.md)
2. 콘텐츠는 `src/data/mockData.ts` 한 곳에 있습니다 → [docs/harness/DATA_GUIDE.md](docs/harness/DATA_GUIDE.md)
3. 완료 전 `npm run build` 통과 필수 → [docs/harness/VERIFICATION.md](docs/harness/VERIFICATION.md)
4. 배포는 `master` push → GitHub Actions 한 경로뿐 → [docs/harness/DEPLOYMENT.md](docs/harness/DEPLOYMENT.md)

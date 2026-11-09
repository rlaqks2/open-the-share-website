---
description: 검증 후 master 에 push 하여 openthe.kr 에 배포합니다 (사용자 확인 필수)
argument-hint: [커밋 메시지]
---

배포를 진행합니다. 커밋 메시지: $ARGUMENTS

1. `docs/harness/DEPLOYMENT.md` 를 읽는다.
2. `/verify` 절차(최소 L0)를 먼저 수행한다. 실패하면 중단하고 보고한다.
3. `git status` 로 커밋될 파일 목록을 사용자에게 보여주고, 의도하지 않은 파일(.env, 개인 메모, 대용량 파일)이 없는지 확인받는다.
4. 사용자 확인 후:
   - `git pull --rebase --autostash origin master`
   - `git add -A && git commit -m "<메시지>"` (메시지가 비었으면 변경 요약으로 작성)
   - `git push origin master`
5. GitHub Actions 의 Deploy 워크플로 결과를 확인하도록 안내한다 (`gh run list --workflow=deploy.yml --limit 1` 사용 가능 시 실행).
6. 구조·규칙이 바뀐 배포라면 `docs/harness/CHANGELOG.md` 에 기록했는지 확인한다.

⚠️ `gh-pages` 브랜치를 직접 수정하거나 `npm run deploy:manual` 을 쓰지 않는다 (비상시 사용자 지시가 있을 때만).

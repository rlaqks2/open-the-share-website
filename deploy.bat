@echo off
chcp 65001 >nul
echo ==============================================
echo  Open The Share Website - Build Check ^& Deploy
echo ==============================================
echo  배포 방식: master 브랜치에 push 하면 GitHub Actions(deploy.yml)가
echo  자동으로 빌드하여 https://openthe.kr 에 반영합니다.
echo  (이 스크립트는 로컬 빌드로 오류를 먼저 확인한 뒤 push 합니다)
echo ==============================================
echo.

set "PATH=%LOCALAPPDATA%\Programs\nodejs;%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"

echo [1/3] 최신 소스 동기화 (git pull --rebase --autostash)...
git pull --rebase --autostash origin master
if %ERRORLEVEL% NEQ 0 (
    echo [오류] 원격 변경사항과 충돌이 있습니다. 충돌을 해결한 뒤 다시 실행하세요.
    pause
    exit /b 1
)

echo [2/3] 로컬 빌드 검사 (npm run build)...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [오류] 빌드에 실패했습니다. 위 오류 메시지를 확인하세요. 배포하지 않습니다.
    pause
    exit /b 1
)

echo [3/3] 변경사항 커밋 및 푸시 (GitHub Actions 가 자동 배포)...
git add -A
git commit -m "Site update: %date% %time%" 2>nul
git push origin master
if %ERRORLEVEL% NEQ 0 (
    echo [오류] push 에 실패했습니다. 네트워크 또는 GitHub 로그인 상태를 확인하세요.
    pause
    exit /b 1
)

echo.
echo ==============================================
echo [완료] push 완료! 약 1~3분 뒤 사이트에 반영됩니다.
echo 접속 주소: https://openthe.kr
echo 배포 진행상황: GitHub 저장소 ^> Actions 탭
echo ==============================================
echo.
pause

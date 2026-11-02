@echo off
chcp 65001 >nul
echo ==============================================
echo  Open The Share Website - Build ^& Deploy
echo ==============================================
echo.

set "PATH=%LOCALAPPDATA%\Programs\nodejs;%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"

echo [1/3] 빌드 및 GitHub Pages 배포 진행 중...
call npm run deploy
if %ERRORLEVEL% NEQ 0 (
    echo [오류] 배포 중 문제가 발생했습니다.
    pause
    exit /b %ERRORLEVEL%
)

echo [2/3] 소스코드 변경사항 커밋 및 푸시...
git add .
git commit -m "Site update: %date% %time%" 2>nul
git push origin master

echo.
echo ==============================================
echo [완료] 배포가 성공적으로 완료되었습니다!
echo 접속 주소: https://rlaqks2.github.io/open-the-share-website/
echo ==============================================
echo.
pause

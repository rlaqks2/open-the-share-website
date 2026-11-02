@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title [오픈더쉐어] 기획자 원클릭 개발환경 셋업

echo ================================================================
echo   [오픈더쉐어] 기획자용 원클릭 개발 환경 셋업 도구
echo   - Node.js 설치 확인 및 자동 설치
echo   - 소스코드(Git) 다운로드 및 최신화 (master 브랜치)
echo   - Visual Studio Code 프로젝트 연동
echo ================================================================
echo.

:: 기본 설치 및 프로젝트 경로 설정
set "TARGET_DIR=C:\Project\open-the-share-website"
set "REPO_URL=https://github.com/rlaqks2/open-the-share-website.git"

:: -------------------------------------------------------------
:: 1단계: Git 설치 확인
:: -------------------------------------------------------------
echo [1/4] Git 설치 상태 확인 중...
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo   - Git이 설치되어 있지 않습니다. 자동 설치를 시도합니다...
    winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
    if %ERRORLEVEL% NEQ 0 (
        echo   [안내] winget 설치 실패. Git 공식 웹사이트에서 다운로드 설치가 필요할 수 있습니다.
    )
    set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;C:\Program Files\Git\cmd;%PATH%"
) else (
    echo   - Git 설치 확인 완료.
)
echo.

:: -------------------------------------------------------------
:: 2단계: Node.js 설치 확인
:: -------------------------------------------------------------
echo [2/4] Node.js 설치 상태 확인 중...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo   - Node.js가 감지되지 않았습니다. LTS 최신 버전을 설치합니다...
    winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements
    if %ERRORLEVEL% NEQ 0 (
        echo   - winget 다운로드 실패 시 공식 MSI 파일 직접 다운로드 및 설치 진행...
        powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi' -OutFile '%TEMP%\nodejs.msi'"
        start /wait msiexec /i "%TEMP%\nodejs.msi" /qn /norestart
        del /f /q "%TEMP%\nodejs.msi" >nul 2>&1
    )
    set "PATH=C:\Program Files\nodejs;%APPDATA%\npm;%LOCALAPPDATA%\Programs\nodejs;%PATH%"
    echo   - Node.js 설치 완료!
) else (
    echo   - Node.js 설치 확인 완료. (버전: )
    node -v
)
echo.

:: -------------------------------------------------------------
:: 3단계: 소스코드 다운로드 (Git Clone / Pull)
:: -------------------------------------------------------------
echo [3/4] 프로젝트 소스코드 준비 중...

:: 현재 위치가 이미 레포 내부인지 확인
if exist "%CD%\.git" (
    echo   - 현재 폴더가 프로젝트 폴더입니다: %CD%
    set "WORK_DIR=%CD%"
    echo   - 최신 소스 갱신 (git pull)...
    git checkout master >nul 2>&1
    git pull origin master
) else (
    :: 대상 디렉토리가 존재하는지 확인
    if exist "%TARGET_DIR%\.git" (
        echo   - 이미 소스 폴더가 존재합니다: %TARGET_DIR%
        set "WORK_DIR=%TARGET_DIR%"
        cd /d "%TARGET_DIR%"
        echo   - 최신 소스 갱신 (git pull)...
        git checkout master >nul 2>&1
        git pull origin master
    ) else (
        echo   - 소스코드를 다운로드(Clone)합니다: %TARGET_DIR%
        if not exist "C:\Project" mkdir "C:\Project"
        git clone -b master "%REPO_URL%" "%TARGET_DIR%"
        set "WORK_DIR=%TARGET_DIR%"
        cd /d "%TARGET_DIR%"
    )
)
echo   - 소스코드 준비 완료!
echo.

:: -------------------------------------------------------------
:: 4단계: VS Code 연동 및 마무리 안내
:: -------------------------------------------------------------
echo [4/4] Visual Studio Code 연동 중...

where code >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   - VS Code로 프로젝트 폴더를 엽니다...
    start "" code "%WORK_DIR%"
) else (
    echo   - [참고] VS Code 명령어가 감지되지 않았습니다. 수동으로 VS Code에서 [%WORK_DIR%] 폴더를 열어주세요.
)

echo.
echo ================================================================
echo   [성공] 모든 사전 준비가 완료되었습니다! (npm install 직전 단계)
echo ================================================================
echo.
echo   [다음 작업 안내 - 딱 1단계만 실행하세요]
echo   1. 열린 Visual Studio Code에서 단축키 [ Ctrl + ` ] (또는 상단 메뉴 터미널 - 새 터미널)
echo   2. 터미널 창에 아래 명령어를 입력하고 엔터를 치면 패키지 설치가 완료됩니다:
echo.
echo      npm install
echo.
echo   3. 설치 후 화면 미리보기 실행:
echo      npm run dev
echo.
echo ================================================================
echo.
set /p DO_NPM_INSTALL="지금 바로 npm install 및 사이트 미리보기(npm run dev)를 시작할까요? (Y/N, 기본값: Y): "
if "%DO_NPM_INSTALL%"=="" set DO_NPM_INSTALL=Y

if /i "%DO_NPM_INSTALL%"=="Y" (
    echo.
    echo [*] npm install 진행 중... 잠시만 기다려주세요.
    cd /d "%WORK_DIR%"
    call npm install
    echo.
    echo [*] 모든 패키지 설치 완료! 실시간 브라우저 미리보기를 시작합니다...
    timeout /t 2 >nul
    start http://localhost:5173/open-the-share-website/
    call npm run dev
)

echo 창을 닫으려면 아무 키나 누르세요.
pause >nul

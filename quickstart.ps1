# [오픈더쉐어] 기획자용 초고속 원클릭 실행 스크립트
# Node.js 확인 -> 소스 최신화 -> npm install -> VS Code 실행 -> npm run dev 로컬 서버 구동

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "오픈더쉐어 - 자동 설치 및 서버 실행"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " [오픈더쉐어] 개발 환경 자동 구성 및 로컬 서버 실행기" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Node.js 확인
Write-Host "[1/4] Node.js 설치 확인 중..." -ForegroundColor Yellow
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue

if (-not $nodeInstalled) {
    Write-Host "  -> Node.js가 없어 자동으로 설치합니다. 잠시만 기다려주세요..." -ForegroundColor Cyan
    try {
        winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements --silent
    } catch {
        Write-Host "  -> winget 실패로 msi 수동 다운로드 설치 진행..." -ForegroundColor Yellow
        $msiPath = "$env:TEMP\node.msi"
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi" -OutFile $msiPath
        Start-Process msiexec.exe -ArgumentList "/i `"$msiPath`" /qn /norestart" -Wait
        Remove-Item -Force $msiPath -ErrorAction SilentlyContinue
    }
    # PATH 갱신
    $env:Path = "C:\Program Files\nodejs;$env:APPDATA\npm;$env:LOCALAPPDATA\Programs\nodejs;$env:Path"
}
Write-Host "  -> Node.js 준비 완료: $(node -v)" -ForegroundColor Green
Write-Host ""

# 2. 최신 코드 가져오기 (Git)
Write-Host "[2/4] 최신 소스코드 확인 중..." -ForegroundColor Yellow
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if ($gitInstalled) {
    git checkout master 2>$null
    git pull origin master
    Write-Host "  -> 소스코드 최신화 완료 (master 브랜치)" -ForegroundColor Green
}
Write-Host ""

# 3. npm install 실행
Write-Host "[3/4] 패키지 의존성 설치 진행 (npm install)..." -ForegroundColor Yellow
Write-Host "  -> 최초 1회는 수십 초 정도 걸릴 수 있습니다." -ForegroundColor Gray
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  [경고] npm install 중 경고가 있었으나 계속 진행합니다." -ForegroundColor Yellow
} else {
    Write-Host "  -> 패키지 설치 완료!" -ForegroundColor Green
}
Write-Host ""

# 4. VS Code 실행 및 로컬 미리보기 서버 가동
Write-Host "[4/4] Visual Studio Code 및 로컬 서버 시작..." -ForegroundColor Yellow
$codeInstalled = Get-Command code -ErrorAction SilentlyContinue
if ($codeInstalled) {
    Start-Process code -ArgumentList (Get-Location).Path
    Write-Host "  -> Visual Studio Code 실행 완료" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " [성공] 모든 준비가 완료되었습니다!" -ForegroundColor Green
Write-Host " 실시간 미리보기 서버(npm run dev)를 가동합니다..." -ForegroundColor Green
Write-Host " 브라우저 주소: http://localhost:5173/open-the-share-website/" -ForegroundColor Cyan
Write-Host " 종료하려면 터미널 창에서 Ctrl + C 를 누르세요." -ForegroundColor Gray
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# 3초 후 브라우저 자동 오픈
Start-Sleep -Seconds 2
Start-Process "http://localhost:5173/open-the-share-website/"

# Vite 개발 서버 실행
npm run dev

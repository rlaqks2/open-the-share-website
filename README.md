# OpenThe Share - 기업 사회공헌 프로그램 전문 파트너

본 프로젝트는 기업의 사회공헌 및 ESG 경영 프로그램을 전문으로 하는 "OpenThe Share"의 공식 웹사이트 랜딩 페이지입니다. React, TypeScript, Tailwind CSS를 사용하여 구축된 모던하고 반응형인 웹 애플리케이션입니다.

* 🌐 **배포 사이트**: [https://rlaqks2.github.io/open-the-share-website/](https://rlaqks2.github.io/open-the-share-website/)
* 📘 **기획자/비개발자 작업 가이드**: [docs/PLANNER_GUIDE.md](docs/PLANNER_GUIDE.md) (문구 수정, 이미지 교체, 실시간 미리보기 및 배포법)
* 📋 **기획 명세서**: [docs/current_specs.md](docs/current_specs.md)

---

## 🚀 빠른 시작 (Quick Start)

### 1. 개발 서버 실행 (실시간 미리보기)
```bash
npm install
npm run dev
```

### 2. GitHub Pages 즉시 배포
* **VS Code 단축키**: `Ctrl + Shift + B` (자동 빌드 후 배포)
* **스크립트 더블클릭**: 프로젝트 루트의 `deploy.bat` 실행
* **터미널 명령어**:
  ```bash
  npm run deploy   # 빌드 후 gh-pages 브랜치로 배포
  npm run ship     # 배포 + Git 변경사항 자동 커밋/푸시
  ```

---

## 📂 소스 코드 구조

```
/
├── .github/workflows/   # GitHub Actions 자동 배포 워크플로우
├── .vscode/             # VS Code 작업(Task), MCP 설정
├── docs/                # 기획 문서 및 기획자용 작업 가이드
│   ├── current_specs.md # 최신 기획 명세서
│   └── PLANNER_GUIDE.md # 기획자/비개발자 소스 수정 & 배포 가이드
├── src/
│   ├── components/      # React 컴포넌트 (sections, modals, layout, ui)
│   ├── data/            # 텍스트, FAQ, 포트폴리오 등 정적 데이터 (mockData.ts)
│   ├── hooks/           # 커스텀 훅
│   └── types.ts         # TypeScript 타입 정의
├── deploy.bat           # 원클릭 빌드 & 배포 배치파일
├── package.json         # 의존성 및 스크립트 정의
└── vite.config.ts       # Vite 번들러 설정
```

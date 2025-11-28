# OpenThe Share - 기업 사회공헌 프로그램 전문 파트너

본 프로젝트는 기업의 사회공헌 및 ESG 경영 프로그램을 전문으로 하는 "OpenThe Share"의 공식 웹사이트입니다. React, TypeScript, Tailwind CSS를 사용한 프론트엔드와 Spring Boot, PostgreSQL을 사용한 백엔드로 구성된 풀스택 웹 애플리케이션입니다.

## 목차

- [프로젝트 요약](#프로젝트-요약)
- [주요 기술 스택](#주요-기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
  - [사전 준비물](#사전-준비물)
  - [Frontend 실행](#frontend-실행)
  - [Backend 실행](#backend-실행)

## 프로젝트 요약

이 웹 애플리케이션은 OpenThe Share의 온라인 공식 창구 역할을 합니다. 회사의 비전, 제공하는 서비스, 성공적인 프로젝트 포트폴리오, 그리고 사회에 미친 긍정적인 영향 등을 잠재적인 기업 파트너에게 효과적으로 전달하는 것을 목표로 합니다.

## 주요 기술 스택

### Frontend
- **프레임워크:** [React](https://reactjs.org/)
- **언어:** [TypeScript](https://www.typescriptlang.org/)
- **스타일링:** [Tailwind CSS](https://tailwindcss.com/)
- **빌드 도구:** [Vite](https://vitejs.dev/)

### Backend
- **프레임워크:** [Spring Boot 3.2.5](https://spring.io/projects/spring-boot)
- **언어:** [Java 17](https://www.oracle.com/java/)
- **ORM:** Spring Data JPA
- **데이터베이스:** [PostgreSQL](https://www.postgresql.org/)

## 프로젝트 구조

```
/
├── frontend/           # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/  # React 컴포넌트
│   │   │   ├── forms/
│   │   │   ├── layout/
│   │   │   ├── modals/
│   │   │   ├── sections/
│   │   │   └── ui/
│   │   ├── data/       # Mock 데이터
│   │   ├── hooks/      # 커스텀 훅
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── types.ts
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/            # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/opentheshare/
│   │   │   │   ├── controller/
│   │   │   │   ├── entity/
│   │   │   │   └── repository/
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/       # 테스트 코드
│   └── build.gradle
│
└── README.md
```

## 시작하기

### 사전 준비물

- **Node.js** (버전 18.x 이상) 및 **npm**
- **Java 17** (JDK)
- **PostgreSQL**

### Frontend 실행

1. **frontend 디렉토리로 이동:**
   ```bash
   cd frontend
   ```

2. **의존성 설치:**
   ```bash
   npm install
   ```

3. **개발 서버 실행:**
   ```bash
   npm run dev
   ```
   
4. **브라우저에서 확인:**
   - `http://localhost:5173` 접속

### Backend 실행

1. **PostgreSQL 데이터베이스 생성:**
   ```sql
   CREATE DATABASE opentheshare;
   ```

2. **설정 확인:**
   - `backend/src/main/resources/application.yml` 파일에서 데이터베이스 접속 정보 확인

3. **backend 디렉토리로 이동 및 실행:**
   ```bash
   cd backend
   ./gradlew bootRun  # Windows: gradlew.bat bootRun
   ```

4. **API 확인:**
   - 백엔드 서버: `http://localhost:8080`
   - API 엔드포인트: `http://localhost:8080/api/content`
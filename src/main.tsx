/**
 * @file main.tsx
 * @description React 애플리케이션의 메인 진입점(Entry Point)입니다.
 * 이 파일은 HTML 파일의 'root' 요소를 찾아 React 애플리케이션의
 * 최상위 컴포넌트인 App 컴포넌트를 렌더링하는 역할을 합니다.
 * 전역 CSS 파일도 여기서 임포트합니다.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// document.getElementById('root')!는 'root'라는 id를 가진 HTML 요소가 반드시 존재함을 TypeScript에 알립니다.
ReactDOM.createRoot(document.getElementById('root')!).render(
  // React.StrictMode는 개발 중에 잠재적인 문제를 감지하고 경고를 표시해주는 개발용 도구입니다.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
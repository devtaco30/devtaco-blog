import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import './App.css';

// 페이지 컴포넌트들
import Home from './pages/Home';
import { BlogList, BlogPost } from './pages/Blog';
import About from './pages/About';

function AppContent() {
  useEffect(() => {
    // 기본 버전 로깅
    console.log('=== DevTaco Blog ===');
    console.log('Version:', process.env.REACT_APP_VERSION || '1.0.0');
    console.log('Build Time:', process.env.REACT_APP_BUILD_TIME || new Date().toLocaleString());
    console.log('Test Log');
    
    // 환경변수 확인용 로깅
    console.log('Firebase Config:', {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? 'exists' : 'missing',
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL ? 'exists' : 'missing',
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'exists' : 'missing'
    });
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<BlogList />} />
        <Route path="/posts/:slug" element={<BlogPost />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

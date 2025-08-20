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
    // 앱 초기화
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

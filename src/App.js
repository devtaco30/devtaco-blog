import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import './App.css';

// Auth 관련
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/Auth/LoginPage';

// 페이지 컴포넌트들
import Home from './pages/Home';
import { BlogList, BlogPost } from './pages/Blog';
import About from './pages/About';

import PostManager from './pages/Admin/PostManager';

function AppContent() {
  useEffect(() => {
    // OAuth 리다이렉트 후 세션 확인
    const checkOAuthRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      
      if (accessToken || refreshToken) {
        console.log('🔄 OAuth 리다이렉트 감지!');
        console.log('🔑 Access Token:', accessToken ? '있음' : '없음');
        console.log('🔄 Refresh Token:', refreshToken ? '있음' : '없음');
      }
    };
    
    checkOAuthRedirect();
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<BlogList />} />
        <Route path="/posts/:id" element={<BlogPost />} />
        <Route path="/about" element={<About />} />

        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/admin/posts" 
          element={
            <ProtectedRoute>
              <PostManager />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

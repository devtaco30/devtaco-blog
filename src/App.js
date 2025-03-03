import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Grid, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import './App.css';
import VisitorCounter from './components/VisitorCounter';

// 페이지 컴포넌트들
import Blog from './Blog';
import Profile from './components/Profile';

function App() {
  const hasAds = false;  // 광고 데이터 존재 여부를 확인하는 상태

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>DevTaco Blog</h1>
          <nav>
            <ul className="nav-links">
              <li><Link to="/"><HomeIcon /> Home</Link></li>
            </ul>
          </nav>
        </header>

        <Container 
          maxWidth="xl"
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Grid 
            container 
            spacing={3}
            sx={{
              maxWidth: '1800px',
              margin: '0 auto',
              justifyContent: 'center'
            }}
          >
            {/* 왼쪽 사이드바 - 프로필 */}
            <Grid item xs={12} md={hasAds ? 2 : 2.5}>
              <Paper 
                className="sidebar"
                sx={{
                  position: 'sticky',
                  top: '2rem',
                  maxHeight: 'calc(100vh - 4rem)',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '0.4em'
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '10px'
                  }
                }}
              >
                <Profile />
                <VisitorCounter />
              </Paper>
            </Grid>

            {/* 메인 컨텐츠 영역 */}
            <Grid item xs={12} md={hasAds ? 7.5 : 8}>
              <Paper className="main-content">
                <Routes>
                  <Route path="/" element={<Blog />} />
                </Routes>
              </Paper>
            </Grid>

            {/* 오른쪽 사이드바 - 광고 및 추가 정보 (조건부 렌더링) */}
            {hasAds && (
              <Grid item xs={12} md={3}>
                <Paper className="sidebar">
                  <div className="advertisement">
                    <h3>Advertisement</h3>
                    <div className="ad-placeholder">
                      광고 영역
                    </div>
                  </div>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Container>

        <footer>
          <p>© 2025 DevTaco Blog. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

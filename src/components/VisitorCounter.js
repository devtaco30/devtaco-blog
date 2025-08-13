import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const VisitorCounter = () => {
  const [visitors, setVisitors] = useState({
    today: 0,     // 0으로 초기화
    total: 0,     // 0으로 초기화
    loading: true  // 로딩 상태로 시작
  });

  const isFirebaseConfigured = Boolean(process.env.REACT_APP_FIREBASE_API_KEY);

  useEffect(() => {
    console.log('Firebase 초기화 시작');
    // Firebase 환경변수가 없으면 Firebase 로직 실행하지 않음
    if (!isFirebaseConfigured) {
      console.log('Firebase 환경변수 없음, 초기화 중단');
      setVisitors({
        today: 0,
        total: 0,
        loading: false
      });
      return;
    }

    const initFirebase = async () => {
      try {
        console.log('Firebase 모듈 로딩 시작');
        const { database } = await import('../firebase');
        const { ref, onValue, increment, update } = await import('firebase/database');
        console.log('Firebase 모듈 로딩 성공');
        
        const today = new Date().toISOString().split('T')[0];
        const visitorsRef = ref(database, 'visitors');
        
        // 방문자 수 업데이트
        const updateVisitors = async () => {
          const lastVisit = localStorage.getItem('lastVisit');
          
          if (lastVisit !== today) {
            localStorage.setItem('lastVisit', today);
            
            // Firebase 데이터 업데이트
            const updates = {};
            updates[`/total`] = increment(1);
            updates[`/daily/${today}`] = increment(1);
            await update(visitorsRef, updates);
          }
        };

        // 실시간 방문자 수 리스너
        const unsubscribe = onValue(visitorsRef, (snapshot) => {
          const data = snapshot.val() || {};
          setVisitors({
            today: data.daily?.[today] || 0,
            total: data.total || 0,
            loading: false
          });
        });

        console.log('Firebase 방문자 데이터 리스너 설정 완료');
        updateVisitors();

        return () => {
          unsubscribe(); // 컴포넌트 언마운트시 리스너 제거
        };
      } catch (error) {
        console.error('Firebase 초기화 실패:', error);
        setVisitors({
          today: 0,
          total: 0,
          loading: false
        });
      }
    };

    initFirebase();
  }, [isFirebaseConfigured]);



  if (visitors.loading) {
    return (
      <Box className="visitor-counter" sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          방문자 수
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
          <CircularProgress size={16} sx={{ mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            로딩 중...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="visitor-counter" sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        방문자 수
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body1">
          Today: {visitors.today}
        </Typography>
        <Typography variant="body1">
          Total: {visitors.total}
        </Typography>
      </Box>
    </Box>
  );
};

export default VisitorCounter; 
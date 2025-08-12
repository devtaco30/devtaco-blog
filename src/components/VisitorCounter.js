import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const VisitorCounter = () => {
  const [visitors, setVisitors] = useState({
    today: 42,    // 임의의 숫자
    total: 1234,  // 임의의 숫자
    loading: false
  });

  const isFirebaseConfigured = Boolean(process.env.REACT_APP_FIREBASE_API_KEY);

  useEffect(() => {
    // Firebase 환경변수가 없으면 Firebase 로직 실행하지 않음
    if (!isFirebaseConfigured) {
      return;
    }

    const initFirebase = async () => {
      try {
        const { database } = await import('../firebase');
        const { ref, onValue, increment, update } = await import('firebase/database');
        
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
    return <CircularProgress size={20} />;
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
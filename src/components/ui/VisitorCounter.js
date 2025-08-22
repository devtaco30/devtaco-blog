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
    // Firebase 환경변수가 없으면 Firebase 로직 실행하지 않음
    if (!isFirebaseConfigured) {
      console.log('⚠️ Firebase 환경변수가 설정되지 않았습니다. 방문자 카운터가 비활성화됩니다.');
      setVisitors({
        today: 0,
        total: 0,
        loading: false
      });
      return;
    }

    const initFirebase = async () => {
      try {
        const { database } = await import('../firebase');
        const { ref, onValue, increment, update } = await import('firebase/database');
        
        const today = new Date().toISOString().split('T')[0];
        const visitorsRef = ref(database, 'visitors');
        
        console.log(`🔥 Firebase 연결 성공! 오늘 날짜: ${today}`);
        
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
            
            // 방문 카운트 증가 로그
            console.log(`🚀 새로운 방문자! 오늘(${today}) 방문자 수 증가`);
          } else {
            console.log(`🔄 오늘(${today}) 이미 방문한 사용자입니다.`);
          }
        };

        // 실시간 방문자 수 리스너
        const unsubscribe = onValue(visitorsRef, (snapshot) => {
          const data = snapshot.val() || {};
          const todayCount = data.daily?.[today] || 0;
          const totalCount = data.total || 0;
          
          setVisitors({
            today: todayCount,
            total: totalCount,
            loading: false
          });
          
          // 첫 로딩 시 방문자 수 콘솔 출력
          console.log(`📊 방문자 통계 - 오늘: ${todayCount}, 전체: ${totalCount}`);
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
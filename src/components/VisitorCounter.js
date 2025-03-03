import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { database } from '../firebase';
import { ref, onValue, increment, update } from 'firebase/database';

const VisitorCounter = () => {
  const [visitors, setVisitors] = useState({
    today: 0,
    total: 0,
    loading: true
  });

  useEffect(() => {
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
  }, []);

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
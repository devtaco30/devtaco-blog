import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { supabase } from '../../supabase';

const VisitorCounter = () => {
  const [visitors, setVisitors] = useState({
    today: 0,
    total: 0,
    loading: true
  });
  const [visitIncremented, setVisitIncremented] = useState(false);

  useEffect(() => {
    const fetchVisitorStats = async () => {
      try {
        // 오늘 날짜의 방문자 통계 가져오기
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('visitor_stats')
          .select('*')
          .eq('date', today)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116는 데이터가 없는 경우
          console.error('방문자 통계 조회 실패:', error);
          return;
        }

        const todayCount = data?.daily_count || 0;
        const totalCount = data?.total_count || 0;

        setVisitors({
          today: todayCount,
          total: totalCount,
          loading: false
        });


      } catch (error) {
        console.error('방문자 통계 조회 실패:', error);
        setVisitors({
          today: 0,
          total: 0,
          loading: false
        });
      }
    };

    fetchVisitorStats();
  }, []);

  // 방문자 수 증가 (중복 방지)
  useEffect(() => {
    if (!visitors.loading && !visitIncremented) {
      const incrementVisit = async () => {
        try {
          const today = new Date().toISOString().split('T')[0];
          
          // localStorage와 sessionStorage로 중복 방지
          const lastVisit = localStorage.getItem('lastVisit');
          const sessionVisit = sessionStorage.getItem('sessionVisit');
          
          if (lastVisit !== today || !sessionVisit) {
            console.log('🚀 새로운 방문자! 방문자 수 증가 시작');
            
            // Supabase 함수 호출로 방문자 수 증가
            const { error } = await supabase.rpc('increment_visitor_count');
            
            if (error) {
              console.error('❌ 방문자 수 증가 실패:', error);
              return;
            }

            console.log('✅ 방문자 수 증가 성공!');

            // 방문 기록 저장
            localStorage.setItem('lastVisit', today);
            sessionStorage.setItem('sessionVisit', 'true');
            console.log('💾 방문 기록 저장 완료');

            // 방문자 수 증가 후 최신 데이터 가져오기
            const { data: updatedStats, error: fetchError } = await supabase
              .from('visitor_stats')
              .select('*')
              .eq('date', today)
              .single();

            if (!fetchError && updatedStats) {
              console.log('📊 업데이트된 방문자 통계:', updatedStats);
              setVisitors({
                today: updatedStats.daily_count,
                total: updatedStats.total_count,
                loading: false
              });
            }

            setVisitIncremented(true);
            console.log('🎉 방문자 카운팅 완료!');
          } else {
            console.log('🔄 이미 방문한 사용자입니다');
            setVisitIncremented(true);
          }
        } catch (error) {
          console.error('방문자 수 증가 처리 실패:', error);
          setVisitIncremented(true);
        }
      };

      incrementVisit();
    }
  }, [visitors.loading, visitIncremented]);

  // 실시간 구독 (선택사항)
  useEffect(() => {
    if (!visitors.loading) {
      const channel = supabase
        .channel('visitor_stats')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'visitor_stats'
          },
          (payload) => {
            setVisitors({
              today: payload.new.daily_count,
              total: payload.new.total_count,
              loading: false
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [visitors.loading]);

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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
        <Typography variant="h4" color="primary" fontWeight="bold">
          {visitors.today}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          오늘
        </Typography>
        <Typography variant="h6" color="text.secondary">
          총 {visitors.total}명
        </Typography>
      </Box>
    </Box>
  );
};

export default VisitorCounter; 
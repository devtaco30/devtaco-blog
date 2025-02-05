import React from 'react';
import { Box, Typography } from '@mui/material';

function Home() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        안녕하세요, DevTaco입니다! 👋
      </Typography>
      
      <Typography variant="body1" paragraph>
        Java와 Kotlin을 주로 사용하는 백엔드 개발자입니다. 새로운 기술과 도전을 좋아하며, 개인적인 호기심으로 다양한 프로젝트를 진행하고 있습니다.
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        🛠 Technical Background
      </Typography>
      <Typography variant="body1" paragraph>
        Main: Java, Kotlin (Backend Development)
      </Typography>

      <Typography variant="h6" gutterBottom>
        Interests:
      </Typography>
      <ul>
        <li>블록체인 & 가상자산</li>
        <li>인공지능 (AI)</li>
        <li>자동화 시스템</li>
      </ul>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        💡 Current Focus
      </Typography>
      <Typography variant="body1">
        현재는 개인적인 호기심을 바탕으로 다음과 같은 분야를 탐구하고 있습니다:
      </Typography>
      <ul>
        <li>GitHub Actions를 활용한 자동화 시스템 구축</li>
        <li>AI를 활용한 개발 생산성 향상</li>
        <li>블록체인 기술 학습 및 적용</li>
      </ul>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        ✨ About This Blog
      </Typography>
      <Typography variant="body1">
        이 블로그는 제가 학습하고 경험한 기술적 내용들을 공유하는 공간입니다. 주로 다음과 같은 내용들을 다룰 예정입니다:
      </Typography>
      <ul>
        <li>백엔드 개발 이야기</li>
        <li>새로운 기술 학습 과정</li>
        <li>개발 프로젝트 진행기</li>
        <li>기술 실험 및 검증 결과</li>
      </ul>
    </Box>
  );
}

export default Home; 
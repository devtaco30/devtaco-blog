import React from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  Grid, 
  Paper,
  LinearProgress,
  Divider
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';

const Blog = () => {
  const skills = {
    main: [
      { name: 'Java', level: 90 },
      { name: 'Kotlin', level: 85 },
      { name: 'Spring Boot', level: 88 },
    ],
    databases: ['MySQL', 'PostgreSQL', 'MongoDB'],
    tools: ['Git', 'Docker', 'AWS', 'Jenkins'],
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* 메인 소개 */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        안녕하세요, DevTaco입니다! 👋
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.8 }}>
        백엔드 개발자로서 Java와 Kotlin을 주력 언어로 사용하며, Spring Boot 기반의 
        서버 애플리케이션 개발에 전문성을 가지고 있습니다.
      </Typography>

      {/* 기술 스택 */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeIcon /> Core Skills
          </Typography>
          <Grid container spacing={3}>
            {skills.main.map((skill) => (
              <Grid item xs={12} md={4} key={skill.name}>
                <Typography variant="subtitle1" gutterBottom>
                  {skill.name}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={skill.level}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#2196f3'
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <StorageIcon /> Databases
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {skills.databases.map((db) => (
              <Chip key={db} label={db} color="primary" variant="outlined" />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudIcon /> Tools & Platforms
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {skills.tools.map((tool) => (
              <Chip key={tool} label={tool} color="primary" variant="outlined" />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Current Focus */}
      <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3 }}>
        💡 Current Focus
      </Typography>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1" paragraph>
          현재는 다음과 같은 분야를 탐구하고 있습니다:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li>MSA 아키텍처 설계 및 구현</li>
          <li>GitHub Actions를 활용한 CI/CD 파이프라인 구축</li>
          <li>클라우드 네이티브 애플리케이션 개발</li>
          <li>블록체인 기술 학습 및 적용</li>
        </Box>
      </Paper>

      {/* Contact */}
      <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 2 }}>
        📫 Contact
      </Typography>
      <Typography variant="body1">
        개발 관련 질문이나 협업 제안은 언제나 환영합니다!
      </Typography>
      <Box component="ul" sx={{ pl: 2 }}>
        <li>
          <Typography variant="body1">
            GitHub: <a href="https://github.com/devtaco30" style={{color: '#2196f3'}}>@devtaco30</a>
          </Typography>
        </li>
      </Box>
    </Box>
  );
};

export default Blog;
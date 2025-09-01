import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';

const LoginPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signInWithGitHub, user } = useAuth();
  const navigate = useNavigate();

  // 이미 로그인된 상태라면 관리자 페이지로 리다이렉트
  useEffect(() => {
    if (user) {
      console.log('✅ 이미 로그인된 상태 - 관리자 페이지로 리다이렉트');
      navigate(ROUTES.ADMIN_POSTS);
    }
  }, [user, navigate]);



  const handleGitHubLogin = async () => {
    setError('');
    setLoading(true);

    console.log('🔄 GitHub 로그인 처리 시작');

    try {
      const { error } = await signInWithGitHub();
      if (error) {
        console.error('❌ GitHub 로그인 실패:', error.message);
        setError(error.message);
      } else {
        console.log('✅ GitHub 로그인 리다이렉트 성공');
      }
      // GitHub OAuth는 팝업이나 리다이렉트로 처리되므로 여기서는 에러만 처리
    } catch (err) {
      console.error('💥 GitHub 로그인 중 예외 발생:', err);
      setError('GitHub 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중이거나 이미 로그인된 상태라면 로딩 표시
  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography variant="h6" gutterBottom>
              로그인 처리 중...
            </Typography>
            <CircularProgress />
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >


        <Paper
          elevation={8}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid #e3f2fd',
          }}
        >
          <Typography component="h2" variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            🔐 관리자 로그인
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
            블로그 포스트를 관리하려면 GitHub 계정으로 로그인하세요.<br />
            <strong>devtaco30</strong> 계정만 접근 가능합니다.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* GitHub 로그인 버튼 */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<GitHubIcon />}
            onClick={handleGitHubLogin}
            disabled={loading}
            sx={{ 
              mb: 3,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2,
              background: 'linear-gradient(45deg, #24292e, #586069)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1b1f23, #444d56)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? '로그인 중...' : 'GitHub로 로그인'}
          </Button>

          {/* 보안 정보 */}
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: '#f3f4f6', 
            borderRadius: 2, 
            width: '100%',
            textAlign: 'center'
          }}>
            <Typography variant="caption" color="text.secondary">
              🔒 OAuth 2.0을 통한 안전한 인증
            </Typography>
          </Box>
        </Paper>

      </Box>
    </Container>
  );
};

export default LoginPage;

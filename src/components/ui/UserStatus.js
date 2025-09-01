import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const UserStatus = () => {
  const { user, loading, signOut } = useAuth();



  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          로딩 중...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          로그인되지 않음
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        로그인 상태
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          이메일: {user.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {user.id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          로그인 시간: {new Date(user.created_at).toLocaleString('ko-KR')}
        </Typography>
        {user.user_metadata && (
          <Typography variant="body2" color="text.secondary">
            GitHub: {user.user_metadata.full_name || user.user_metadata.name}
          </Typography>
        )}
      </Box>
      <Chip 
        label="로그인됨" 
        color="success" 
        size="small" 
        sx={{ mr: 1 }}
      />
      <Button 
        variant="outlined" 
        size="small" 
        onClick={signOut}
        color="error"
      >
        로그아웃
      </Button>
    </Box>
  );
};

export default UserStatus;

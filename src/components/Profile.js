import React from 'react';
import { Avatar, Box, Typography, IconButton, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import profileImage from '../IMG_9335.jpg';

function Profile() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar
          src={profileImage}
          sx={{
            width: 120,
            height: 120,
            border: '4px solid white',
            boxShadow: '0 0 20px rgba(0,0,0,0.1)'
          }}
        />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            DevTaco
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              backgroundColor: 'primary.main',
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: 5,
              display: 'inline-block'
            }}
          >
            Backend Developer
          </Typography>
        </Box>
        
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: 'center',
            color: 'text.secondary'
          }}
        >
          현재를 살아가는 개발자입니다.
        </Typography>

        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ mt: 1 }}
        >
          <IconButton 
            href="https://github.com/devtaco30" 
            target="_blank"
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(0,0,0,0.04)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s'
            }}
          >
            <GitHubIcon />
          </IconButton>
          <IconButton 
            href="mailto:devtaco30@gmail.com"
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(0,0,0,0.04)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s'
            }}
          >
            <EmailIcon />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}

export default Profile;
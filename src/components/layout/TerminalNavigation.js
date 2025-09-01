import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TerminalNavigation = ({ terminalOpen, closeTerminal, handleNavigationClick }) => {
  return (
    <Box sx={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#000000',
      color: '#9acd32',
      fontFamily: 'monospace',
      fontSize: '0.9rem',
      padding: 2,
      borderTop: '2px solid #9acd32',
      zIndex: 1000,
      transform: terminalOpen ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.3s ease'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" sx={{ color: '#9acd32', fontFamily: 'monospace' }}>
          devtaco@portfolio:~$ navigation
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#666666', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            ⌘M to close
          </Typography>
          <IconButton 
            onClick={closeTerminal}
            sx={{ color: '#9acd32', p: 0 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box>
          <Typography variant="body2" sx={{ color: '#9acd32', mb: 1, fontFamily: 'monospace' }}>
            Navigation:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#cccccc', 
                fontFamily: 'monospace',
                cursor: 'pointer',
                '&:hover': { color: '#9acd32' }
              }}
              onClick={() => handleNavigationClick('home')}
            >
              1 → home
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#cccccc', 
                fontFamily: 'monospace',
                cursor: 'pointer',
                '&:hover': { color: '#9acd32' }
              }}
              onClick={() => handleNavigationClick('about')}
            >
              2 → about
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#cccccc', 
                fontFamily: 'monospace',
                cursor: 'pointer',
                '&:hover': { color: '#9acd32' }
              }}
              onClick={() => handleNavigationClick('posts')}
            >
              3 → posts
            </Typography>

          </Box>
        </Box>
        
        <Box>
          <Typography variant="body2" sx={{ color: '#9acd32', mb: 1, fontFamily: 'monospace' }}>
            External:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#cccccc', 
                fontFamily: 'monospace',
                cursor: 'pointer',
                '&:hover': { color: '#9acd32' }
              }}
              onClick={() => handleNavigationClick('github')}
            >
              g → github
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#cccccc', 
                fontFamily: 'monospace',
                cursor: 'pointer',
                '&:hover': { color: '#9acd32' }
              }}
              onClick={() => handleNavigationClick('email')}
            >
              e → email
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#cccccc', 
                fontFamily: 'monospace',
                cursor: 'pointer',
                '&:hover': { color: '#9acd32' }
              }}
              onClick={() => handleNavigationClick('linkedin')}
            >
              l → linkedin
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Typography variant="body2" sx={{ color: '#9acd32', fontFamily: 'monospace', mt: 2, fontSize: '0.9rem', fontWeight: 'bold' }}>
        Press number keys (1,2,3) or letter keys (g,e,l) to navigate. Use {navigator.platform.includes('Mac') ? '⌘+M' : 'Ctrl+M'} to close.
      </Typography>
    </Box>
  );
};

export default TerminalNavigation;

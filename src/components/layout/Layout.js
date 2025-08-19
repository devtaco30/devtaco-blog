import React from 'react';
import { Container, Grid, Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TerminalNavigation from './TerminalNavigation';
import { useTerminalNavigation } from '../../hooks/useTerminalNavigation';

const Layout = ({ children }) => {
  const { terminalOpen, toggleTerminal, closeTerminal, handleNavigationClick } = useTerminalNavigation();

  return (
    <div className="App">
      {/* Top Header Icons */}
      <Box sx={{
        position: 'fixed',
        top: 20,
        left: 20,
        right: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton 
            onClick={toggleTerminal}
            sx={{
              color: '#000000',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.2)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.2,
            animation: 'bounce 1.5s infinite',
            '@keyframes bounce': {
              '0%, 50%, 100%': {
                transform: 'translateY(0)'
              },
              '25%, 75%': {
                transform: 'translateY(-6px)'
              }
            }
          }}>
            <ArrowBackIcon sx={{ 
              fontSize: '2rem', 
              color: 'rgba(0, 0, 0, 0.6)',
              alignSelf: 'center'
            }} />
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontSize: '1rem',
              color: '#666666',
              fontFamily: '"Courier New", "Consolas", "Monaco", "Menlo", monospace',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <span>{navigator.platform.includes('Mac') ? '⌘+M' : 'Ctrl+M'}</span>
            </Box>
          </Box>
        </Box>
        
        <IconButton 
          sx={{
            color: '#000000',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          <SearchIcon />
        </IconButton>
      </Box>

      <Container 
        maxWidth="xl"
        sx={{
          px: { xs: 1, sm: 2, md: 4 },
        }}
      >
        <Grid 
          container 
          spacing={{ xs: 2, md: 3 }}
          sx={{
            maxWidth: '1800px',
            margin: '0 auto',
            justifyContent: 'center'
          }}
        >
          {/* 메인 컨텐츠 영역 */}
          <Grid item xs={12} md={12}>
            {children}
          </Grid>
        </Grid>
      </Container>

      <footer style={{
        textAlign: 'center',
        padding: '2rem 0',
        color: '#000000',
        fontSize: '0.9rem',
        borderTop: '1px solid #000000',
        marginTop: 'auto',
        backgroundColor: '#ffffff'
      }}>
        <p>© 2025 DevTaco Blog. All rights reserved.</p>
      </footer>

      {/* Terminal Navigation */}
      <TerminalNavigation 
        terminalOpen={terminalOpen}
        closeTerminal={closeTerminal}
        handleNavigationClick={handleNavigationClick}
      />
    </div>
  );
};

export default Layout; 
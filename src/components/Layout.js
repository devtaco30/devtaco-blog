import { AppBar, Toolbar, Typography, Grid, Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';

function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const hasAds = false;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 모던한 AppBar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          color: 'text.primary'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            DevTaco
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton color="inherit">
              <DarkModeIcon />
            </IconButton>
            {isMobile && (
              <IconButton color="inherit">
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* 메인 컨텐츠 */}
      <Box sx={{ 
        flexGrow: 1, 
        p: { xs: 2, md: 4 },
        maxWidth: '1440px',
        margin: '0 auto'
      }}>
        <Grid container spacing={3}>
          {/* 프로필 섹션 */}
          <Grid item xs={12} md={hasAds ? 3 : 4}>
            <Box sx={{
              position: 'sticky',
              top: 88,
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <Profile />
            </Box>
          </Grid>

          {/* 메인 컨텐츠 영역 */}
          <Grid item xs={12} md={hasAds ? 6 : 8}>
            <Box sx={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(0, 0, 0, 0.05)',
              p: 3
            }}>
              <Main />
            </Box>
          </Grid>

          {/* 광고 섹션 */}
          {hasAds === true && (
            <Grid item xs={12} md={3}>
              <Box sx={{
                position: 'sticky',
                top: 88,
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(0, 0, 0, 0.05)',
                p: 3
              }}>
                <Ads />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

export default Layout; 
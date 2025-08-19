import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Chip, 
  Grid,
  Link,
  Skeleton,
  Avatar,
  Stack
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getAllPosts } from '../../utils/markdown';
import ArticleIcon from '@mui/icons-material/Article';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TagIcon from '@mui/icons-material/Tag';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('게시글 불러오기 시작...');
        const allPosts = await getAllPosts();
        console.log('불러온 게시글들:', allPosts);
        setPosts(allPosts);
      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 3, md: 4 } }}>
          <Skeleton variant="circular" width={32} height={32} sx={{ mr: 2 }} />
          <Skeleton variant="text" width={200} height={40} />
        </Box>
        
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={6} key={item}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="80%" height={24} sx={{ mb: 0.5 }} />
                      <Skeleton variant="text" width="60%" height={16} />
                    </Box>
                  </Box>
                  
                  <Skeleton variant="text" width="100%" height={16} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="90%" height={16} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="70%" height={16} sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Skeleton variant="rectangular" width={50} height={20} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={40} height={20} sx={{ borderRadius: 1 }} />
                  </Box>
                </CardContent>
                
                <Box sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
                  <Skeleton variant="text" width={80} height={20} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 3, md: 4 } }}>
        <ArticleIcon sx={{ fontSize: { xs: 24, md: 32 }, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
          게시글 목록
        </Typography>
      </Box>
      
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={6} key={post.slug}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  borderColor: 'primary.main'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: { xs: 32, md: 40 }, 
                      height: { xs: 32, md: 40 }, 
                      bgcolor: 'primary.main',
                      mr: 2
                    }}
                  >
                    <ArticleIcon />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold', 
                        lineHeight: 1.2,
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        wordBreak: 'keep-all'
                      }}
                    >
                      {post.frontmatter.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                      >
                        {new Date(post.frontmatter.date).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 3,
                    color: 'text.secondary',
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {post.frontmatter.excerpt}
                </Typography>
                
                {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TagIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        태그
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {post.frontmatter.tags.map((tag) => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.7rem',
                            height: 20
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
              
              <CardActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
                <Link 
                  component={RouterLink} 
                  to={`/posts/${post.slug}`}
                  sx={{ 
                    textDecoration: 'none',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'primary.dark'
                    }
                  }}
                >
                  자세히 보기 →
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {posts.length === 0 && (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          아직 게시글이 없습니다.
        </Typography>
      )}
    </Box>
  );
};

export default BlogList;

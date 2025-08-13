import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { 
  Box, 
  Typography, 
  Chip, 
  Link,
  Skeleton,
  Breadcrumbs,
  Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getPostBySlug } from '../utils/markdown';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostBySlug(slug);
        setPost(postData);
      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Breadcrumbs Skeleton */}
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width="60%" height={24} />
        </Box>

        {/* Header Skeleton */}
        <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
          <Skeleton variant="text" width="80%" height={48} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="90%" height={24} sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton variant="rectangular" width={60} height={32} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" width={70} height={32} sx={{ borderRadius: 2 }} />
          </Box>
        </Paper>

        {/* Content Skeleton */}
        <Paper elevation={1} sx={{ p: 4 }}>
          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="95%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="85%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="95%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 2 }} />
        </Paper>

        {/* Back Button Skeleton */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Skeleton variant="text" width={200} height={24} />
        </Box>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          게시글을 찾을 수 없습니다
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          요청하신 게시글이 존재하지 않거나 삭제되었습니다.
        </Typography>
        <Link 
          component={RouterLink} 
          to="/posts"
          sx={{ 
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 'bold'
          }}
        >
          ← 게시글 목록으로 돌아가기
        </Link>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link 
          component={RouterLink} 
          to="/"
          sx={{ 
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          홈
        </Link>
        <Link 
          component={RouterLink} 
          to="/posts"
          sx={{ 
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          게시글
        </Link>
        <Typography color="text.primary">{post.frontmatter.title}</Typography>
      </Breadcrumbs>

      {/* 게시글 헤더 */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          {post.frontmatter.title}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 2 }}
        >
          📅 {new Date(post.frontmatter.date).toLocaleDateString('ko-KR')}
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
          {post.frontmatter.excerpt}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {post.frontmatter.tags?.map((tag) => (
            <Chip 
              key={tag} 
              label={tag} 
              color="primary" 
              variant="outlined"
            />
          ))}
        </Box>
      </Paper>

      {/* 게시글 내용 */}
      <Paper elevation={1} sx={{ p: 4 }}>
        <Box 
          sx={{ 
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              fontWeight: 'bold',
              mt: 4,
              mb: 2
            },
            '& h1': { fontSize: '2rem' },
            '& h2': { fontSize: '1.75rem' },
            '& h3': { fontSize: '1.5rem' },
            '& p': { 
              mb: 2, 
              lineHeight: 1.8,
              fontSize: '1.1rem'
            },
            '& ul, & ol': { 
              mb: 2, 
              pl: 3 
            },
            '& li': { 
              mb: 1,
              lineHeight: 1.6
            },
            '& code': {
              backgroundColor: 'grey.100',
              padding: '2px 6px',
              borderRadius: 1,
              fontFamily: 'monospace'
            },
            '& pre': {
              backgroundColor: 'grey.100',
              padding: 2,
              borderRadius: 1,
              overflow: 'auto',
              mb: 3
            },
            '& pre code': {
              backgroundColor: 'transparent',
              padding: 0
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 2,
              ml: 0,
              fontStyle: 'italic',
              color: 'text.secondary'
            }
          }}
        >
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </Box>
      </Paper>

      {/* 뒤로가기 버튼 */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Link 
          component={RouterLink} 
          to="/posts"
          sx={{ 
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          <ArrowBackIcon />
          게시글 목록으로 돌아가기
        </Link>
      </Box>
    </Box>
  );
};

export default BlogPost;

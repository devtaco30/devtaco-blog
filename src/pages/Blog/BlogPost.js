import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
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
import { getPostById, incrementViewCount } from '../../services/posts';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewCountIncremented, setViewCountIncremented] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await getPostById(id);
        if (error) throw error;
        setPost(data);
        

      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // 조회수 증가를 별도의 useEffect로 분리
  useEffect(() => {
    if (post && !loading && !viewCountIncremented) {
      const viewKey = `viewed_${id}`;
      console.log('조회수 증가 체크:', { viewKey, alreadyViewed: sessionStorage.getItem(viewKey) });
      
      if (!sessionStorage.getItem(viewKey)) {
        console.log('조회수 증가 시작');
        setViewCountIncremented(true); // 즉시 상태 변경
        
        incrementViewCount(id).then(({ data: updatedPost, error }) => {
          if (!error && updatedPost) {
            console.log('조회수 증가 성공:', updatedPost.view_count);
            setPost(updatedPost);
            sessionStorage.setItem(viewKey, 'true');
            console.log('세션 스토리지에 조회 기록 저장됨');
          }
        }).catch((viewCountError) => {
          console.error('조회수 증가 실패:', viewCountError);
          setViewCountIncremented(false); // 에러 시 상태 복구
        });
      } else {
        console.log('이미 조회한 게시글입니다');
        setViewCountIncremented(true);
      }
    }
  }, [post, id, loading, viewCountIncremented]);

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
            color: '#000000',
            fontWeight: 'bold'
          }}
        >
          ← 게시글 목록으로 돌아가기
        </Link>
      </Box>
    );
  }

  // 날짜 포맷팅
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    // bigint 타입의 epoch milliseconds를 처리
    let date;
    if (typeof timestamp === 'bigint' || typeof timestamp === 'number') {
      date = new Date(Number(timestamp));
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link 
          component={RouterLink} 
          to="/posts"
          sx={{ 
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          게시글 목록
        </Link>
        <Typography color="text.primary">{post.title}</Typography>
      </Breadcrumbs>

      {/* 게시글 헤더 */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
          {post.title}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
          {Array.isArray(post.excerpt) && post.excerpt.length > 0 
            ? post.excerpt.filter(item => item.trim()).join(' | ')
            : ''
          }
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {post.tags && Array.isArray(post.tags) && post.tags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" variant="outlined" />
          ))}
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {formatDate(post.published_at)} | 조회수: {post.view_count || 0}
        </Typography>
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
              borderColor: '#000000',
              pl: 2,
              ml: 0,
              fontStyle: 'italic',
              color: 'rgba(0, 0, 0, 0.6)'
            },
            '& table': {
              borderCollapse: 'collapse',
              width: '100%',
              mb: 4,
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              fontSize: '0.95rem',
              fontFamily: 'inherit'
            },
            '& th, & td': {
              border: 'none',
              padding: '16px 20px',
              textAlign: 'left',
              verticalAlign: 'middle'
            },
            '& th': {
              backgroundColor: '#2c3e50',
              color: '#e74c3c'
            }
          }}
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({node, ...props}) => {
                // custom-size 클래스가 있는 이미지는 원래 크기 유지
                if (props.className && props.className.includes('custom-size')) {
                  return (
                    <img 
                      {...props} 
                      src={props.src}
                      alt={props.alt || 'Blog post image'}
                    />
                  );
                }
                // 마크다운 이미지와 일반 이미지는 모두 60%로 줄이기
                return (
                  <img 
                    {...props} 
                    src={props.src}
                    alt={props.alt || 'Blog post image'}
                    style={{ 
                      maxWidth: '60%', 
                      height: 'auto',
                      display: 'block',
                      margin: '20px auto'
                    }}
                  />
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </Box>
      </Paper>

      {/* 뒤로가기 버튼 */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Link 
          component={RouterLink} 
          to="/posts"
          sx={{ 
            textDecoration: 'none',
            color: '#000000',
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

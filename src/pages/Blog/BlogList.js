import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Skeleton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllPosts } from '../../utils/markdown';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <Box sx={{ maxWidth: 960, mx: 'auto', p: 3 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" width="100%" height={2} sx={{ mb: 4 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3].map((item) => (
            <Box key={item}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Skeleton variant="text" width="70%" height={24} />
                <Skeleton variant="text" width={100} height={20} />
              </Box>
              <Skeleton variant="text" width="90%" height={20} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

    return (
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#000000' }}>
        Posts
      </Typography>
      <Box sx={{ height: 2, backgroundColor: '#000000', mb: 4 }} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {posts.map((post, index) => (
          <React.Fragment key={post.slug}>
            <Box 
              sx={{ 
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/posts/${post.slug}`)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '1.3rem',
                    color: '#000000',
                    flex: 1,
                    mr: 3,
                    textDecoration: 'underline',
                    textUnderlineOffset: '0.2em'
                  }}
                >
                  {post.frontmatter.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="rgba(0, 0, 0, 0.6)"
                  sx={{ 
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {new Date(post.frontmatter.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </Typography>
              </Box>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.8)',
                  lineHeight: 1.6,
                  fontSize: '1rem'
                }}
              >
                {post.frontmatter.excerpt}
              </Typography>
            </Box>
            {index < posts.length - 1 && (
              <Box sx={{ height: 1.5, width: '97%', alignSelf: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)', my: 1 }} />
            )}
          </React.Fragment>
        ))}
      </Box>
      
      {posts.length === 0 && (
        <Typography variant="h6" color="rgba(0, 0, 0, 0.6)" sx={{ textAlign: 'center', mt: 4 }}>
          아직 게시글이 없습니다.
        </Typography>
      )}
    </Box>
  );
};

export default BlogList;

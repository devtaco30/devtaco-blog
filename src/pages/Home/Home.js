import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  IconButton,
  Stack,
  Divider
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { getAllPosts } from '../../services/posts';


const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // featuredPosts state 변화 추적
  useEffect(() => {
    console.log('🔄 featuredPosts state 변경됨:', featuredPosts);
  }, [featuredPosts]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('🔄 Home에서 포스트 가져오기 시작');
        const allPosts = await getAllPosts();
        console.log('📝 가져온 포스트들:', allPosts);
        
        // Supabase 응답 구조에 맞게 수정
        const posts = allPosts.data || [];
        console.log('📊 실제 포스트 배열:', posts);
        console.log('📊 첫 번째 포스트 구조:', posts[0]);
        
        const featured = posts.slice(0, 3);
        console.log('⭐ 최근 포스트 3개:', featured);
        
        console.log('🎯 featuredPosts state 업데이트 전:', featured);
        setFeaturedPosts(featured);
        console.log('✅ setFeaturedPosts 호출 완료');
      } catch (error) {
        console.error('❌ Featured Posts를 불러오는데 실패했습니다:', error);
      } finally {
        console.log('🔄 loading 상태를 false로 변경');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 4,
      position: 'relative',
      backgroundColor: '#ffffff'
    }}>
      {/* Main Content */}
      <Box sx={{ 
        textAlign: 'center',
        maxWidth: 800,
        width: '100%'
      }}>
        {/* Profile Image */}
        <Box
          sx={{
            width: 120,
            height: 120,
            mx: 'auto',
            mb: 3,
            borderRadius: '50%',
            border: '3px solid #000000',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            // src={`${process.env.PUBLIC_URL}/images/profile/profile_ver.fe.3.png`}
            // src={`${process.env.PUBLIC_URL}/images/profile/profile_ver.fe.2.png`}
            src={`${process.env.PUBLIC_URL}/images/profile/profile.png`}
            alt="DevTaco Profile"
            style={{
              width: '180%',
              height: '180%',
              objectFit: 'cover',
              transform: 'translate(-1%, 23%)'
            }}
          />
        </Box>

        {/* Name and Title */}
        <Typography variant="h2" sx={{ 
          fontWeight: 'bold', 
          mb: 2,
          color: '#000000'
        }}>
          I am DevTaco
        </Typography>



        {/* Social Links */}
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mb: 4 }}>
          <IconButton 
            href="https://github.com/devtaco30" 
            target="_blank"
            sx={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              color: '#000000',
              border: '1px solid #000000',
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s'
            }}
          >
            <GitHubIcon />
          </IconButton>
          <IconButton 
            href="mailto:devtaco@naver.com"
            sx={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              color: '#000000',
              border: '1px solid #000000',
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s'
            }}
          >
            <EmailIcon />
          </IconButton>
          <IconButton 
            href="https://www.linkedin.com/in/jonghyuk-park-02b1a1203" 
            target="_blank"
            sx={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              color: '#000000',
              border: '1px solid #000000',
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s'
            }}
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>

        {/* Description */}
        <Box sx={{ 
          textAlign: 'center',
          mt: 4
        }}>
          <Typography
            variant="h5"
            sx={{
              color: '#000000',
              fontWeight: 'normal',
              lineHeight: 1.4
            }}
          >
            Backend Developer <br />
            Java & Kotlin Specialist
          </Typography>
        </Box>

        <Divider sx={{ my: 4, backgroundColor: '#000000' }} />

        {/* Recent Posts */}
        <Typography variant="h6" sx={{ 
          fontWeight: 'bold', 
          mb: 3,
          textAlign: 'left',
          color: '#000000'
        }}>
          Recent posts:
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: 'left' }}>
            {[1, 2, 3].map((item) => (
              <Typography key={item} variant="body1" sx={{ mb: 1, color: '#000000' }}>
                Loading...
              </Typography>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'left' }}>
            {featuredPosts.map((post, index) => (
              <Box key={post.slug}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 1, 
                    color: '#000000',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  {post.title}
                </Typography>
                {index < featuredPosts.length - 1 && (
                  <Divider sx={{ my: 1, backgroundColor: '#000000' }} />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;

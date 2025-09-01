import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Skeleton,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Modal,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { getAllPosts } from '../../services/posts';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await getAllPosts();
        if (error) throw error;
        
        // 발행된 포스트만 필터링
        const publishedPosts = data.filter(post => post.is_published);
        
        setPosts(publishedPosts);
        setFilteredPosts(publishedPosts);
        
        // 모든 태그 수집
        const tags = new Set();
        publishedPosts.forEach(post => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => tags.add(tag));
          }
        });
        setAllTags(Array.from(tags).sort());
      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 태그 필터링 + 검색어 필터링 조합
  useEffect(() => {
    // 검색어로 게시글 필터링
    let filtered = posts.filter(post => {
      if (!searchKeyword.trim()) return true;
      
      const searchLower = searchKeyword.toLowerCase();
      const excerpt = Array.isArray(post.excerpt) ? post.excerpt.join(' ') : post.excerpt || '';
      
      return (
        post.title.toLowerCase().includes(searchLower) ||
        excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower)
      );
    });
    
    // 태그 필터링
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => 
        post.tags && Array.isArray(post.tags) &&
        selectedTags.some(tag => post.tags.includes(tag))
      );
    }
    
    setFilteredPosts(filtered);
  }, [selectedTags, searchKeyword, posts]);

  // 검색어로 필터링된 태그들
  const filteredTags = allTags.filter(tag => 
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTagClick = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setIsSearchModalOpen(false);
  };

  const handleSearchModalOpen = () => {
    setIsSearchModalOpen(true);
  };

  const handleSearchModalClose = () => {
    setIsSearchModalOpen(false);
  };

  const handlePostClick = (post) => {
    navigate(`/posts/${post.id}`);
  };

  // 날짜 포맷팅
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    console.log('formatDate 호출됨:', { timestamp, type: typeof timestamp });
    
    // bigint 타입의 epoch milliseconds를 처리
    let date;
    if (typeof timestamp === 'bigint' || typeof timestamp === 'number') {
      date = new Date(Number(timestamp));
    } else {
      date = new Date(timestamp);
    }
    
    console.log('변환된 날짜:', date);
    
    const result = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    console.log('최종 결과:', result);
    return result;
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          게시글 목록
        </Typography>
        <Box sx={{ display: 'grid', gap: 3 }}>
          {[1, 2, 3].map((item) => (
            <Paper key={item} elevation={1} sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        게시글 목록 ({filteredPosts.length}개)
      </Typography>

      {/* 검색 및 필터 */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="게시글 검색..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <IconButton 
          onClick={handleSearchModalOpen}
          sx={{ 
            border: '1px solid #ddd',
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
        >
          <SearchIcon />
        </IconButton>

        {selectedTags.length > 0 && (
          <Chip 
            label={`선택된 태그: ${selectedTags.length}개`}
            onDelete={() => setSelectedTags([])}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      {/* 게시글 목록 */}
      <Box sx={{ display: 'grid', gap: 3 }}>
        {filteredPosts.map((post) => (
          <Paper 
            key={post.id} 
            elevation={1} 
            sx={{ 
              p: 3, 
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                elevation: 3,
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }
            }}
            onClick={() => handlePostClick(post)}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              {post.title}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
              {Array.isArray(post.excerpt) && post.excerpt.length > 0 
                ? post.excerpt.filter(item => item.trim()).join(' | ')
                : post.content.substring(0, 150) + '...'
              }
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {post.tags && Array.isArray(post.tags) && post.tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  size="small" 
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTagClick(tag);
                  }}
                />
              ))}
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              {formatDate(post.published_at)} | 조회수: {post.view_count || 0}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* 검색 모달 */}
      <Modal
        open={isSearchModalOpen}
        onClose={handleSearchModalClose}
        aria-labelledby="search-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            태그 검색
          </Typography>
          
          <TextField
            fullWidth
            placeholder="태그 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {filteredTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagClick(tag)}
                color={selectedTags.includes(tag) ? 'primary' : 'default'}
                variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default BlogList;

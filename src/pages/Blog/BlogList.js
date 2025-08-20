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
import { getAllPosts } from '../../utils/markdown';

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
        const allPosts = await getAllPosts();
        setPosts(allPosts);
        setFilteredPosts(allPosts);
        
        // 모든 태그 수집
        const tags = new Set();
        allPosts.forEach(post => {
          if (post.frontmatter.tags) {
            post.frontmatter.tags.forEach(tag => tags.add(tag));
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
      return (
        post.frontmatter.title.toLowerCase().includes(searchLower) ||
        post.frontmatter.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower)
      );
    });
    
    // 태그 필터링
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => 
        post.frontmatter.tags && 
        selectedTags.some(tag => post.frontmatter.tags.includes(tag))
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

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchKeyword(searchTerm);
      setIsSearchModalOpen(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

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
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 3, pt: { xs: 7, md: 8 } }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#000000' }}>
            Posts
          </Typography>
          <Box sx={{ height: 2, backgroundColor: '#000000', mt: 1 }} />
        </Box>
        
        {/* 검색 버튼 */}
        <IconButton
          onClick={handleSearchModalOpen}
          sx={{
            color: '#000000',
            border: '1px solid #000000',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          <SearchIcon />
        </IconButton>
      </Box>
      
      {/* 선택된 태그 및 검색어 표시 */}
      {(selectedTags.length > 0 || searchKeyword) && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, color: 'rgba(0, 0, 0, 0.6)' }}>
            Filtered by: {[
              ...(searchKeyword ? [`"${searchKeyword}"`] : []),
              ...selectedTags
            ].join(', ')}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {searchKeyword && (
              <Chip
                label={`"${searchKeyword}"`}
                onDelete={() => setSearchKeyword('')}
                sx={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  '& .MuiChip-deleteIcon': {
                    color: '#ffffff'
                  }
                }}
              />
            )}
            {selectedTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleTagClick(tag)}
                sx={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  '& .MuiChip-deleteIcon': {
                    color: '#ffffff'
                  }
                }}
              />
            ))}
          </Stack>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredPosts.map((post, index) => (
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
      
      {filteredPosts.length === 0 && (
        <Typography variant="h6" color="rgba(0, 0, 0, 0.6)" sx={{ textAlign: 'center', mt: 4 }}>
          {selectedTags.length > 0 || searchKeyword 
            ? `No posts found with "${searchKeyword}" and selected tags.` 
            : '아직 게시글이 없습니다.'
          }
        </Typography>
      )}

      {/* 검색 모달 */}
      <Modal
        open={isSearchModalOpen}
        onClose={handleSearchModalClose}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          pt: 10
        }}
      >
        <Paper
          sx={{
            width: 400,
            maxHeight: 500,
            p: 3,
            outline: 'none',
            position: 'relative'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Search & Filter
          </Typography>
          
          {/* 검색창 */}
          <TextField
            fullWidth
            placeholder="Search tags or press Enter to search posts..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            onKeyPress={handleSearchKeyPress}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* 태그 목록 */}
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {filteredTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => handleTagClick(tag)}
                  sx={{
                    backgroundColor: selectedTags.includes(tag) ? '#000000' : '#ffffff',
                    color: selectedTags.includes(tag) ? '#ffffff' : '#000000',
                    border: '1px solid #000000',
                    cursor: 'pointer',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: selectedTags.includes(tag) ? '#333333' : '#f5f5f5'
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default BlogList;

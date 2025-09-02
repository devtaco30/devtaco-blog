import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Paper,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { getPostsWithPagination, searchPostsWithPagination } from '../../services/posts';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastCreatedAt, setLastCreatedAt] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchLastCreatedAt, setSearchLastCreatedAt] = useState(null);

  
  const navigate = useNavigate();
  const observerRef = useRef();

  // 추가 게시글 로드
  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      
      if (isSearchMode) {
        // 검색 모드: 검색 결과 추가 로드
        const { data, error } = await searchPostsWithPagination(
          searchKeyword, 
          selectedTags, 
          searchLastCreatedAt
        );
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setFilteredPosts(prev => [...prev, ...data]);
          setSearchLastCreatedAt(data[data.length - 1].created_at);
          setHasMore(data.length === 2); // 검색 모드에서도 hasMore 업데이트
        } else {
          setHasMore(false);
        }
      } else {
        // 일반 모드: 전체 게시글 추가 로드
        const { data, error } = await getPostsWithPagination(lastCreatedAt);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setPosts(prev => [...prev, ...data]);
          setFilteredPosts(prev => [...prev, ...data]);
          setLastCreatedAt(data[data.length - 1].created_at);
          setHasMore(data.length === 2);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('추가 게시글을 불러오는데 실패했습니다:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, isSearchMode, searchKeyword, selectedTags, searchLastCreatedAt, lastCreatedAt]);

  // 무한 스크롤 옵저버 설정
  const lastElementRef = useCallback((node) => {
    if (loading) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        loadMorePosts();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, loadingMore, loadMorePosts]);

  // 초기 게시글 로드
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await getPostsWithPagination();
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setPosts(data);
          setFilteredPosts(data);
          setLastCreatedAt(data[data.length - 1].created_at);
          setHasMore(data.length === 5);
          setIsSearchMode(false);
          
          // 모든 태그 수집
          const tags = new Set();
          data.forEach(post => {
            if (post.tags && Array.isArray(post.tags)) {
              post.tags.forEach(tag => tags.add(tag));
            }
          });
          setAllTags(Array.from(tags).sort());
        }
      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPosts();
  }, []); // 의존성 배열 비움

  // 검색 실행
  const executeSearch = useCallback(async () => {
    if (!searchKeyword.trim() && selectedTags.length === 0) {
      // 검색 조건이 없으면 일반 모드로 전환
      setIsSearchMode(false);
      setFilteredPosts(posts);
      setSearchLastCreatedAt(null);
      setHasMore(true);
      return;
    }

    try {
      setLoading(true);
      setIsSearchMode(true);
      
      const { data, error } = await searchPostsWithPagination(searchKeyword, selectedTags);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setFilteredPosts(data);
        setSearchLastCreatedAt(data[data.length - 1].created_at);
        setHasMore(data.length === 2);
      } else {
        setFilteredPosts([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('검색에 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  }, [searchKeyword, selectedTags, posts]);

  // 검색어나 태그 변경 시 검색 실행
  useEffect(() => {
    const timer = setTimeout(() => {
      executeSearch();
    }, 300); // 300ms 디바운스

    return () => clearTimeout(timer);
  }, [searchKeyword, selectedTags, executeSearch]);



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
    
    // epoch milliseconds를 처리 (1724112000000 형태)
    let date;
    if (typeof timestamp === 'bigint' || typeof timestamp === 'number') {
      // epoch milliseconds를 Date 객체로 변환
      date = new Date(Number(timestamp));
    } else if (typeof timestamp === 'string') {
      // ISO 문자열 형태인 경우
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }
    
    // 한국 시간대로 변환하여 표시
    const result = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
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
          
          {/* 로딩 상태 */}
          {loadingMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          )}
          
          {/* 더 이상 로드할 게시글이 없음 */}
          {!hasMore && !loadingMore && filteredPosts.length > 0 && (
            <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
              <Typography variant="body2">
                모든 게시글을 불러왔습니다.
              </Typography>
            </Box>
          )}
          
          {/* 검색 결과가 없음 */}
          {!loading && filteredPosts.length === 0 && isSearchMode && (
            <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
              <Typography variant="body2">
                검색 결과가 없습니다.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        우아하고 싶은 포스트
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
        {(filteredPosts.length > 0 ? filteredPosts : posts).map((post, index) => (
          <Paper 
            key={post.id} 
            elevation={1} 
            ref={index === (filteredPosts.length > 0 ? filteredPosts : posts).length - 1 ? lastElementRef : null}
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
                              {formatDate(post.published_at)}
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

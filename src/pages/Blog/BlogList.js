import React, { useState, useEffect, useCallback } from 'react';
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
  Pagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getPostsWithPageNumber, searchPostsWithPageNumber } from '../../services/posts';
import { getAllCategories, getPostCountsByAllCategories } from '../../services/categories';

// UI용 "전체" 카테고리 (DB에는 존재하지 않음)
const ALL_CATEGORY = { 
  key: 'all', 
  name: '전체', 
  sort_order: 0, 
  is_active: true 
};

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [categories, setCategories] = useState([ALL_CATEGORY]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTotalCount, setSearchTotalCount] = useState(0);
  
  const POSTS_PER_PAGE = 10;
  const navigate = useNavigate();


  // 카테고리 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categoriesData, error: categoriesError } = await getAllCategories();
        
        if (categoriesError) {
          console.error('카테고리 조회 에러:', categoriesError);
          throw categoriesError;
        }
        
        // "전체" 카테고리를 맨 앞에 추가 (UI용 가상 카테고리)
        // categoriesData가 null이거나 undefined인 경우 빈 배열로 처리
        const categoriesWithAll = [
          ALL_CATEGORY,
          ...(categoriesData || [])
        ];
        
        setCategories(categoriesWithAll);
        
        // 카테고리별 포스트 개수 조회
        const { data: countsData, error: countsError } = await getPostCountsByAllCategories();
        if (!countsError && countsData) {
          setCategoryCounts(countsData);
        }
      } catch (error) {
        console.error('카테고리를 불러오는데 실패했습니다:', error);
        // 에러가 발생해도 최소한 "전체" 카테고리는 표시
        setCategories([ALL_CATEGORY]);
      }
    };

    fetchCategories();
  }, []);

  // 게시글 로드 (일반 모드)
  useEffect(() => {
    let isCancelled = false;
    
    const fetchPosts = async () => {
      // 검색 모드가 아닐 때만 실행
      if (isSearchMode) return;
      
      // 깜빡임 방지: 로딩 상태를 표시하지 않고 데이터만 로드
      // 이전 데이터는 유지하면서 새 데이터를 준비
      try {
        const { data, count, error } = await getPostsWithPageNumber(currentPage, POSTS_PER_PAGE, selectedCategoryKey);
        
        // 카테고리나 페이지가 다시 변경되었으면 취소
        if (isCancelled) return;
        
        if (error) throw error;
        
        // 데이터가 준비되면 한 번에 상태 업데이트 (깜빡임 방지)
        if (data && data.length > 0) {
          // 모든 태그 수집
          const tags = new Set();
          data.forEach(post => {
            if (post.tags && Array.isArray(post.tags)) {
              post.tags.forEach(tag => tags.add(tag));
            }
          });
          
          // 모든 상태를 한 번에 업데이트 (이전 데이터를 유지하다가 한 번에 교체)
          setPosts(data);
          setTotalCount(count || 0);
          setAllTags(Array.from(tags).sort());
        } else {
          setPosts([]);
          setTotalCount(0);
          setAllTags([]);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('게시글을 불러오는데 실패했습니다:', error);
        }
      }
    };

    // 첫 로딩일 때만 로딩 상태 표시
    if (loading && posts.length === 0) {
      setLoading(true);
      fetchPosts().finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });
    } else {
      // 카테고리나 페이지 변경 시에는 로딩 상태 없이 데이터만 로드
      fetchPosts();
    }

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryKey, currentPage, isSearchMode]); // selectedCategoryKey나 currentPage가 변경될 때마다 다시 로드
    // loading과 posts.length는 의도적으로 dependency에서 제외 (첫 로딩 체크용, 추가 시 불필요한 재실행 발생)

  // 검색 실행
  const executeSearch = useCallback(async () => {
    if (!searchKeyword.trim() && selectedTags.length === 0) {
      // 검색 조건이 없으면 일반 모드로 전환
      setIsSearchMode(false);
      setCurrentPage(1);
      return;
    }

    try {
      // 검색 모드로 전환
      setIsSearchMode(true);
      setCurrentPage(1); // 검색 시 첫 페이지로 리셋
      
      const { data, count, error } = await searchPostsWithPageNumber(
        searchKeyword, 
        selectedTags, 
        1, 
        POSTS_PER_PAGE, 
        selectedCategoryKey
      );
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setPosts(data);
        setSearchTotalCount(count || 0);
        
        // 모든 태그 수집
        const tags = new Set();
        data.forEach(post => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => tags.add(tag));
          }
        });
        setAllTags(Array.from(tags).sort());
      } else {
        setPosts([]);
        setSearchTotalCount(0);
        setAllTags([]);
      }
    } catch (error) {
      console.error('검색에 실패했습니다:', error);
    }
  }, [searchKeyword, selectedTags, selectedCategoryKey]);

  // 검색어나 태그 변경 시 검색 실행
  useEffect(() => {
    const timer = setTimeout(() => {
      executeSearch();
    }, 300); // 300ms 디바운스

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, selectedTags]); // executeSearch를 dependency에서 제거하여 불필요한 재실행 방지

  // 검색 모드에서 페이지 변경 시 검색 결과 다시 로드
  useEffect(() => {
    if (!isSearchMode) return;
    
    let isCancelled = false;
    
    const fetchSearchResults = async () => {
      try {
        const { data, count, error } = await searchPostsWithPageNumber(
          searchKeyword, 
          selectedTags, 
          currentPage, 
          POSTS_PER_PAGE, 
          selectedCategoryKey
        );
        
        if (isCancelled) return;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setPosts(data);
          setSearchTotalCount(count || 0);
        } else {
          setPosts([]);
          setSearchTotalCount(0);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('검색 결과를 불러오는데 실패했습니다:', error);
        }
      }
    };

    fetchSearchResults();
    
    return () => {
      isCancelled = true;
    };
  }, [currentPage, isSearchMode, searchKeyword, selectedTags, selectedCategoryKey]);



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

  // 카테고리 선택 핸들러
  const handleCategoryClick = (categoryKey) => {
    setSelectedCategoryKey(categoryKey);
    setSearchKeyword('');
    setSelectedTags([]);
    setIsSearchMode(false);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 리셋
    // 데이터 로딩은 useEffect에서 처리 (깜빡임 방지)
  };

  // 페이지 변경 핸들러
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          
          {/* 검색 결과가 없음 */}
          {!loading && posts.length === 0 && isSearchMode && (
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
      <Typography variant="h4" sx={{ mb: 2 }}>
        우아하고 싶은 포스트
      </Typography>

      {/* 카테고리 필터 */}
      <Box 
        sx={{ 
          mb: 3, 
          pt: 2,
          pb: 2,
          borderTop: '1px solid #999999',
          borderBottom: '1px solid #999999',
          display: 'flex', 
          gap: 1, 
          flexWrap: 'wrap', 
          alignItems: 'center' 
        }}
      >
        {categories.map((category) => (
          <Chip
            key={category.key}
            label={`${category.name} (${categoryCounts[category.key] || 0})`}
            onClick={() => handleCategoryClick(category.key)}
            sx={{
              backgroundColor: selectedCategoryKey === category.key ? '#f0f7e0' : '#ffffff',
              color: selectedCategoryKey === category.key ? '#000000' : '#000000',
              border: '1px solid',
              borderColor: selectedCategoryKey === category.key ? '#000000' : '#000000',
              cursor: 'pointer',
              fontWeight: selectedCategoryKey === category.key ? 'bold' : 'normal',
              '&:hover': {
                backgroundColor: selectedCategoryKey === category.key ? '#f0f7e0' : '#f5f5f5',
                borderColor: '#000000'
              }
            }}
          />
        ))}
      </Box>

      {/* 검색 및 필터 */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="게시글 검색..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              executeSearch();
            }
          }}
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
        
        {/* 검색 실행 버튼 */}
        <IconButton 
          onClick={() => executeSearch()}
          sx={{ 
            border: '1px solid #ddd',
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
          title="검색"
        >
          <SearchIcon />
        </IconButton>
        
        {/* 태그 필터 모달 열기 버튼 */}
        <IconButton 
          onClick={handleSearchModalOpen}
          sx={{ 
            border: '1px solid #ddd',
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
          title="태그 필터"
        >
          <FilterListIcon />
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
        {posts.map((post) => (
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
                              {formatDate(post.published_at)}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* 페이지네이션 */}
      {!loading && posts.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <Pagination
            count={Math.ceil((isSearchMode ? searchTotalCount : totalCount) / POSTS_PER_PAGE)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

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

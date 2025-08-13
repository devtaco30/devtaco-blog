import matter from 'gray-matter';

// Markdown 파일들을 동적으로 가져오는 함수
export const getAllPosts = async () => {
  console.log('getAllPosts 함수 시작');
  const posts = [];
  
  try {
    // posts-list.json에서 게시글 목록 가져오기
    console.log('posts-list.json 가져오기 시작...');
    const listResponse = await fetch('/devtaco-blog/data/posts-list.json');
    if (!listResponse.ok) {
      throw new Error('posts-list.json을 가져올 수 없습니다');
    }
    
    const postFiles = await listResponse.json();
    console.log('게시글 목록:', postFiles.length, '개');

    // 각 게시글 파일 가져오기
    for (const { slug, filename } of postFiles) {
      console.log(`처리 중: ${slug}`);
      
      const response = await fetch(`/devtaco-blog/posts/${filename}`);
      if (!response.ok) {
        console.error(`${slug} 파일을 가져올 수 없습니다:`, response.status);
        continue;
      }
      
      const markdownContent = await response.text();
      console.log(`${slug} 원본 내용 길이:`, markdownContent.length);
      console.log(`${slug} 원본 내용 (처음 200자):`, markdownContent.substring(0, 200));
      
      const { data, content } = matter(markdownContent);
      console.log(`${slug} frontmatter:`, data);
      console.log(`${slug} content 길이:`, content.length);
      
      posts.push({
        slug,
        frontmatter: data,
        content
      });
    }

    console.log('최종 posts 배열:', posts);
    // 날짜순으로 정렬 (최신순)
    return posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
  } catch (error) {
    console.error('getAllPosts 에러:', error);
    throw error;
  }
};

// 특정 게시글 가져오기
export const getPostBySlug = async (slug) => {
  try {
    console.log(`getPostBySlug: ${slug} 가져오기 시작`);
    
    // posts-list.json에서 해당 slug의 파일명 찾기
    const listResponse = await fetch('/devtaco-blog/data/posts-list.json');
    if (!listResponse.ok) {
      throw new Error('posts-list.json을 가져올 수 없습니다');
    }
    
    const postFiles = await listResponse.json();
    const postInfo = postFiles.find(post => post.slug === slug);
    
    if (!postInfo) {
      console.error(`Slug를 찾을 수 없습니다: ${slug}`);
      return null;
    }
    
    const response = await fetch(`/devtaco-blog/posts/${postInfo.filename}`);
    if (!response.ok) {
      console.error(`${slug} 파일을 가져올 수 없습니다:`, response.status);
      return null;
    }
    
    const markdownContent = await response.text();
    console.log(`${slug} 원본 내용 길이:`, markdownContent.length);
    
    const { data, content } = matter(markdownContent);
    console.log(`${slug} frontmatter:`, data);
    
    return {
      slug,
      frontmatter: data,
      content
    };
  } catch (error) {
    console.error(`Post not found: ${slug}`, error);
    return null;
  }
};

// 태그별 게시글 필터링
export const getPostsByTag = async (tag) => {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => 
    post.frontmatter.tags && post.frontmatter.tags.includes(tag)
  );
};

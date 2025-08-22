const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 디렉토리 경로
const postsDir = path.join(__dirname, '../public/posts');
const outputFile = path.join(__dirname, '../public/data/posts-list.json');
const sitemapFile = path.join(__dirname, '../public/sitemap.xml');

// 현재 날짜
const currentDate = new Date().toISOString().split('T')[0];

try {
  // posts 디렉토리 확인
  if (!fs.existsSync(postsDir)) {
    console.error('posts 디렉토리가 존재하지 않습니다:', postsDir);
    process.exit(1);
  }

  // .md 파일들 읽기
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
  
  if (files.length === 0) {
    console.warn('posts 디렉토리에 .md 파일이 없습니다.');
  }

  // 포스트 정보 추출
  const postsList = [];
  const sitemapUrls = [];

  files.forEach(file => {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    
    const slug = file.replace('.md', '');
    const lastmod = data.date || currentDate;
    
    postsList.push({
      id: data.id,
      slug: slug,
      filename: file,
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      excerpt: data.excerpt
    });

    // sitemap용 URL 추가
    sitemapUrls.push({
      loc: `https://devtaco30.github.io/devtaco-blog/#/posts/${data.id}`,
      lastmod: lastmod,
      changefreq: 'monthly',
      priority: '0.7'
    });
  });

  // public/data 디렉토리 생성
  const dataDir = path.dirname(outputFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // posts-list.json 저장
  fs.writeFileSync(outputFile, JSON.stringify(postsList, null, 2));
  
  // sitemap.xml 생성
  const sitemapContent = generateSitemap(sitemapUrls);
  fs.writeFileSync(sitemapFile, sitemapContent);
  
  console.log(`✅ posts-list.json 생성 완료!`);
  console.log(`✅ sitemap.xml 생성 완료!`);
  console.log(`📁 위치: ${outputFile}`);
  console.log(`🗺️ sitemap: ${sitemapFile}`);
  console.log(`📝 게시글 개수: ${postsList.length}개`);
  console.log(`📋 게시글 목록:`);
  postsList.forEach(post => {
    console.log(`   - ${post.slug} (${post.filename}) - ${post.date}`);
  });

} catch (error) {
  console.error('❌ 스크립트 실행 중 오류 발생:', error);
  process.exit(1);
}

function generateSitemap(posts) {
  const baseUrls = [
    {
      loc: 'https://devtaco30.github.io/devtaco-blog/',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: 'https://devtaco30.github.io/devtaco-blog/#/about',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: 'https://devtaco30.github.io/devtaco-blog/#/posts',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9'
    }
  ];

  const allUrls = [...baseUrls, ...posts];
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  allUrls.forEach(url => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${url.loc}</loc>\n`;
    sitemap += `    <lastmod>${url.lastmod}</lastmod>\n`;
    sitemap += `    <changefreq>${url.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${url.priority}</priority>\n`;
    sitemap += `  </url>\n`;
  });
  
  sitemap += '</urlset>';
  
  return sitemap;
}

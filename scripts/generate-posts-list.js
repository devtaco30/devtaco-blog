const fs = require('fs');
const path = require('path');

// posts 디렉토리 경로
const postsDir = path.join(__dirname, '../public/posts');
const outputFile = path.join(__dirname, '../public/data/posts-list.json');

try {
  // posts 디렉토리가 존재하는지 확인
  if (!fs.existsSync(postsDir)) {
    console.error('posts 디렉토리가 존재하지 않습니다:', postsDir);
    process.exit(1);
  }

  // .md 파일들 읽기
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
  
  if (files.length === 0) {
    console.warn('posts 디렉토리에 .md 파일이 없습니다.');
  }

  // 파일 목록 생성
  const postsList = files.map(file => ({
    slug: file.replace('.md', ''),
    filename: file
  }));

  // public/data 디렉토리 생성 (없으면)
  const dataDir = path.dirname(outputFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // JSON 파일로 저장
  fs.writeFileSync(outputFile, JSON.stringify(postsList, null, 2));
  
  console.log(`✅ posts-list.json 생성 완료!`);
  console.log(`📁 위치: ${outputFile}`);
  console.log(`📝 게시글 개수: ${postsList.length}개`);
  console.log(`📋 게시글 목록:`);
  postsList.forEach(post => {
    console.log(`   - ${post.slug} (${post.filename})`);
  });

} catch (error) {
  console.error('❌ 스크립트 실행 중 오류 발생:', error);
  process.exit(1);
}

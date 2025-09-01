import { supabase } from '../supabase';

// 이미지 업로드
export const uploadImage = async (file, postId = null) => {
  try {
    // 파일명 생성 (중복 방지)
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}.${fileExt}`;
    
    // 경로 설정 (포스트별 폴더 구조)
    const filePath = postId ? `posts/${postId}/${fileName}` : `temp/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // 공개 URL 생성
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
      fileName: fileName
    };
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    throw error;
  }
};

// 이미지 삭제
export const deleteImage = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('blog-images')
      .remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('이미지 삭제 오류:', error);
    throw error;
  }
};

// 임시 이미지를 포스트 폴더로 이동
export const moveTempImageToPost = async (tempPath, postId) => {
  try {
    // 새 경로 생성
    const fileName = tempPath.split('/').pop();
    const newPath = `posts/${postId}/${fileName}`;
    
    // 파일 복사
    const { error: copyError } = await supabase.storage
      .from('blog-images')
      .copy(tempPath, newPath);
    
    if (copyError) throw copyError;
    
    // 원본 임시 파일 삭제
    await deleteImage(tempPath);
    
    // 새 공개 URL 반환
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(newPath);
    
    return {
      url: urlData.publicUrl,
      path: newPath
    };
  } catch (error) {
    console.error('이미지 이동 오류:', error);
    throw error;
  }
};

// 포스트의 모든 이미지 삭제
export const deletePostImages = async (postId) => {
  try {
    const { data: files, error } = await supabase.storage
      .from('blog-images')
      .list(`posts/${postId}`);
    
    if (error) throw error;
    
    if (files && files.length > 0) {
      const filePaths = files.map(file => `posts/${postId}/${file.name}`);
      await deleteImage(filePaths);
    }
    
    return true;
  } catch (error) {
    console.error('포스트 이미지 삭제 오류:', error);
    throw error;
  }
};

// 임시 이미지 정리 (24시간 이상 된 파일)
export const cleanupTempImages = async () => {
  try {
    const { data: files, error } = await supabase.storage
      .from('blog-images')
      .list('temp');
    
    if (error) throw error;
    
    if (files && files.length > 0) {
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000); // 24시간 전
      
      const oldFiles = files.filter(file => {
        const timestamp = parseInt(file.name.split('.')[0]);
        return timestamp < oneDayAgo;
      });
      
      if (oldFiles.length > 0) {
        const filePaths = oldFiles.map(file => `temp/${file.name}`);
        await deleteImage(filePaths);
        console.log(`${oldFiles.length}개의 임시 이미지 정리 완료`);
      }
    }
  } catch (error) {
    console.error('임시 이미지 정리 오류:', error);
  }
};

import { useState, useCallback } from 'react';
import { uploadImage, deleteImage, moveTempImageToPost } from '../services/images';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [tempImages, setTempImages] = useState(new Set()); // 임시 이미지 경로들
  const [permanentImages, setPermanentImages] = useState(new Set()); // 영구 저장된 이미지들

  // 이미지 업로드 (임시)
  const uploadTempImage = useCallback(async (file) => {
    setUploading(true);
    try {
      const result = await uploadImage(file); // postId 없이 임시 업로드
      setTempImages(prev => new Set([...prev, result.path]));
      return result.url;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  }, []);

  // 이미지 삭제
  const removeImage = useCallback(async (imagePath) => {
    try {
      await deleteImage(imagePath);
      
      // 상태에서 제거
      setTempImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imagePath);
        return newSet;
      });
      
      setPermanentImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imagePath);
        return newSet;
      });
      
      return true;
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      throw error;
    }
  }, []);

  // 임시 이미지를 영구 저장으로 이동
  const moveToPermanent = useCallback(async (postId) => {
    const tempImagePaths = Array.from(tempImages);
    const movedImages = [];

    for (const tempPath of tempImagePaths) {
      try {
        const result = await moveTempImageToPost(tempPath, postId);
        movedImages.push(result);
        
        // 상태 업데이트
        setTempImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(tempPath);
          return newSet;
        });
        
        setPermanentImages(prev => new Set([...prev, result.path]));
      } catch (error) {
        console.error('이미지 이동 실패:', error);
        // 실패한 이미지는 임시 상태로 유지
      }
    }

    return movedImages;
  }, [tempImages]);

  // 클립보드에서 이미지 붙여넣기
  const handlePasteImage = useCallback(async (event) => {
    const items = event.clipboardData.items;
    
    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          try {
            const imageUrl = await uploadTempImage(file);
            return imageUrl; // 에디터에 삽입할 URL 반환
          } catch (error) {
            console.error('붙여넣기 이미지 업로드 실패:', error);
          }
        }
      }
    }
  }, [uploadTempImage]);

  // 파일 드래그 앤 드롭
  const handleDropImage = useCallback(async (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    const uploadedUrls = [];
    
    for (const file of imageFiles) {
      try {
        const imageUrl = await uploadTempImage(file);
        uploadedUrls.push(imageUrl);
      } catch (error) {
        console.error('드롭 이미지 업로드 실패:', error);
      }
    }
    
    return uploadedUrls;
  }, [uploadTempImage]);

  // 정리 함수
  const cleanup = useCallback(() => {
    setTempImages(new Set());
    setPermanentImages(new Set());
  }, []);

  return {
    uploading,
    tempImages: Array.from(tempImages),
    permanentImages: Array.from(permanentImages),
    uploadTempImage,
    removeImage,
    moveToPermanent,
    handlePasteImage,
    handleDropImage,
    cleanup
  };
};

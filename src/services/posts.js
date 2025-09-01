import { supabase } from '../supabase';

// 모든 포스트 조회
export const getAllPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { data: null, error };
  }
};

// 단일 포스트 조회 (ID로)
export const getPostById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { data: null, error };
  }
};

// 새 포스트 생성
export const createPost = async (postData) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error creating post:', error);
    return { data: null, error };
  }
};

// 포스트 수정
export const updatePost = async (id, updateData) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error updating post:', error);
    return { data: null, error };
  }
};

// 포스트 삭제
export const deletePost = async (id) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { error };
  }
};

// 포스트 발행 상태 변경
export const togglePostPublish = async (id, isPublished) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update({ is_published: isPublished })
      .eq('id', id)
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error toggling post publish:', error);
    return { data: null, error };
  }
};

// 조회수 증가
export const incrementViewCount = async (id) => {
  try {
    // 조회수 증가
    const { error: incrementError } = await supabase
      .rpc('increment_view_count', { post_id: id });

    if (incrementError) throw incrementError;

    // 업데이트된 게시글 데이터 가져오기
    const { data, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    return { data, error: null };
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return { data: null, error };
  }
};

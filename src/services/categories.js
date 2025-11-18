import { supabase } from '../supabase';

// 모든 활성화된 카테고리 조회
export const getAllCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: null, error };
  }
};

// 카테고리별 포스트 개수 조회
export const getPostCountByCategory = async (categoryKey) => {
  try {
    // RLS 정책을 고려하여 실제 데이터를 조회한 후 길이를 반환
    const { data, error } = await supabase
      .from('posts')
      .select('id')
      .eq('is_published', true)
      .eq('category_key', categoryKey);

    if (error) throw error;
    
    const count = data ? data.length : 0;
    return { count, error: null };
  } catch (error) {
    console.error('Error fetching post count by category:', error);
    return { count: 0, error };
  }
};

// 모든 카테고리별 포스트 개수 조회
export const getPostCountsByAllCategories = async () => {
  try {
    const { data: categories, error: categoriesError } = await getAllCategories();
    if (categoriesError) throw categoriesError;

    const counts = {};
    
    // 각 카테고리별로 포스트 개수 조회
    // getAllCategories()가 { data: [...], error: null } 형태를 반환하므로
    // categories는 이미 카테고리 배열입니다
    const categoriesArray = categories || [];
    
    for (const category of categoriesArray) {
      const { count, error: countError } = await getPostCountByCategory(category.key);
      if (!countError) {
        counts[category.key] = count;
      }
    }

    // 전체 포스트 개수도 추가
    const { count: totalCount, error: totalError } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true);

    if (!totalError) {
      counts['all'] = totalCount || 0;
    }

    return { data: counts, error: null };
  } catch (error) {
    console.error('Error fetching post counts by categories:', error);
    return { data: {}, error };
  }
};


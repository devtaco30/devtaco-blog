import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { HASH_ROUTES } from '../constants/routes';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 현재 세션 확인
    const getSession = async () => {
      console.log('🔄 초기 세션 확인 중...');
      console.log('🔄 현재 URL:', window.location.href);
      
      // 🔥 에러 URL 감지 및 처리
      if (window.location.search.includes('error=server_error')) {
        console.log('❌ Supabase Auth Hook 에러 감지');
        
        // 에러 메시지 표시
        alert('허용되지 않은 GitHub 계정입니다. 홈페이지로 돌아갑니다.');
        
        // 홈페이지로 리다이렉트
        window.location.hash = HASH_ROUTES.HOME;
        
        // URL 정리
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
      
      try {
        // URL 해시에서 토큰 확인
        const hash = window.location.hash;
        if (hash.includes('access_token=')) {
          console.log('🔑 URL 해시에서 토큰 발견!');
          console.log('🔗 해시:', hash);
          
          // URL에서 토큰 파싱 (해시 구조 수정)
          console.log('🔍 해시 파싱 시작...');
          
          // #/#access_token=... 형태 처리
          const tokenPart = hash.split('#access_token=')[1];
          if (tokenPart) {
            const accessToken = tokenPart.split('&')[0];
            const refreshTokenPart = tokenPart.split('&refresh_token=')[1];
            const refreshToken = refreshTokenPart ? refreshTokenPart.split('&')[0] : '';
            
            console.log('🔑 파싱된 Access Token:', accessToken ? '있음' : '없음');
            console.log('🔄 파싱된 Refresh Token:', refreshToken ? '있음' : '없음');
            
            if (accessToken) {
            console.log('🔑 Access Token 파싱 성공');
            
            // Supabase 세션 수동 설정
            try {
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || ''
              });
              
              if (error) {
                console.error('❌ 세션 설정 실패:', error);
              } else {
                console.log('✅ 세션 수동 설정 성공:', data.session?.user?.email);
              }
            } catch (sessionError) {
              console.error('💥 세션 설정 중 오류:', sessionError);
            }
          }
        }
        
        // 해시 정리
        console.log('🧹 URL 해시 정리');
        window.location.hash = HASH_ROUTES.HOME;
      }
        
        // 브라우저 초기화 시간 대기
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 세션 확인
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ 세션 조회 오류:', error);
          // 오류 발생 시 세션 초기화
          await supabase.auth.signOut();
        }
        
        console.log('📋 초기 세션 결과:', session?.user?.email || '세션 없음');
        console.log('📋 세션 전체 정보:', session);
        console.log('📋 세션 액세스 토큰:', session?.access_token ? '있음' : '없음');
        
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('💥 세션 조회 중 예외:', error);
        // 예외 발생 시 세션 초기화
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          console.error('💥 로그아웃 중 오류:', signOutError);
        }
        setLoading(false);
      }
    };

    getSession();

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 인증 상태 변경:', event, session?.user?.email);
        console.log('🔄 전체 세션 정보:', session);
        console.log('🔄 현재 URL:', window.location.href);
        
        if (event === 'SIGNED_IN') {
          console.log('✅ 로그인 완료! 사용자 정보:', session?.user);
          // GitHub OAuth 후 리다이렉트 처리
          if (session?.user?.app_metadata?.provider === 'github') {
            console.log('🐙 GitHub OAuth 로그인 감지!');
            // 필요시 추가 리다이렉트
            if (window.location.hash === HASH_ROUTES.HOME) {
              console.log('🔄 관리자 페이지로 리다이렉트');
              window.location.hash = HASH_ROUTES.ADMIN_POSTS;
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 로그아웃 완료');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 토큰 갱신됨');
        } else if (event === 'INITIAL_SESSION') {
          console.log('🔄 초기 세션 로드됨');
        } else if (event === 'USER_UPDATED') {
          console.log('🔄 사용자 정보 업데이트됨');
        }
        
        // 세션이 있으면 사용자 정보 설정
        if (session?.user) {
          console.log('✅ 세션에서 사용자 정보 설정:', session.user.email);
          console.log('🔍 사용자 메타데이터:', session.user.app_metadata);
          setUser(session.user);
        } else {
          console.log('❌ 세션에 사용자 정보 없음');
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    console.log('🔐 로그인 시도:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ 로그인 실패:', error.message);
    } else {
      console.log('✅ 로그인 성공:', data.user?.email);
      console.log('👤 사용자 정보:', data.user);
    }
    
    return { error };
  };

  const signUp = async (email, password) => {
    console.log('📝 회원가입 시도:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ 회원가입 실패:', error.message);
      console.error('❌ 에러 상세:', error);
    } else {
      console.log('✅ 회원가입 성공:', data.user?.email);
      console.log('👤 사용자 정보:', data.user);
      console.log('📧 이메일 확인 필요:', data.user?.email_confirmed_at ? '아니오' : '예');
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('🚪 로그아웃 시도');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ 로그아웃 실패:', error.message);
    } else {
      console.log('✅ 로그아웃 성공');
    }
    
    return { error };
  };

  const signInWithGitHub = async () => {
    // 허용된 GitHub 사용자 목록
    const allowedUsers = process.env.REACT_APP_ALLOWED_GITHUB_USERS?.split(',');
    
    if (!allowedUsers || allowedUsers.length === 0) {
      console.error('❌ 허용된 GitHub 사용자가 설정되지 않았습니다.');
      alert('GitHub 로그인이 설정되지 않았습니다.');
      return;
    }
    
    // 현재 로그인된 사용자 확인
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // 이미 로그인된 상태라면 허용된 사용자인지 확인
      const githubUsername = user.user_metadata?.user_name;
      
      if (!allowedUsers.includes(githubUsername)) {
        alert(`허용되지 않은 GitHub 계정입니다: ${githubUsername}`);
        return;
      }
    }
    
    console.log('🐙 GitHub 로그인 시도');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/devtaco-blog/#/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    if (error) {
      console.error('❌ GitHub 로그인 실패:', error.message);
    } else {
      console.log('✅ GitHub 로그인 리다이렉트 성공');
      console.log('🔗 리다이렉트 URL:', data.url);
      console.log('🔗 현재 origin:', window.location.origin);
      console.log('🔗 예상 리다이렉트 경로:', `${window.location.origin}/devtaco-blog/#/`);
    }
    
    return { error };
  };

  // 테스트용 함수 (Console에서 호출 가능)
  const testAuth = async () => {
    console.log('🧪 Auth 테스트 시작');
    console.log('현재 사용자:', user);
    console.log('로딩 상태:', loading);
    
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log('세션 테스트:', data, error);
    } catch (err) {
      console.error('세션 테스트 오류:', err);
    }
  };

  // 전역에서 접근 가능하도록 설정
  if (typeof window !== 'undefined') {
    window.testAuth = testAuth;
    window.authContext = { user, loading, signIn, signUp, signOut };
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGitHub,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

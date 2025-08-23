
import axiosClient from '../clients/axiosClient';
import { handleApiError } from '../apiUtils';
import { getRefreshToken, saveAccessToken, saveRefreshToken, clearAllTokens } from '@/utils/storage';

interface SignUpProps {
  username: string;
  email: string;
  password: string;
  password2: string;
  nickname?: string;
}

export const signUp = async (postData: SignUpProps) => {
  try {
    const response = await axiosClient.post('/auth/register', postData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

interface LogInProps {
  username: string;
  password: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

export const logIn = async (postData: LogInProps) => {
  try {
    const response = await axiosClient.post<AuthTokens>(
      '/auth/login',
      postData
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

interface Profile {
  id: number;
  nickname?: string;
  username: string;
  email: string;
  is_active: boolean;
  date_joined: string;
}

export const getProfile = async () => {
  try {
    const response = await axiosClient.get<Profile>('/auth/profile');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// 토큰 리프레시
export const refreshToken = async () => {
  try {
    const refreshTokenValue = await getRefreshToken();
    
    if (!refreshTokenValue) {
      throw new Error('리프레시 토큰이 없습니다.');
    }

    const response = await axiosClient.post<AuthTokens>(
      '/auth/token/refresh',
      { refresh: refreshTokenValue }
    );
    
    // 새로운 토큰들을 저장
    await saveAccessToken(response.data.access);
    await saveRefreshToken(response.data.refresh);
    
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// 로그아웃
export const logOut = async () => {
  try {
    const refreshTokenValue = await getRefreshToken();
    
    if (refreshTokenValue) {
      // 서버에 로그아웃 요청
      await axiosClient.post('/auth/logout', {
        refresh: refreshTokenValue
      });
    }
    
    // 로컬 토큰 삭제
    await clearAllTokens();
  } catch (error) {
    // 로그아웃 API 실패해도 로컬 토큰은 삭제
    await clearAllTokens();
    handleApiError(error);
    throw error;
  }
};

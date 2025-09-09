import axiosClient from '../clients/axiosClient';
import { handleApiError } from '../apiUtils';
import {
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
  clearAllTokens,
  clearAllUserData,
  saveUserProfile,
  removeUserProfile,
} from '@/utils/storage';

interface SignUpProps {
  username: string;
  email: string;
  password: string;
  password2: string;
  nickname?: string;
}

interface Profile {
  id: number;
  nickname?: string;
  username: string;
  email: string;
  is_active: boolean;
  date_joined: string;
}

interface LogInProps {
  username: string;
  password: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
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

export const logIn = async (postData: LogInProps) => {
  try {
    const response = await axiosClient.post<AuthTokens>(
      '/auth/login',
      postData,
    );

    // 토큰 저장
    await saveAccessToken(response.data.access);
    await saveRefreshToken(response.data.refresh);

    // 로그인 성공 후 사용자 프로필 정보 가져와서 저장
    try {
      const profileResponse = await axiosClient.get<Profile>('/auth/profile', {
        headers: {
          Authorization: `Bearer ${response.data.access}`,
        },
      });
      await saveUserProfile(profileResponse.data);
    } catch (profileError) {
      console.error('프로필 정보 저장 실패:', profileError);
      // 프로필 저장 실패해도 로그인은 성공으로 처리
    }

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const registerCheck = async (email: string) => {
  try {
    const response = await axiosClient.get(
      `/auth/register-check?email=${email}`,
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

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

    const response = await axiosClient.post<AuthTokens>('/auth/token/refresh', {
      refresh: refreshTokenValue,
    });

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
        refresh: refreshTokenValue,
      });
    }

    // 로컬 토큰 삭제
    await clearAllTokens();
    await removeUserProfile();
  } catch (error) {
    // 로그아웃 API 실패해도 로컬 데이터는 삭제
    await clearAllTokens();
    await removeUserProfile();
    handleApiError(error);
    throw error;
  }
};

// 회원 탈퇴
export const withdraw = async () => {
  try {
    // 서버에 탈퇴 요청
    await axiosClient.delete('/auth/withdraw');

    // 로컬의 모든 사용자 데이터 삭제
    await clearAllUserData();
  } catch (error) {
    // 탈퇴 API 실패해도 로컬 데이터는 삭제
    await clearAllUserData();
    handleApiError(error);
    throw error;
  }
};

// 이메일 인증 코드 전송
export const sendVerificationCode = async (email: string) => {
  try {
    const response = await axiosClient.post('/auth/authorize', {
      email,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// 이메일 인증 코드 확인
export const verifyEmailCode = async (email: string, code: string) => {
  try {
    const response = await axiosClient.patch('/auth/authorize', {
      email,
      auth_code: code,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// 최종 회원가입
export const completeSignUp = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosClient.post('/auth/register', {
      username: email,
      email: email,
      password: password,
      password2: password,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// 최종 비밀번호 재설정
export const completeForgotPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosClient.post('/auth/reset-password', {
      email: email,
      password: password,
      password2: password,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

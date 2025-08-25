import AsyncStorage from '@react-native-async-storage/async-storage';

// accessToken 저장
export const saveAccessToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('accessToken', token);
  } catch (error) {
    console.error('액세스 토큰 저장 실패', error);
  }
};

// accessToken 가져오기
export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    return token;
  } catch (error) {
    console.error('액세스 토큰 불러오기 실패', error);
    return null;
  }
};

// accessToken 삭제
export const removeAccessToken = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
  } catch (error) {
    console.error('액세스 토큰 삭제 실패', error);
  }
};

// refreshToken 저장
export const saveRefreshToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('refreshToken', token);
  } catch (error) {
    console.error('리프레시 토큰 저장 실패', error);
  }
};

// refreshToken 가져오기
export const getRefreshToken = async () => {
  try {
    const token = await AsyncStorage.getItem('refreshToken');
    return token;
  } catch (error) {
    console.error('리프레시 토큰 불러오기 실패', error);
    return null;
  }
};

// refreshToken 삭제
export const removeRefreshToken = async () => {
  try {
    await AsyncStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('리프레시 토큰 삭제 실패', error);
  }
};

// 모든 토큰 삭제 (로그아웃용)
export const clearAllTokens = async () => {
  try {
    await Promise.all([
      removeAccessToken(),
      removeRefreshToken(),
    ]);
  } catch (error) {
    console.error('토큰 전체 삭제 실패', error);
  }
};

// 사용자 프로필 정보 인터페이스
interface UserProfile {
  id: number;
  nickname?: string;
  username: string;
  email: string;
  is_active: boolean;
  date_joined: string;
}

// 사용자 프로필 저장
export const saveUserProfile = async (profile: UserProfile) => {
  try {
    await AsyncStorage.setItem('@userProfile', JSON.stringify(profile));
  } catch (error) {
    console.error('사용자 프로필 저장 실패', error);
  }
};

// 사용자 프로필 불러오기
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profile = await AsyncStorage.getItem('@userProfile');
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('사용자 프로필 불러오기 실패', error);
    return null;
  }
};

// 사용자 프로필 삭제
export const removeUserProfile = async () => {
  try {
    await AsyncStorage.removeItem('@userProfile');
  } catch (error) {
    console.error('사용자 프로필 삭제 실패', error);
  }
};

// 모든 사용자 데이터 삭제 (탈퇴용)
export const clearAllUserData = async () => {
  try {
    await Promise.all([
      // 토큰 삭제
      removeAccessToken(),
      removeRefreshToken(),
      // 사용자 프로필 삭제
      removeUserProfile(),
      // 사용자 설정 삭제
      AsyncStorage.removeItem('@password'),
      AsyncStorage.removeItem('@NotiTime'),
      AsyncStorage.removeItem('@hasCompletedOnboarding'),
      // 기타 앱 데이터 삭제
      AsyncStorage.removeItem('@lastSelectedDate'),
      AsyncStorage.removeItem('@userPreferences'),
    ]);
  } catch (error) {
    console.error('사용자 데이터 전체 삭제 실패', error);
  }
};

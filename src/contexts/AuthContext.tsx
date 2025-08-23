import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAccessToken } from '@/utils/storage';

interface AuthContextType {
  isLoggedIn: boolean | null; // null: 검사중, true: 로그인됨, false: 로그인안됨
  isLoading: boolean;
  checkLoginStatus: () => Promise<void>;
  setLoginStatus: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkLoginStatus = async () => {
    try {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      setIsLoggedIn(!!accessToken);
    } catch (error) {
      console.error('로그인 상태 검사 실패:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const setLoginStatus = (status: boolean) => {
    setIsLoggedIn(status);
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 백그라운드에서 로그인 상태 검사
    checkLoginStatus();
  }, []);

  const contextValue: AuthContextType = {
    isLoggedIn,
    isLoading,
    checkLoginStatus,
    setLoginStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
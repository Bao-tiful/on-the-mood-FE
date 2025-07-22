import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, router, useNavigation } from "expo-router";

/// Auth 상태를 체크하고, 토큰이 저장되어있지 않으면 로그인 페이지로 변경해준다.
const AuthCheck = ({
  children,
  redirectPath,
}: {
  children: React.ReactNode;
  redirectPath: Href;
}) => {
  const navigation = useNavigation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        console.log("인증 상태 확인 시작");
        const token = await AsyncStorage.getItem("accessToken");
        console.log("토큰 확인 결과:", token ? "토큰 존재" : "토큰 없음");
        
        if (!token) {
          console.log("토큰이 없어 로그인 페이지로 이동");
          router.replace(redirectPath);
        } else {
          console.log("토큰이 있어 메인 화면 표시");
        }
      } catch (error) {
        console.error("토큰 확인 중 오류 발생:", error);
        // 오류가 발생해도 로그인 페이지로 이동
        router.replace(redirectPath);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    // 약간의 지연을 두어 네비게이션이 준비되도록 함
    const timer = setTimeout(checkAuthState, 100);
    
    return () => clearTimeout(timer);
  }, [navigation, redirectPath]);

  // 인증 확인 중일 때는 빈 화면 표시
  if (isCheckingAuth) {
    return <View style={{ flex: 1 }} />;
  }

  return <View style={{ flex: 1 }}>{children}</View>;
};

export default AuthCheck;

const styles = StyleSheet.create({});

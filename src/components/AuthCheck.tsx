import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
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

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          router.replace(redirectPath);
        }
      } catch (error) {
        console.error("토큰 확인 중 오류 발생 :", error);
      }
    };

    checkAuthState();
  }, [navigation]);

  return <View style={{ flex: 1 }}>{children}</View>;
};

export default AuthCheck;

const styles = StyleSheet.create({});

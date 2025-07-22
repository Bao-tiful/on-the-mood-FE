import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { toastConfig } from "../components/feedback/ToastMessage";
import AuthCheck from "../components/AuthCheck";
import { BackgroundColorProvider } from "../contexts/BackgroundColorProvider";

// 스플래시 화면이 자동으로 숨겨지지 않도록 설정
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // 앱 초기화 준비
    const prepareApp = async () => {
      try {
        console.log("앱 초기화 시작");
        
        // 필요한 초기화 작업들을 여기에 추가
        // 예: 폰트 로딩, 초기 데이터 로딩 등
        
        // 잠시 대기 후 앱 준비 완료
        await new Promise(resolve => setTimeout(resolve, 200));
        
        console.log("앱 준비 완료");
        setIsAppReady(true);
      } catch (error) {
        console.error("앱 초기화 중 오류:", error);
        // 오류가 발생해도 앱을 시작
        setIsAppReady(true);
      }
    };

    prepareApp();
  }, []);

  useEffect(() => {
    // 앱이 준비되면 스플래시 화면을 숨김
    if (isAppReady) {
      const hideSplashScreen = async () => {
        try {
          console.log("스플래시 화면 숨김 시도");
          await SplashScreen.hideAsync();
          console.log("스플래시 화면 숨김 완료");
        } catch (error) {
          console.warn("스플래시 화면 숨김 중 오류:", error);
        }
      };

      // 약간의 지연을 두어 UI가 완전히 렌더링되도록 함
      const timer = setTimeout(hideSplashScreen, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isAppReady]);

  // 앱이 준비되지 않았으면 null을 반환하여 렌더링 방지
  if (!isAppReady) {
    return null;
  }

  return (
    <>
      {/* // ThemeProvider를 통해 앱 전반에 다크테마 / 라이트테마 적용 가능함 */}
      <ThemeProvider value={DefaultTheme}>
        <BackgroundColorProvider>
          <StatusBar style="dark" />
          {/* RN expo-router를 사용하면, Stack을 사용해서 depth를 가지는 navigation이 가능하다*/}
          {/* Link를 사용하면 push가 가능하다 */}
          {/* 임시로 AuthCheck 비활성화 */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="pages/EditPage" />
            <Stack.Screen name="pages/Auth/Entrance" />
          </Stack>
        </BackgroundColorProvider>
        <Toast position="bottom" config={toastConfig} />
      </ThemeProvider>
    </>
  );
}

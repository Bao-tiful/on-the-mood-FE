import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { toastConfig } from "../components/feedback/ToastMessage";
import AuthCheck from "../components/AuthCheck";
import { BackgroundColorProvider } from "../contexts/BackgroundColorProvider";

export default function RootLayout() {
  return (
    <>
      {/* // ThemeProvider를 통해 앱 전반에 다크테마 / 라이트테마 적용 가능함 */}
      <ThemeProvider value={DefaultTheme}>
        <BackgroundColorProvider>
          <StatusBar style="dark" />
          {/* RN expo-router를 사용하면, Stack을 사용해서 depth를 가지는 navigation이 가능하다*/}
          {/* Link를 사용하면 push가 가능하다 */}
          <AuthCheck redirectPath="/pages/Auth/Entrance">
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="pages/EditPage" />
              <Stack.Screen name="pages/Auth/Entrance" />
            </Stack>
          </AuthCheck>
        </BackgroundColorProvider>
        <Toast position="bottom" config={toastConfig} />
      </ThemeProvider>
    </>
  );
}

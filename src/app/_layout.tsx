import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useEffect } from "react";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <>
      {/* // ThemeProvider를 통해 앱 전반에 다크테마 / 라이트테마 적용 가능함 */}
      <ThemeProvider value={DefaultTheme}>
        <StatusBar style="dark" />
        {/* RN expo-router를 사용하면, Stack을 사용해서 depth를 가지는 navigation이 가능하다*/}
        {/* Link를 사용하면 push가 가능하다 */}
        <Stack>
          <Stack.Screen
            name="pages/EditPage"
            options={{ headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </>
  );
}

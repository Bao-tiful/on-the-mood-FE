import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../components/feedback/ToastMessage';
import AuthCheck from '../components/AuthCheck';
import { BackgroundColorProvider } from '../contexts/BackgroundColorProvider';
import { Colors } from '@/styles/Colors';

// TODO: This layout file needs to be converted to a proper navigation container
// It should be moved to App.tsx or a similar root component and use NavigationContainer
// with createStackNavigator or createBottomTabNavigator from @react-navigation/stack or @react-navigation/bottom-tabs

// TODO: Replace with React Native splash screen if needed

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // 앱 초기화 준비
    const prepareApp = async () => {
      try {
        console.log('앱 초기화 시작');

        // 필요한 초기화 작업들을 여기에 추가
        // 예: 폰트 로딩, 초기 데이터 로딩 등

        // 잠시 대기 후 앱 준비 완료
        await new Promise(resolve => setTimeout(resolve, 200));

        console.log('앱 준비 완료');
        setIsAppReady(true);
      } catch (error) {
        console.error('앱 초기화 중 오류:', error);
        // 오류가 발생해도 앱을 시작
        setIsAppReady(true);
      }
    };

    prepareApp();
  }, []);

  useEffect(() => {
    // 앱이 준비되면 스플래시 화면을 숨김
    if (isAppReady) {
      // TODO: Replace with React Native splash screen logic if needed
      console.log('앱 준비 완료');

      const timer = setTimeout(() => {
        console.log('초기화 완료');
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isAppReady]);

  // 앱이 준비되지 않았으면 null을 반환하여 렌더링 방지
  if (!isAppReady) {
    return null;
  }

  return (
    <>
      {/* TODO: Convert this to NavigationContainer with proper screen setup */}
      {/* ThemeProvider를 통해 앱 전반에 다크테마 / 라이트테마 적용 가능함 */}
      <ThemeProvider value={DefaultTheme}>
        <BackgroundColorProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={Colors.white100}
          />
          {/* TODO: Replace with NavigationContainer and Stack.Navigator */}
          {/* This is a placeholder component that needs to be replaced with proper navigation setup */}
          {/* 임시로 AuthCheck 비활성화 */}
          <AuthCheck redirectPath="Entrance">
            {/* 인증된 사용자를 위한 컴포넌트들 */}
            <View style={{ flex: 1 }}>
              {/* 메인 앱 컨텐츠가 여기에 들어갈 예정 */}
            </View>
          </AuthCheck>
        </BackgroundColorProvider>
        <Toast position="bottom" config={toastConfig} />
      </ThemeProvider>
    </>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import { BackgroundColorProvider } from '@/contexts/BackgroundColorProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { IconName } from '@/components/Icon';
import { ToolbarButton } from '@/components/ToolbarButton';
import Calendar from '@/components/calendar/Calendar';
import Threads from '@/components/calendar/thread/Threads';
import { Colors, OndoColors } from '@/styles/Colors';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { getWeather, LocationData } from '@/api/endpoints/weather';
import { useBackgroundColor } from '@/hooks/useBackgroundColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccessToken } from '@/utils/storage';
// Auth screens
import Entrance from '@/app/pages/Auth/Entrance';
import SignIn from '@/app/pages/Auth/SignIn';
import SignUp from '@/app/pages/Auth/SignUp';
import Onboarding from '@/app/pages/Auth/Onboarding';
import Withdraw from '@/app/pages/Auth/Withdraw';
import PasswordUnlockPage from '@/app/pages/Auth/PasswordUnlockPage';
// Content screens
import DetailPage from '@/app/pages/DetailPage';
import EditPage from '@/app/pages/EditPage';
// Profile screens
import MyPageScreen from '@/app/pages/MyPage';
import PasswordPage from '@/app/pages/Profile/PasswordPage';
import WithdrawPage from '@/app/pages/Profile/WithdrawPage';

const Stack = createStackNavigator<RootStackParamList>();

function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isGridMode, setIsGreedMode] = useState(true);
  const [date, setDate] = useState(new Date());
  const [todayTemperature, setTodayTemperature] = useState(0);
  const { colorState, setBackgroundColor } = useBackgroundColor();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  const { geoLocation } = useGeoLocation();

  useEffect(() => {
    const getTemperature = async () => {
      if (geoLocation && !isLoadingWeather) {
        setIsLoadingWeather(true);
        try {
          const weatherData = await getWeather({
            latitude: geoLocation.latitude,
            longitude: geoLocation.longitude,
          });
          setLocation(weatherData.location);
          setTodayTemperature(weatherData.avg_feels_like_temp);
          setBackgroundColor(weatherData.avg_feels_like_temp);
        } catch (error) {
          console.error('날씨 정보 가져오기 실패:', error);
        } finally {
          setIsLoadingWeather(false);
        }
      }
    };

    getTemperature();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoLocation, setBackgroundColor]);

  const updateDate = (newDate: Date) => {
    setDate(newDate);
  };

  return (
    <View
      style={[
        styles.background,
        {
          backgroundColor: OndoColors.get(todayTemperature) ?? Colors.white100,
        },
      ]}
    >
      <SafeAreaView style={[styles.safeArea]}>
        <View style={styles.topToolbar}>
          <ToolbarButton
            name={IconName.profile}
            onPress={() => {
              navigation.navigate('MyPage');
            }}
          />
          <ToolbarButton
            name={IconName.list}
            onPress={() => {
              setIsGreedMode(!isGridMode);
            }}
          />
        </View>
        <View style={isGridMode ? styles.content : styles.thread}>
          {isGridMode ? (
            <Calendar
              date={date}
              updateDate={updateDate}
              location={location ?? undefined}
              feelLikeTemp={todayTemperature}
            />
          ) : (
            <Threads updateDate={updateDate} />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  topToolbar: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  thread: {
    flex: 1,
    width: '100%',
  },
});

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    const checkAppStateAndSetInitialRoute = async () => {
      try {
        // 1. 첫 실행 여부 확인
        const hasCompletedOnboarding = await AsyncStorage.getItem('@hasCompletedOnboarding');
        
        if (!hasCompletedOnboarding) {
          // 첫 실행이면 온보딩부터 시작
          setInitialRoute('Onboarding');
          return;
        }

        // 2. 비밀번호 등록 여부 확인
        const storedPassword = await AsyncStorage.getItem('@password');
        
        if (storedPassword && storedPassword.length === 4) {
          // 비밀번호가 설정되어 있으면 PasswordUnlockPage로 시작
          setInitialRoute('PasswordUnlockPage');
          return;
        }

        // 3. 비밀번호가 없다면 로그인 상태 확인
        const accessToken = await getAccessToken();
        
        if (accessToken) {
          // 로그인되어 있으면 Home으로 시작
          setInitialRoute('Home');
        } else {
          // 로그인되어 있지 않으면 Entrance로 이동
          setInitialRoute('Entrance');
        }
      } catch (error) {
        console.error('앱 상태 확인 중 오류 발생:', error);
        setInitialRoute('Entrance');
      }
    };

    checkAppStateAndSetInitialRoute();
  }, []);

  // 초기 라우트가 결정되기 전까지 로딩
  if (initialRoute === null) {
    return null;
  }

  return (
    <AuthProvider>
      <BackgroundColorProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName={initialRoute}
          >
          {/* Main screens */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="MyPage" component={MyPageScreen} />

          {/* Auth screens */}
          <Stack.Screen name="Entrance" component={Entrance} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Withdraw" component={Withdraw} />
          <Stack.Screen name="PasswordUnlockPage" component={PasswordUnlockPage} />

          {/* Content screens */}
          <Stack.Screen name="DetailPage" component={DetailPage} />
          <Stack.Screen name="EditPage" component={EditPage} />

          {/* Profile screens */}
          <Stack.Screen name="PasswordPage" component={PasswordPage} />
          <Stack.Screen name="WithdrawPage" component={WithdrawPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </BackgroundColorProvider>
  </AuthProvider>
  );
}

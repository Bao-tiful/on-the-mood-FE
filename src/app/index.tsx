/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import { BackgroundColorProvider } from '@/contexts/BackgroundColorProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/components/feedback/ToastMessage';
import { IconName } from '@/components/Icon';
import { ToolbarButton } from '@/components/ToolbarButton';
import Calendar from '@/components/calendar/Calendar';
import Threads from '@/components/calendar/thread/Threads';
import { Colors, OndoColors } from '@/styles/Colors';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { getWeather, LocationData } from '@/api/endpoints/weather';
import { useBackgroundColor } from '@/hooks/useBackgroundColor';
import AnimatedColorView from '@/components/editpage/AnimatedColorView';
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
import ForgotPassword from './pages/Auth/ForgotPassword';
import SuccessChangePassword from './pages/Auth/SuccessChangePassword';

const Stack = createStackNavigator<RootStackParamList>();

function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isGridMode, setIsGridMode] = useState(true);
  const [date, setDate] = useState(new Date());
  const [todayTemperature, setTodayTemperature] = useState(0);
  const { colorState, setBackgroundColor } = useBackgroundColor();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // 배경색 애니메이션을 위한 상태
  const [currentBackgroundTemp, setCurrentBackgroundTemp] = useState(0);
  const [selectedDateNote, setSelectedDateNote] = useState<any>(null);

  const { geoLocation } = useGeoLocation();

  // 온도에 따른 색상 배열 생성 (EditPage와 동일한 방식)
  const colors = useMemo(
    () =>
      Array.from(OndoColors.keys())
        .sort((a, b) => a - b)
        .map(key => OndoColors.get(key)!),
    [],
  );

  // 배경 온도 업데이트 함수
  const updateBackgroundTemp = (temp: number) => {
    setCurrentBackgroundTemp(temp);
  };

  // 오늘 온도로 초기화
  useEffect(() => {
    if (todayTemperature !== 0) {
      updateBackgroundTemp(todayTemperature);
    }
  }, [todayTemperature]);

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

  // Calendar에서 선택된 날짜와 해당 노트 정보를 받는 콜백
  const handleSelectedDateChange = (
    selectedDate: Date | null,
    noteData: any,
  ) => {
    if (selectedDate && noteData && noteData.custom_temp !== undefined) {
      // 일기가 있는 날짜가 선택되면 해당 날짜의 mood ondo 사용
      updateBackgroundTemp(noteData.custom_temp);
      setSelectedDateNote(noteData);
    } else {
      // 일기가 없는 날짜거나 오늘 날짜가 선택되면 오늘 체감온도 사용
      updateBackgroundTemp(todayTemperature);
      setSelectedDateNote(null);
    }
  };

  return (
    <AnimatedColorView
      style={styles.background}
      colors={colors}
      activeIndex={currentBackgroundTemp + 40} // EditPage와 동일한 TEMPERATURE_OFFSET
      duration={300} // 부드러운 애니메이션을 위해 300ms
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
            name={isGridMode ? IconName.list : IconName.calendar}
            onPress={() => {
              setIsGridMode(!isGridMode);
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
              onSelectedDateChange={handleSelectedDateChange}
            />
          ) : (
            <Threads updateDate={updateDate} />
          )}
        </View>
      </SafeAreaView>
    </AnimatedColorView>
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
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  useEffect(() => {
    const checkAppStateAndSetInitialRoute = async () => {
      try {
        // 1. 첫 실행 여부 확인
        const hasCompletedOnboarding = await AsyncStorage.getItem(
          '@hasCompletedOnboarding',
        );

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
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen
              name="PasswordUnlockPage"
              component={PasswordUnlockPage}
            />
            <Stack.Screen
              name="SuccessChangePassword"
              component={SuccessChangePassword}
            />

            {/* Content screens */}
            <Stack.Screen name="DetailPage" component={DetailPage} />
            <Stack.Screen name="EditPage" component={EditPage} />

          {/* Profile screens */}
          <Stack.Screen name="PasswordPage" component={PasswordPage} />
          <Stack.Screen name="WithdrawPage" component={WithdrawPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </BackgroundColorProvider>
    <Toast config={toastConfig} />
  </AuthProvider>
  );
}

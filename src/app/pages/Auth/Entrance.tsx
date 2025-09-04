import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import { ActionButton } from '@/components/ActionButton';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import Logo from '@/components/Logo';
import { NEATBackground } from '@/components/neat';

const EntrancePage = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [animationPaused, setAnimationPaused] = useState(false);

  const handleNavigation = (screenName: keyof RootStackParamList) => {
    // 네비게이션 시작 시 애니메이션 일시정지
    setAnimationPaused(true);

    // 약간의 딜레이 후 네비게이션 실행 (애니메이션 정지가 적용될 시간)
    setTimeout(() => {
      // @ts-ignore - React Navigation 타입 시스템의 복잡한 오버로드 문제로 인한 임시 무시
      navigation.navigate(screenName);
    }, 50);
  };

  return (
    <NEATBackground
      style={styles.background}
      paused={animationPaused}
      config={{
        colors: [
          { color: '#8DF5F9', enabled: true }, // 연한 시안
          { color: '#D7F5BA', enabled: true }, // 연한 민트
          { color: '#FFFCEB', enabled: true }, // 연한 노랑
          { color: '#FEE6E0', enabled: false }, // 연한 핑크
        ],
        speed: 3, // 애니메이션 속도 (부드럽게)
        waveFrequencyX: 4, // 수평 웨이브 주파수 (더 많은 파동)
        waveFrequencyY: 4, // 수직 웨이브 주파수 (더 많은 파동)
        colorBlending: 8, // 색상 블렌딩 강도
        highlights: 0, // 하이라이트 끄기 (원본 색상 유지)
        colorBrightness: 1, // 밝기 조정 없음 (1 = 원본)
        colorSaturation: 1, // 채도 조정 없음 (1 = 원본)
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Logo width={186} />
            <Text style={styles.catchphrase}>
              <Text style={styles.catchphraseEmphasis}>온도</Text>로 느끼고,
              {'\n'}
              <Text style={styles.catchphraseEmphasis}>색</Text>
              으로 기록하다.
            </Text>
          </View>

          <View style={styles.signInButtonContainer}>
            <ActionButton
              title="회원가입"
              onPress={() => handleNavigation('SignUp')}
            />

            <View style={styles.authOptionsContainer}>
              <TouchableOpacity
                style={styles.authOption}
                onPress={() => handleNavigation('SignIn')}
              >
                <Text style={styles.loginText}>
                  <Text style={styles.loginPrompt}>이미 계정이 있나요? </Text>
                  <Text style={styles.loginAction}>로그인</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </NEATBackground>
  );
};

export default EntrancePage;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 44,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  logoContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  signInButtonContainer: {
    width: '100%',
  },
  authOptionsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: 16,
  },
  authOption: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  catchphrase: {
    ...typography.headline,
    color: Colors.black40,
    lineHeight: 26,
  },
  catchphraseEmphasis: {
    fontWeight: 'bold',
    color: Colors.black70,
  },
  loginText: {
    ...typography.body,
  },
  loginPrompt: {
    color: Colors.black40,
  },
  loginAction: {
    color: Colors.black100,
    fontWeight: '600',
  },
});

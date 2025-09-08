import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { OndoColors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import PasswordKeypad from '@/components/myPage/PasswordKeypad';
import PasswordIndicator from '@/components/myPage/PasswordIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBackgroundColor } from '@/hooks/useBackgroundColor';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';

const PasswordUnlockPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { colorState } = useBackgroundColor();
  const [passwordInput, setPasswordInput] = useState('');
  const [isError, setIsError] = useState(false);
  const [storedPassword, setStoredPassword] = useState('');
  const [biometricAttempted, setBiometricAttempted] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const {
    isAvailable,
    canUseBiometric,
    authenticateBiometric,
    getBiometricTypeName,
    isLoading: isBiometricLoading,
  } = useBiometricAuth();

  useEffect(() => {
    const loadPassword = async () => {
      const password = await AsyncStorage.getItem('@password');
      if (password && password.length === 4) {
        setStoredPassword(password);
      } else {
        // 비밀번호가 설정되어 있지 않으면 Home으로 이동 (스택 초기화)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    };

    loadPassword();
  }, [navigation]);

  // 생체인식 인증 처리
  const handleBiometricAuth = async (isAutomatic = false) => {
    if (biometricAttempted && isAutomatic) return; // 자동 시도는 한 번만
    
    try {
      setBiometricAttempted(true);
      const result = await authenticateBiometric();
      
      if (result.success) {
        // 생체인식 인증 성공 시 Home으로 이동
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        // 생체인식 인증 실패 시 비밀번호 입력 화면 표시
        setShowPasswordInput(true);
        if (!isAutomatic && result.error && !result.error.includes('취소')) {
          // 수동 시도이고, 취소가 아닌 실패일 때만 에러 메시지 표시
          Alert.alert('생체인식 인증 실패', result.error);
        }
      }
    } catch (error) {
      console.error('생체인식 인증 중 오류:', error);
      setShowPasswordInput(true);
    }
  };

  // 자동 생체인식 인증 시도
  useEffect(() => {
    const attemptBiometricAuth = async () => {
      if (isAvailable && storedPassword && !biometricAttempted) {
        // 페이지 로드 후 잠시 대기한 다음 생체인식 인증 자동 시도
        setTimeout(() => {
          handleBiometricAuth(true); // 자동 시도임을 표시
        }, 300);
      } else if (storedPassword) {
        // 생체인식을 사용할 수 없으면 바로 비밀번호 입력 화면 표시
        setShowPasswordInput(true);
      }
    };

    attemptBiometricAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAvailable, storedPassword]);

  useEffect(() => {
    if (passwordInput.length === 4) {
      if (passwordInput === storedPassword) {
        // 비밀번호가 일치하면 Home으로 이동 (스택 초기화)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        // 비밀번호가 일치하지 않으면 에러 표시 후 초기화
        setIsError(true);
        setTimeout(() => {
          setPasswordInput('');
          setIsError(false);
        }, 1000);
      }
    }
  }, [passwordInput, storedPassword, navigation]);

  const getIndicatorLabel = () => {
    if (!showPasswordInput && isAvailable) {
      return '생체인식 인증을 시도하고 있습니다...';
    }
    if (isError) {
      return '비밀번호가 일치하지 않습니다.\n다시 입력해주세요.';
    }
    return '비밀번호를 입력해주세요.';
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: OndoColors.get(colorState.color),
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topToolbar}>
          <View style={{ width: 44 }} />
          <Text
            style={{
              ...typography.heading2,
            }}
          >
            비밀번호 입력
          </Text>
          <View style={{ width: 44 }} />
        </View>

        {/* 비밀번호 UI */}
        <PasswordIndicator
          label={getIndicatorLabel()}
          password={showPasswordInput ? passwordInput : ''}
        />

        {/* 생체인식 버튼 - 생체인식 실패 후에만 표시 */}
        {showPasswordInput && canUseBiometric && biometricAttempted && (
          <View style={styles.biometricContainer}>
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={() => handleBiometricAuth(false)}
              disabled={isBiometricLoading}
            >
              <Text style={styles.biometricButtonText}>
                {isBiometricLoading ? '인증 중...' : `${getBiometricTypeName()}로 다시 시도`}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 비밀번호 패드 - 비밀번호 입력이 필요할 때만 표시 */}
        {showPasswordInput && (
          <PasswordKeypad
            onNextInput={newInput => {
              if (isError) return; // 에러 상태일 때는 입력 무시
              
              switch (true) {
                case newInput >= 0:
                  setPasswordInput(passwordInput.concat(newInput.toString()));
                  break;
                default:
                  setPasswordInput(passwordInput.slice(0, -1));
                  break;
              }
            }}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default PasswordUnlockPage;

const styles = StyleSheet.create({
  topToolbar: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safeArea: { gap: 20, margin: 12, flex: 1 },
  biometricContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  biometricButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  biometricButtonText: {
    ...typography.body,
    color: '#333',
    textAlign: 'center',
  },
});

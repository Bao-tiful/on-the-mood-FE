import { SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import { IconName } from '@/components/Icon';
import { ToolbarButton } from '@/components/ToolbarButton';
import { Colors, OndoColors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import PasswordKeypad from '@/components/myPage/PasswordKeypad';
import PasswordIndicator from '@/components/myPage/PasswordIndicator';
import AlertModal from '@/components/feedback/AlertModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBackgroundColor } from '@/hooks/useBackgroundColor';
import AnimatedColorView from '@/components/editpage/AnimatedColorView';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import Toast from 'react-native-toast-message';

enum PasswordConfigStep {
  checkCurrent = 0,
  checkCurrentAgain = 1,
  inputNew = 2,
  validateNew = 3,
  validateAgain = 4,
}

const PasswordPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<RootStackParamList, 'PasswordPage'>>();
  const { currentTemperature } = route.params || {};
  const { colorState } = useBackgroundColor();
  const [passwordInput, setPasswordInput] = useState('');
  const [step, setStep] = useState(0);
  
  // MyPage에서 전달된 온도값 사용, 없으면 colorState 사용
  const displayTemperature = currentTemperature ?? colorState.color;

  // 온도에 따른 색상 배열 생성 (index.tsx와 동일한 방식)
  const colors = useMemo(
    () =>
      Array.from(OndoColors.keys())
        .sort((a, b) => a - b)
        .map(key => OndoColors.get(key)!),
    [],
  );

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  
  const { canUseBiometric, setBiometricEnabled, getBiometricTypeName, authenticateBiometricForSetup } = useBiometricAuth();

  const indicatorLabel = [
    '현재 비밀번호를 입력해주세요.',
    '현재 비밀번호가 일치하지 않아요.\n다시 시도해주세요.',
    '새로운 비밀번호를 입력해주세요.',
    '확인을 위해 한 번 더 입력해주세요.',
    '비밀번호가 일치하지 않아요.\n처음부터 다시 시도해주세요.',
  ];

  useEffect(() => {
    const loadPassword = async () => {
      const storedPassword = await AsyncStorage.getItem('@password');

      if (storedPassword && storedPassword.length == 4) {
        // 설정된 비밀번호가 있다면 && 정확히 4자리라면
        setCurrentPassword(storedPassword);
        setStep(PasswordConfigStep.checkCurrent);
      } else {
        // 설정된 비밀번호가 없다면 && 유호하지 않은 비밀번호라면
        setStep(PasswordConfigStep.inputNew);
      }
    };

    loadPassword();
  }, []);

  // 생체인식 설정 Dialog 표시
  const showBiometricSetupDialog = () => {
    if (!canUseBiometric) {
      // 생체인식을 사용할 수 없으면 바로 이전 페이지로 돌아가기
      navigation.goBack();
      return;
    }

    setShowBiometricModal(true);
  };

  // 생체인식 설정 '예' 선택 시
  const handleBiometricEnable = async () => {
    setShowBiometricModal(false);
    
    try {
      // 먼저 생체인증을 요청 (설정용 - 활성화 상태와 무관)
      const authResult = await authenticateBiometricForSetup();
      
      if (authResult.success) {
        // 생체인증 성공 시 설정 저장
        const success = await setBiometricEnabled(true);
        if (success) {
          // Toast 메시지로 성공 알림
          Toast.show({
            type: 'info',
            text1: '생체인식 잠금해제를 설정했어요',
            visibilityTime: 2000,
          });
        } else {
          Alert.alert(
            '설정 실패',
            '생체인식 설정을 저장하는 중 오류가 발생했습니다.',
            [{ text: '확인' }]
          );
        }
      } else {
        // 생체인증 실패 시 설정하지 않음
        if (authResult.error && !authResult.error.includes('취소')) {
          Alert.alert('생체인증 실패', authResult.error);
        }
      }
    } catch (error) {
      console.error('생체인증 중 오류:', error);
      Alert.alert('오류', '생체인증 중 오류가 발생했습니다.');
    }
    
    navigation.goBack();
  };

  // 생체인식 설정 '아니오' 선택 시
  const handleBiometricCancel = () => {
    setShowBiometricModal(false);
    navigation.goBack();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const savePassword = async () => {
    await AsyncStorage.setItem('@password', newPassword);
    // 비밀번호가 변경될 때 생체인식 설정 초기화 (보안상 이유)
    await AsyncStorage.removeItem('@biometric_enabled');
    
    // 비밀번호 저장 후 생체인식 설정 Dialog 표시
    showBiometricSetupDialog();
  };

  useEffect(() => {
    if (passwordInput.length == 4) {
      switch (step) {
        case PasswordConfigStep.checkCurrent:
          // 기존 비밀번호 확인
          if (currentPassword == passwordInput) {
            // 비밀번호가 일치하는 경우 > 변경으로 이동
            setPasswordInput('');
            setStep(PasswordConfigStep.inputNew);
          } else {
            // 일치하지 않는 경우
            setPasswordInput('');
            setStep(PasswordConfigStep.checkCurrentAgain);
          }

          break;
        case PasswordConfigStep.checkCurrentAgain:
          if (currentPassword == passwordInput) {
            setPasswordInput('');
            setStep(PasswordConfigStep.inputNew);
          }
          // 일치하지 않는 경우
          else {
            setPasswordInput('');
            setStep(PasswordConfigStep.checkCurrentAgain);
          }
          break;
        case PasswordConfigStep.inputNew:
          // 새로운 비밀번호 입력하기
          // 입력된 패스워드 임시 저장
          setNewPassword(passwordInput);
          setPasswordInput('');
          setStep(step + 1);
          break;
        case PasswordConfigStep.validateNew:
          // 새로운 비밀번호 검사
          // 한 번 더 입력한 비밀번호가 일치하는 경우
          if (passwordInput == newPassword) {
            // 패스워드 저장하고 생체인식 설정 Dialog 표시
            savePassword();
          }
          // 일치하지 않는 경우
          else {
            setPasswordInput('');
            setStep(step + 1);
          }

          break;
        case PasswordConfigStep.validateAgain:
          // 새로운 비밀번호 검사 불일치
          if (passwordInput == newPassword) {
            // 패스워드 저장하고 생체인식 설정 Dialog 표시
            savePassword();
          }
          // 일치하지 않는 경우
          else {
            setPasswordInput('');
          }

          break;
      }
    }
  }, [
    currentPassword,
    navigation,
    newPassword,
    passwordInput,
    savePassword,
    step,
  ]);

  return (
    <AnimatedColorView
      style={{ flex: 1 }}
      colors={colors}
      activeIndex={displayTemperature + 40} // index.tsx에서 전달된 온도값 사용
      duration={300} // 부드러운 애니메이션
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topToolbar}>
          <ToolbarButton
            name={IconName.back}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Text
            style={{
              ...typography.heading2,
            }}
          >
            비밀번호 설정
          </Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.contentContainer}>
          {/* 비밀번호 UI */}
          <PasswordIndicator
            label={indicatorLabel[step]}
            password={passwordInput}
          />
        </View>

        {/* 비밀번호 패드 */}
        <PasswordKeypad
          onNextInput={newInput => {
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

        {/* 생체인식 설정 Modal */}
        <AlertModal
          isModalVisible={showBiometricModal}
          title="생체인식 설정"
          content={`비밀번호 대신 ${getBiometricTypeName()}을 사용하여 앱 잠금을 해제하시겠습니까?`}
          primaryLabel="예"
          secondaryLabel="아니오"
          onPressPrimary={handleBiometricEnable}
          onPressSecondary={handleBiometricCancel}
          dismissHandler={handleBiometricCancel}
        />
      </SafeAreaView>
    </AnimatedColorView>
  );
};

export default PasswordPage;

const styles = StyleSheet.create({
  topToolbar: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safeArea: { gap: 20, margin: 12, flex: 1 },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 24,
    color: Colors.black100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  text: {
    ...typography.heading1,
    color: Colors.black100,
  },
});

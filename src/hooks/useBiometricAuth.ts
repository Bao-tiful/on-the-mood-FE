import { useState, useEffect, useCallback } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

interface BiometricCapabilities {
  available: boolean;
  biometryType: string | null | undefined;
  error?: string;
}

const BIOMETRIC_ENABLED_KEY = '@biometric_enabled';

export const useBiometricAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [biometricCapabilities, setBiometricCapabilities] = useState<BiometricCapabilities>({
    available: false,
    biometryType: null,
  });
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  // 생체인식 사용 가능 여부 확인
  const checkBiometricCapabilities = useCallback(async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();

      setBiometricCapabilities({
        available,
        biometryType: biometryType || null,
      });

      return { available, biometryType };
    } catch (error) {
      console.error('생체인식 확인 중 오류:', error);
      setBiometricCapabilities({
        available: false,
        biometryType: null,
        error: '생체인식 확인 중 오류가 발생했습니다.',
      });
      return { available: false, biometryType: null };
    }
  }, []);

  // 생체인식 활성화 상태 불러오기
  const loadBiometricEnabled = useCallback(async () => {
    try {
      const enabled = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
      setIsBiometricEnabled(enabled === 'true');
      return enabled === 'true';
    } catch (error) {
      console.error('생체인식 설정 불러오기 오류:', error);
      return false;
    }
  }, []);

  // 생체인식 활성화 상태 저장
  const setBiometricEnabled = useCallback(async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, enabled.toString());
      setIsBiometricEnabled(enabled);
      return true;
    } catch (error) {
      console.error('생체인식 설정 저장 오류:', error);
      return false;
    }
  }, []);

  // 생체인식 인증 실행
  const authenticateBiometric = useCallback(async (): Promise<BiometricAuthResult> => {
    if (!biometricCapabilities.available) {
      return {
        success: false,
        error: '생체인식이 사용 불가능합니다.',
      };
    }

    if (!isBiometricEnabled) {
      return {
        success: false,
        error: '생체인식이 비활성화되어 있습니다.',
      };
    }

    setIsLoading(true);

    try {
      const rnBiometrics = new ReactNativeBiometrics();

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: '생체인식으로 앱 잠금을 해제하세요',
        cancelButtonText: '취소',
      });

      setIsLoading(false);

      if (success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: '생체인식 인증이 취소되었습니다.',
        };
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('생체인식 인증 오류:', error);

      let errorMessage = '생체인식 인증 중 오류가 발생했습니다.';

      if (error.message) {
        if (error.message.includes('UserCancel') || error.message.includes('cancelled')) {
          errorMessage = '생체인식 인증이 취소되었습니다.';
        }
        if (error.message.includes('UserFallback')) {
          errorMessage = '비밀번호로 인증해주세요.';
        }
        if (error.message.includes('BiometryNotAvailable')) {
          errorMessage = '생체인식을 사용할 수 없습니다.';
        }
        if (error.message.includes('BiometryNotEnrolled')) {
          errorMessage = '생체인식이 등록되어 있지 않습니다. 설정에서 등록해주세요.';
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [biometricCapabilities.available, isBiometricEnabled]);

  // 생체인식 설정을 위한 인증 실행 (활성화 상태와 무관하게 실행)
  const authenticateBiometricForSetup = useCallback(async (): Promise<BiometricAuthResult> => {
    if (!biometricCapabilities.available) {
      return {
        success: false,
        error: '생체인식이 사용 불가능합니다.',
      };
    }

    setIsLoading(true);

    try {
      const rnBiometrics = new ReactNativeBiometrics();

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: '생체인식 설정을 위해 인증해주세요',
        cancelButtonText: '취소',
      });

      setIsLoading(false);

      if (success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: '생체인식 인증이 취소되었습니다.',
        };
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error('생체인식 설정 인증 오류:', error);

      let errorMessage = '생체인식 인증 중 오류가 발생했습니다.';

      if (error.message) {
        if (error.message.includes('UserCancel') || error.message.includes('cancelled')) {
          errorMessage = '생체인식 인증이 취소되었습니다.';
        }
        if (error.message.includes('UserFallback')) {
          errorMessage = '비밀번호로 인증해주세요.';
        }
        if (error.message.includes('BiometryNotAvailable')) {
          errorMessage = '생체인식을 사용할 수 없습니다.';
        }
        if (error.message.includes('BiometryNotEnrolled')) {
          errorMessage = '생체인식이 등록되어 있지 않습니다. 설정에서 등록해주세요.';
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [biometricCapabilities.available]);

  // 생체인식 타입에 따른 표시명 가져오기
  const getBiometricTypeName = useCallback(() => {
    switch (biometricCapabilities.biometryType) {
      case 'FaceID':
        return 'Face ID';
      case 'TouchID':
        return 'Touch ID';
      case 'Biometrics':
        return '지문 인식';
      default:
        return '생체인식';
    }
  }, [biometricCapabilities.biometryType]);

  // 초기화
  useEffect(() => {
    const initialize = async () => {
      await checkBiometricCapabilities();
      await loadBiometricEnabled();
    };

    initialize();
  }, [checkBiometricCapabilities, loadBiometricEnabled]);

  return {
    // 상태
    isLoading,
    biometricCapabilities,
    isBiometricEnabled,

    // 메서드
    checkBiometricCapabilities,
    setBiometricEnabled,
    authenticateBiometric,
    authenticateBiometricForSetup,
    getBiometricTypeName,
    loadBiometricEnabled,

    // 편의 속성
    isAvailable: biometricCapabilities.available && isBiometricEnabled,
    canUseBiometric: biometricCapabilities.available,
  };
};
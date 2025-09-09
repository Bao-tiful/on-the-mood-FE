import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import {
  sendVerificationCode,
  verifyEmailCode,
  completeForgotPassword,
} from '@/api/endpoints/auth';

type ForgotPasswordStep = 'email' | 'verification' | 'password';

export const useForgotPassword = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailCheck = async () => {
    if (!email) {
      setErrorMessage('이메일을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // 비밀번호 재설정을 위한 인증코드 발송
      await sendVerificationCode(email);
      setCurrentStep('verification');
    } catch (error: any) {
      if (error.response?.status === 404) {
        setErrorMessage('등록되지 않은 이메일입니다.');
      } else {
        setErrorMessage('이메일 확인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationCode = async () => {
    if (!verificationCode) {
      setErrorMessage('인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await verifyEmailCode(email, verificationCode);
      setCurrentStep('password');
    } catch (error) {
      setErrorMessage('잘못된 인증코드입니다. 다시 입력해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!password || !confirmPassword) {
      setErrorMessage('비밀번호를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await completeForgotPassword({ email, password });
      Alert.alert('비밀번호 재설정 완료', '새로운 비밀번호로 로그인해주세요.');
      navigation.navigate('SignIn');
    } catch (error) {
      setErrorMessage('비밀번호 재설정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 'email') {
      navigation.goBack();
    } else if (currentStep === 'verification') {
      setCurrentStep('email');
      setErrorMessage('');
    } else {
      setCurrentStep('verification');
      setErrorMessage('');
    }
  };

  const clearErrorMessage = () => {
    setErrorMessage('');
  };

  return {
    currentStep,
    email,
    setEmail,
    verificationCode,
    setVerificationCode,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errorMessage,
    isLoading,
    handleEmailCheck,
    handleVerificationCode,
    handlePasswordReset,
    goToPreviousStep,
    clearErrorMessage,
  };
};

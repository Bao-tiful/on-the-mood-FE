import { Colors } from '@/styles/Colors';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { ActionButton } from '../ActionButton';

interface VerificationStepProps {
  email: string;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  errorMessage: string;
  isLoading: boolean;
  onVerify: () => void;
  onClearError?: () => void;
  resendCode: () => void;
  title?: string;
  subtitle?: string;
}

export const VerificationStep = ({
  email,
  verificationCode,
  setVerificationCode,
  errorMessage,
  isLoading,
  onVerify,
  onClearError,
  resendCode,
  title = '이메일의 코드를 입력해주세요.',
  subtitle,
}: VerificationStepProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3분 = 180초

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (text: string) => {
    setVerificationCode(text);

    // 사용자가 입력을 수정하면 에러 메시지 초기화
    if (errorMessage && onClearError) {
      onClearError();
    }
  };

  const getInputBorderColor = () => {
    if (errorMessage) return Colors.error;
    if (isFocused) return Colors.black100;
    return Colors.black32;
  };

  const isButtonDisabled = () => {
    return (
      verificationCode.length === 0 || isLoading || errorMessage.length > 0
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* 상단 영역 */}
          <View style={styles.topSection}>
            <View style={styles.headerContainer}>
              <Text style={styles.stepTitle}>{title}</Text>
              <Text style={styles.stepSubtitle}>
                {subtitle || `${email} 인증을 위해 코드를 입력해주세요.`}
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderBottomColor: getInputBorderColor(),
                    borderBottomWidth: 1,
                    paddingLeft: 2,
                    paddingRight: 26,
                    paddingVertical: 12,
                  },
                ]}
                placeholder="인증 코드를 입력하세요"
                keyboardType="number-pad"
                maxLength={6}
                value={verificationCode}
                onChangeText={handleCodeChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <Text style={styles.countdownText}>{formatTime(countdown)}</Text>
            </View>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>

          {/* 하단 영역 */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.resendContainer}
              onPress={() => {
                resendCode();
                setCountdown(180); // 카운트다운 리셋
                Toast.show({
                  type: 'info',
                  text1: '인증 코드를 재전송 했어요.',
                  visibilityTime: 2000, // ms단위
                });
              }}
            >
              <Text style={styles.resendText}>인증코드를 받지 못했나요?</Text>
            </TouchableOpacity>
            <ActionButton
              title="다음"
              onPress={onVerify}
              variant={isButtonDisabled() ? 'disabled' : 'default'}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    paddingVertical: 16,
  },
  bottomSection: {
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingVertical: 8,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e1e1e',
    textAlign: 'left',
    lineHeight: 30,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'left',
    marginTop: 8,
    lineHeight: 21,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: 'transparent',
    padding: 16,
    paddingBottom: 8,
    fontSize: 16,
    fontWeight: 600,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  clearButton: {
    position: 'absolute',
    right: 0,
    top: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    color: '#6267F8',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    position: 'absolute',
    right: 0,
    top: 12,
  },
  resendContainer: {
    marginBottom: 40,
  },
  resendText: {
    color: '#1E1E1E',
    fontSize: 14,
    lineHeight: 21,
    textDecorationLine: 'underline',
  },
  button: {
    width: '100%',
    backgroundColor: '#000000',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#FFFFFF',
  },
  errorText: {
    color: '#F86262',
    fontSize: 14,
    textAlign: 'left',
    marginTop: 8,
  },
});

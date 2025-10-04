import React, { useState } from 'react';
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
import Icon, { IconName } from '../Icon';
import { ActionButton } from '../ActionButton';
import { Colors } from '@/styles/Colors';

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  errorMessage: string;
  isLoading: boolean;
  onNext: () => void;
  onClearError?: () => void;
  title?: string[];
  subtitle?: string;
  buttonText?: string;
}

export const EmailStep = ({
  email,
  setEmail,
  errorMessage,
  onNext,
  onClearError,
  isLoading,
  title = ['로그인에 사용할', '이메일을 입력해주세요.'],
  subtitle,
  buttonText = '인증하기',
}: EmailStepProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState('');

  // 이메일 형식 검증 정규표현식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmailFormat = (emailValue: string) => {
    if (emailValue.length === 0) {
      setEmailFormatError('');
      return true;
    }

    if (!emailRegex.test(emailValue)) {
      setEmailFormatError('올바른 이메일 형식을 입력해주세요.');
      return false;
    }

    setEmailFormatError('');
    return true;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    validateEmailFormat(text);

    // 사용자가 입력을 수정하면 에러 메시지 초기화
    if (errorMessage && onClearError) {
      onClearError();
    }
  };

  const handleClearEmail = () => {
    setEmail('');
    setEmailFormatError('');
    if (onClearError) {
      onClearError();
    }
  };

  const getInputBorderColor = () => {
    if (errorMessage || emailFormatError) return Colors.error;
    if (isFocused) return Colors.black100;
    return Colors.black32;
  };

  const getDisplayErrorMessage = () => {
    return errorMessage || emailFormatError;
  };

  const isButtonDisabled = () => {
    return (
      email.length === 0 ||
      isLoading ||
      errorMessage.length > 0 ||
      emailFormatError.length > 0
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
              {title.map((line, index) => (
                <Text key={index} style={styles.stepTitle}>
                  {line}
                </Text>
              ))}
              {subtitle && <Text style={styles.stepSubtitle}>{subtitle}</Text>}
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
                placeholder="이메일을 입력해주세요"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={handleEmailChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {email.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClearEmail}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon name={IconName.cancel} />
                </TouchableOpacity>
              )}
            </View>
            {getDisplayErrorMessage() ? (
              <Text style={styles.errorText}>{getDisplayErrorMessage()}</Text>
            ) : null}
          </View>

          {/* 하단 버튼 영역 */}
          <View style={styles.bottomSection}>
            <ActionButton
              title={buttonText}
              onPress={onNext}
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
    paddingHorizontal: 8,
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
  clearButtonText: {
    fontSize: 18,
    color: '#999',
    fontWeight: 'bold',
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

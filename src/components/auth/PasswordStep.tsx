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

interface PasswordStepProps {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  errorMessage: string;
  isLoading: boolean;
  onSubmit: () => void;
  onClearError?: () => void;
}

export const PasswordStep = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  errorMessage,
  isLoading,
  onSubmit,
  onClearError,
}: PasswordStepProps) => {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (text: string) => {
    setPassword(text);

    // 사용자가 입력을 수정하면 에러 메시지 초기화
    if (errorMessage && onClearError) {
      onClearError();
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);

    // 사용자가 입력을 수정하면 에러 메시지 초기화
    if (errorMessage && onClearError) {
      onClearError();
    }
  };

  const getInputBorderColor = (isFocused: boolean) => {
    if (errorMessage) return '#F86262';
    if (isFocused) return '#1E1E1E';
    return '#e0e0e0';
  };

  // 비밀번호 검증 함수들
  const isPasswordLengthValid = () => {
    return password.length >= 8 && password.length <= 20;
  };

  const isPasswordSpecialCharValid = () => {
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    return specialChars.test(password);
  };

  const isPasswordMatch = () => {
    return password === confirmPassword && password.length > 0;
  };

  const isAllConditionsMet = () => {
    return (
      isPasswordLengthValid() &&
      isPasswordSpecialCharValid() &&
      isPasswordMatch() &&
      !isLoading &&
      errorMessage.length === 0
    );
  };

  const isButtonDisabled = () => {
    return !isAllConditionsMet();
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
              <Text style={styles.stepTitle}>로그인에 사용할</Text>
              <Text style={styles.stepTitle}>비밀번호를 입력해주세요.</Text>
            </View>

            {/* 비밀번호 입력 필드 */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderBottomColor: getInputBorderColor(isPasswordFocused),
                    borderBottomWidth: 1,
                    paddingLeft: 2,
                    paddingRight: 26,
                    paddingVertical: 12,
                  },
                ]}
                placeholder="비밀번호 (8자 이상)"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={handlePasswordChange}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              {password.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon
                    name={IconName.eye}
                    color={showPassword ? '#1E1E1E' : '#1E1E1E'}
                  />
                </TouchableOpacity>
              )}
              {/* 비밀번호 검증 라벨 */}
              <View style={styles.validationLabels}>
                <View style={styles.validationItem}>
                  <Text
                    style={[
                      styles.validationLabel,
                      isPasswordLengthValid() && styles.validationLabelValid,
                    ]}
                  >
                    8-20자 이내
                  </Text>
                  <Icon
                    name={IconName.check}
                    size={16}
                    color={isPasswordLengthValid() ? '#6267F8' : '#999999'}
                  />
                </View>
                <View style={styles.validationItem}>
                  <Text
                    style={[
                      styles.validationLabel,
                      isPasswordSpecialCharValid() &&
                        styles.validationLabelValid,
                    ]}
                  >
                    특수문자포함
                  </Text>
                  <Icon
                    name={IconName.check}
                    size={16}
                    color={isPasswordSpecialCharValid() ? '#6267F8' : '#999999'}
                  />
                </View>
              </View>
            </View>

            {/* 비밀번호 확인 입력 필드 */}
            <View style={[styles.inputContainer, { marginTop: 16 }]}>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderBottomColor: getInputBorderColor(
                      isConfirmPasswordFocused,
                    ),
                    borderBottomWidth: 1,
                    paddingLeft: 2,
                    paddingRight: 26,
                    paddingVertical: 12,
                  },
                ]}
                placeholder="비밀번호 확인"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                onFocus={() => setIsConfirmPasswordFocused(true)}
                onBlur={() => setIsConfirmPasswordFocused(false)}
              />
              {confirmPassword.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon
                    name={showConfirmPassword ? IconName.eye : IconName.eye}
                  />
                </TouchableOpacity>
              )}
              {/* 비밀번호 일치 라벨 */}
              <View style={styles.validationLabels}>
                <View style={styles.validationItem}>
                  <Text
                    style={[
                      styles.validationLabel,
                      isPasswordMatch() && styles.validationLabelValid,
                    ]}
                  >
                    비밀번호 일치
                  </Text>
                  <Icon
                    name={IconName.check}
                    size={16}
                    color={isPasswordMatch() ? '#6267F8' : '#999999'}
                  />
                </View>
              </View>
            </View>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>

          {/* 하단 버튼 영역 */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={[
                styles.button,
                isButtonDisabled() && styles.buttonDisabled,
              ]}
              onPress={onSubmit}
              disabled={isButtonDisabled()}
            >
              <Text
                style={[
                  styles.buttonText,
                  isButtonDisabled() && styles.buttonTextDisabled,
                ]}
              >
                시작하기
              </Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    padding: 16,
  },
  bottomSection: {
    paddingHorizontal: 20,
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
  validationLabels: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  validationLabel: {
    fontSize: 14,
    lineHeight: 18,
    color: '#999999',
    paddingLeft: 2,
  },
  validationLabelValid: {
    color: '#6267F8',
  },
  button: {
    width: '100%',
    backgroundColor: '#1E1E1E',
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

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import { ToolbarButton } from '@/components/ToolbarButton';
import Icon, { IconName } from '@/components/Icon';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import { logIn } from '@/api/endpoints/auth';
import { Colors } from '@/styles/Colors';
import { ActionButton } from '@/components/ActionButton';
// 토큰 저장은 endpoint에서 처리

const SignIn = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState('');
  const [password, setPassword] = useState('');
  const [logInResult, setLogInResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 이메일 형식 검증: UI 일관성 유지 목적
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateEmailFormat = (value: string) => {
    if (value.length === 0) {
      setEmailFormatError('');
      return true;
    }
    if (!emailRegex.test(value)) {
      setEmailFormatError('올바른 이메일 형식을 입력해주세요.');
      return false;
    }
    setEmailFormatError('');
    return true;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    validateEmailFormat(text);
    // 사용자가 수정 시, 이전 에러 상태는 의미가 없으므로 초기화
    if (logInResult) setLogInResult('');
  };

  const handleClearEmail = () => {
    setEmail('');
    setEmailFormatError('');
    if (logInResult) setLogInResult('');
  };

  const getInputBorderColor = () => {
    if (logInResult === 'error' || emailFormatError) return Colors.error;
    if (isFocused) return Colors.black100;
    return Colors.black32;
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.topToolbar}>
        <View style={styles.backButton}>
          <ToolbarButton
            name={IconName.back}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        <Text style={styles.title}>로그인</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.topSection}>
              <View style={{ gap: 12 }}>
                {/* 이메일 */}
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
                      hitSlop={{
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: 10,
                      }}
                    >
                      <Icon name={IconName.cancel} />
                    </TouchableOpacity>
                  )}
                </View>
                {(emailFormatError || logInResult === 'error') && (
                  <Text style={styles.errorText}>
                    {emailFormatError || '이메일 또는 비밀번호를 확인해주세요.'}
                  </Text>
                )}

                {/* 비밀번호 */}
                <View style={[styles.inputContainer, { marginTop: 8 }]}>
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
                    autoCapitalize="none"
                    placeholder="비밀번호"
                    secureTextEntry
                    onChangeText={v => setPassword(v)}
                  />
                </View>
                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={styles.forgotPasswordText}>
                    비밀번호가 기억나지 않나요?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 하단 버튼 영역 */}
            <View style={styles.bottomSection}>
              <ActionButton
                title={isLoading ? '로그인 중...' : '로그인'}
                onPress={async () => {
                  try {
                    setIsLoading(true);
                    await logIn({ username: email, password });
                    setLogInResult('성공');
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Home' }],
                    });
                  } catch (error) {
                    setLogInResult('error');
                    console.error('ERROR : ', error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.white100,
  },
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  topSection: {
    flex: 1,
    paddingVertical: 16,
  },
  bottomSection: {
    paddingBottom: 16,
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
  topToolbar: {
    position: 'relative',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16, // 툴바에도 padding 추가
    alignItems: 'center',
    marginHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    color: '#1e1e1e',
    fontWeight: '600',
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
  errorText: {
    color: '#F86262',
    fontSize: 14,
    textAlign: 'left',
    marginTop: 8,
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
  forgotPasswordButton: {},
  forgotPasswordText: {
    color: '#1E1E1E',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

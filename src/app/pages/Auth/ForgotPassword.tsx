import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { IconName } from '@/components/Icon';
import { ToolbarButton } from '@/components/ToolbarButton';
import { VerificationStep } from '@/components/auth/VerificationStep';
import { PasswordStep } from '@/components/auth/PasswordStep';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import { EmailStep } from '@/components/auth/EmailStep';
import { Colors } from '@/styles/Colors';

const ForgotPassword = () => {
  const {
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
  } = useForgotPassword();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'email':
        return (
          <EmailStepForReset
            email={email}
            setEmail={setEmail}
            errorMessage={errorMessage}
            isLoading={isLoading}
            onNext={handleEmailCheck}
            onClearError={clearErrorMessage}
          />
        );
      case 'verification':
        return (
          <VerificationStepForReset
            email={email}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            errorMessage={errorMessage}
            isLoading={isLoading}
            onVerify={handleVerificationCode}
            onClearError={clearErrorMessage}
            resendCode={handleEmailCheck}
          />
        );
      case 'password':
        return (
          <PasswordStepForReset
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            errorMessage={errorMessage}
            isLoading={isLoading}
            onSubmit={handlePasswordReset}
            onClearError={clearErrorMessage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topToolbar}>
        <View style={styles.backButton}>
          <ToolbarButton name={IconName.back} onPress={goToPreviousStep} />
        </View>
        <Text style={styles.title}>비밀번호 재설정</Text>
      </View>
      {renderCurrentStep()}
    </SafeAreaView>
  );
};

// EmailStep을 비밀번호 재설정용으로 커스터마이징
const EmailStepForReset = (props: Parameters<typeof EmailStep>[0]) => {
  return (
    <EmailStep
      {...props}
      title={['비밀번호를 잊으셨나요?']}
      buttonText="인증코드 받기"
      subtitle={'비밀번호 재설정을 위해\n가입한 이메일을 입력해주세요.'}
    />
  );
};

// VerificationStep을 비밀번호 재설정용으로 커스터마이징
const VerificationStepForReset = (
  props: Parameters<typeof VerificationStep>[0],
) => {
  return (
    <VerificationStep
      {...props}
      title={'비밀번호 재설정을 위해\n보내드린 이메일의 코드를 입력해주세요.'}
      subtitle={`${props.email} 인증을 위해 아래에 코드를 입력해주세요.`}
    />
  );
};

// PasswordStep을 비밀번호 재설정용으로 커스터마이징
const PasswordStepForReset = (props: Parameters<typeof PasswordStep>[0]) => {
  return (
    <PasswordStep
      {...props}
      title={['로그인에 사용할', '새로운 비밀번호를 입력해주세요.']}
      buttonText="재설정하기"
    />
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white100,
  },
  topToolbar: {
    position: 'relative',
    width: '100%',
    paddingVertical: 12,
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
});

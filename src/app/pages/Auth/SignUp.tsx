import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { IconName } from '@/components/Icon';
import { ToolbarButton } from '@/components/ToolbarButton';
import { VerificationStep } from '@/components/auth/VerificationStep';
import { PasswordStep } from '@/components/auth/PasswordStep';
import { useSignUp } from '@/hooks/useSignUp';
import { EmailStep } from '@/components/auth/EmailStep';
import { Colors } from '@/styles/Colors';

const SignUp = () => {
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
    handlePasswordSubmit,
    goToPreviousStep,
    clearErrorMessage,
  } = useSignUp();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'email':
        return (
          <EmailStep
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
          <VerificationStep
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
          <PasswordStep
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            errorMessage={errorMessage}
            isLoading={isLoading}
            onSubmit={handlePasswordSubmit}
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
        <Text style={styles.title}>회원가입</Text>
      </View>
      {renderCurrentStep()}
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
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

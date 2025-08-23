import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface VerificationStepProps {
  email: string;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  errorMessage: string;
  isLoading: boolean;
  onVerify: () => void;
}

export const VerificationStep = ({
  email,
  verificationCode,
  setVerificationCode,
  errorMessage,
  isLoading,
  onVerify,
}: VerificationStepProps) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.stepTitle}>인증 코드를 입력해주세요</Text>
        <Text style={styles.stepSubtitle}>
          {email}로 전송된 코드를 입력하세요
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="인증 코드 6자리"
        keyboardType="number-pad"
        maxLength={6}
        value={verificationCode}
        onChangeText={setVerificationCode}
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <Button
        onPress={onVerify}
        title={isLoading ? '확인 중...' : '인증하기'}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e1e1e',
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 14,
    textAlign: 'center',
  },
});

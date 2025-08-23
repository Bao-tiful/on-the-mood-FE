import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface EmailStepProps {
  email: string;
  setEmail: (email: string) => void;
  errorMessage: string;
  isLoading: boolean;
  onNext: () => void;
}

export const EmailStep = ({
  email,
  setEmail,
  errorMessage,
  isLoading,
  onNext,
}: EmailStepProps) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.stepTitle}>로그인에 사용할</Text>
        <Text style={styles.stepTitle}>이메일을 입력해주세요.</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="이메일을 입력해주세요"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <Button
        onPress={onNext}
        title={isLoading ? '확인 중...' : '다음'}
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

import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface PasswordStepProps {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  errorMessage: string;
  isLoading: boolean;
  onSubmit: () => void;
}

export const PasswordStep = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  errorMessage,
  isLoading,
  onSubmit,
}: PasswordStepProps) => {
  return (
    <View style={styles.stepContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.stepTitle}>비밀번호를 설정해주세요</Text>
        <Text style={styles.stepSubtitle}>
          로그인에 사용할 비밀번호를 입력하세요
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="비밀번호 (8자 이상)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <Button
        onPress={onSubmit}
        title={isLoading ? '가입 중...' : '회원가입 완료'}
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

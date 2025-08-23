import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { OndoColors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import PasswordKeypad from '@/components/myPage/PasswordKeypad';
import PasswordIndicator from '@/components/myPage/PasswordIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBackgroundColor } from '@/hooks/useBackgroundColor';

const PasswordUnlockPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { colorState } = useBackgroundColor();
  const [passwordInput, setPasswordInput] = useState('');
  const [isError, setIsError] = useState(false);
  const [storedPassword, setStoredPassword] = useState('');

  useEffect(() => {
    const loadPassword = async () => {
      const password = await AsyncStorage.getItem('@password');
      if (password && password.length === 4) {
        setStoredPassword(password);
      } else {
        // 비밀번호가 설정되어 있지 않으면 Home으로 이동 (스택 초기화)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    };

    loadPassword();
  }, [navigation]);

  useEffect(() => {
    if (passwordInput.length === 4) {
      if (passwordInput === storedPassword) {
        // 비밀번호가 일치하면 Home으로 이동 (스택 초기화)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        // 비밀번호가 일치하지 않으면 에러 표시 후 초기화
        setIsError(true);
        setTimeout(() => {
          setPasswordInput('');
          setIsError(false);
        }, 1000);
      }
    }
  }, [passwordInput, storedPassword, navigation]);

  const getIndicatorLabel = () => {
    if (isError) {
      return '비밀번호가 일치하지 않습니다.\n다시 입력해주세요.';
    }
    return '비밀번호를 입력해주세요.';
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: OndoColors.get(colorState.color),
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topToolbar}>
          <View style={{ width: 44 }} />
          <Text
            style={{
              ...typography.heading2,
            }}
          >
            비밀번호 입력
          </Text>
          <View style={{ width: 44 }} />
        </View>
        
        {/* 비밀번호 UI */}
        <PasswordIndicator
          label={getIndicatorLabel()}
          password={passwordInput}
        />

        {/* 비밀번호 패드 */}
        <PasswordKeypad
          onNextInput={newInput => {
            if (isError) return; // 에러 상태일 때는 입력 무시
            
            switch (true) {
              case newInput >= 0:
                setPasswordInput(passwordInput.concat(newInput.toString()));
                break;
              default:
                setPasswordInput(passwordInput.slice(0, -1));
                break;
            }
          }}
        />
      </SafeAreaView>
    </View>
  );
};

export default PasswordUnlockPage;

const styles = StyleSheet.create({
  topToolbar: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safeArea: { gap: 20, margin: 12, flex: 1 },
});
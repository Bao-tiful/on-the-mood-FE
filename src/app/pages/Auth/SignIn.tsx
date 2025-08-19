import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { ToolbarButton } from '@/components/ToolbarButton';
import { IconName } from '@/components/Icon';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import { logIn } from '@/api/endpoints/auth';
import { saveAccessToken } from '@/utils/storage';
import InputField from '@/components/InputField';

const SignIn = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logInResult, setLogInResult] = useState('');

  return (
    <SafeAreaView style={{ margin: 16 }}>
      <View style={styles.topToolbar}>
        <ToolbarButton
          name={IconName.back}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
      <View style={{ gap: 4 }}>
        <Text>로그인</Text>
        <InputField
          value={email}
          placeholder="이메일"
          validationRules={[
            {
              condition: email.length >= 8,
              message: '8자~20자 이내',
            },
            {
              condition: /[!@#$%^&*]/.test(email),
              message: '특수문자포함',
            },
          ]}
          obscure={true}
          onChangeText={input => {
            setEmail(input);
          }}
        />
        {/* <TextInput
          style={{ backgroundColor: '#aaaaaa', padding: 8 }}
          placeholder="이메일"
          autoCapitalize="none"
          placeholderTextColor="#ffffff"
          onChangeText={v => setEmail(v)}
        /> */}
        <TextInput
          style={{ backgroundColor: '#aaaaaa', padding: 8 }}
          autoCapitalize="none"
          placeholder="비밀번호"
          placeholderTextColor="#ffffff"
          onChangeText={v => setPassword(v)}
        />
        <Button
          onPress={async () => {
            try {
              const prop = {
                username: email,
                password: password,
              };
              const result = await logIn(prop);
              setLogInResult('성공');

              await saveAccessToken(result.access);
              // 로그인 성공 시 전체 네비게이션 스택을 초기화하고 Home으로 이동
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            } catch (error) {
              setLogInResult('error');
              console.error('ERROR : ', error);
            }
          }}
          title="로그인"
          color="blue"
        />
        <Text> - 결과 : {logInResult}</Text>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  topToolbar: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
});

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
import { signUp } from '@/api/endpoints/auth';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

const SignUp = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [signUpResult, setSignUpResult] = useState('');

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
        <Text>회원가입</Text>
        <TextInput
          style={{ backgroundColor: '#aaaaaa', padding: 8 }}
          placeholder="이메일"
          autoCapitalize="none"
          placeholderTextColor="#ffffff"
          onChangeText={(v) => setEmail(v)}
        />
        <TextInput
          style={{ backgroundColor: '#aaaaaa', padding: 8 }}
          placeholder="비밀번호"
          autoCapitalize="none"
          placeholderTextColor="#ffffff"
          onChangeText={(v) => setPassword(v)}
        />
        <TextInput
          style={{ backgroundColor: '#aaaaaa', padding: 8 }}
          placeholder="닉네임"
          autoCapitalize="none"
          placeholderTextColor="#ffffff"
          onChangeText={(v) => setNickname(v)}
        />
        <Button
          onPress={async () => {
            try {
              const prop = {
                username: email,
                email: email,
                password: password,
                password2: password,
                nickname: nickname,
              };
              await signUp(prop);
              setSignUpResult('회원가입 성공! 로그인 페이지로 이동합니다.');

              // 회원가입 성공 후 SignIn 페이지로 이동
              navigation.navigate('SignIn');
            } catch (error) {
              setSignUpResult('error');
              console.error('ERROR : ', error);
            }
          }}
          title="회원가입"
          color="blue"
        />
        <Text> - 결과 : {signUpResult}</Text>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  topToolbar: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
});

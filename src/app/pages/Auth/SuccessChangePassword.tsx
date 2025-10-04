import React from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import Icon, { IconName } from '@/components/Icon';
import { ActionButton } from '@/components/ActionButton';
import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';

const SuccessChangePassword = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleGoToSignIn = () => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'Entrance' }, { name: 'SignIn' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name={IconName.check} size={80} color={Colors.black100} />
        </View>

        <Text style={styles.title}>비밀번호 재설정 성공</Text>

        <Text style={styles.subtitle}>
          비밀번호 변경이 완료되었어요.{'\n'}
          보안을 위해 로그인을 진행해주세요.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <ActionButton title="로그인 하기" onPress={handleGoToSignIn} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white100,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    ...typography.heading2,
    color: Colors.black100,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    ...typography.body2,
    color: Colors.black40,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
});

export default SuccessChangePassword;

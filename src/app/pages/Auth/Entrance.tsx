import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import SignInButton, { SignInType } from '@/components/login/SignInButton';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import Logo from '@/components/Logo';
import LinearGradient from 'react-native-linear-gradient';

const EntrancePage = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <LinearGradient
      colors={['#F1FEFB', '#D7F5BA', '#8DF5F9']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Logo width={186} />
            <Text style={styles.catchphrase}>
              <Text style={styles.catchphraseEmphasis}>온도</Text>로 느끼고,
              {'\n'}
              <Text style={styles.catchphraseEmphasis}>색</Text>
              으로 기록하다.
            </Text>
          </View>

          <View style={styles.signInButtonContainer}>
            <SignInButton
              type={SignInType.google}
              onPress={() => {
                console.log('google');
              }}
            />
            <SignInButton
              type={SignInType.apple}
              onPress={() => {
                console.log('apple');
              }}
            />
            {/* TODO: 이메일로 로그인 부분은 나중에 디자인 나오면 수정하기 */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                paddingHorizontal: 40,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  // TODO: Navigate to SignUp - need to set up screen name
                  navigation.navigate('SignUp');
                }}
              >
                <Text>회원가입</Text>
              </TouchableOpacity>
              <Text>|</Text>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  // TODO: Navigate to SignIn - need to set up screen name
                  navigation.navigate('SignIn');
                }}
              >
                <Text>이메일로 로그인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default EntrancePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    paddingHorizontal: 16,
    gap: 40,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  logoContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  signInButtonContainer: {
    width: '100%',
    gap: 16,
  },
  catchphrase: {
    ...typography.headline,
    color: Colors.black40,
    lineHeight: 26,
  },
  catchphraseEmphasis: {
    fontWeight: 'bold',
    color: Colors.black70,
  },
});

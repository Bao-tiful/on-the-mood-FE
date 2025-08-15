import { Colors } from '@/styles/Colors';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon, { IconName } from '../Icon';
import typography from '@/styles/Typography';

export enum SignInType {
  google,
  apple,
}

const SignInButton = ({
  type,
  onPress,
}: {
  type: SignInType;
  onPress: () => void;
}) => {
  let backgroundColor = Colors.white100;
  let labelColor = Colors.black100;
  let logoIconName: IconName;
  let label = '';

  switch (type) {
    case SignInType.google:
      backgroundColor = Colors.white100;
      labelColor = Colors.black100;
      logoIconName = IconName.googleLogo;
      label = 'Google로 로그인';
      break;

    case SignInType.apple:
      backgroundColor = Colors.black100;
      labelColor = Colors.white100;
      logoIconName = IconName.appleLogo;
      label = 'Apple로 로그인';
      break;
  }

  return (
    <TouchableOpacity
      style={{
        ...styles.signInButton,
        backgroundColor: backgroundColor,
      }}
      onPress={onPress}
    >
      <View style={styles.signInButtonIcon}>
        <Icon name={logoIconName} />
      </View>
      <Text
        style={{
          ...styles.signInButtonLabel,
          color: labelColor,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default SignInButton;

const styles = StyleSheet.create({
  signInButton: {
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    flexDirection: 'row', // 아이콘과 텍스트를 가로 정렬
  },
  signInButtonIcon: { position: 'absolute', left: 16 },
  signInButtonLabel: {
    ...typography.body,
    fontWeight: '700',
    textAlign: 'center', // 텍스트 중앙 정렬
  },
});

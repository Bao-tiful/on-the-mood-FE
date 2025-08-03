import typography from '@/styles/Typography';
import { View, Text } from 'react-native';

import Icon, { IconName } from '../Icon';
import { Colors } from '@/styles/Colors';

export enum AuthType {
  'google',
  'apple',
}

export const AuthInfo = ({
  authType,
  email,
}: {
  authType: AuthType;
  email: string;
}) => {
  let iconName = IconName.googleLogo;
  let backgroundColor = Colors.white100;

  switch (authType) {
    case AuthType.google:
      iconName = IconName.googleLogo;
      backgroundColor = Colors.white100;
      break;
    case AuthType.apple:
      iconName = IconName.appleLogo;
      backgroundColor = Colors.black100;
      break;
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: backgroundColor,
          borderRadius: '50%',
        }}
      >
        <Icon name={iconName} size={12} />
      </View>
      <Text style={typography.headline}>{email}</Text>
    </View>
  );
};

import { Text, View } from 'react-native';
import React from 'react';
import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';

type PasswordIndicator = {
  label: string;
  password: string;
};

const PasswordIndicator = ({ label, password }: PasswordIndicator) => {
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 100,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ gap: 32 }}>
        <Text
          style={{ ...typography.heading2, textAlign: 'center', minHeight: 48 }}
        >
          {label}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            gap: 24,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PasswordCell isValid={password.length >= 1} />
          <PasswordCell isValid={password.length >= 2} />
          <PasswordCell isValid={password.length >= 3} />
          <PasswordCell isValid={password.length >= 4} />
        </View>
      </View>
    </View>
  );
};

const PasswordCell = ({ isValid }: { isValid: boolean }) => {
  return (
    <View
      style={{
        width: 14,
        height: 14,
        borderRadius: 1000,
        backgroundColor: isValid ? Colors.black100 : Colors.black18,
      }}
    />
  );
};

export default PasswordIndicator;

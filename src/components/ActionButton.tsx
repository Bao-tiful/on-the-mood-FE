import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import typography from '@/styles/Typography';
import { Colors } from '@/styles/Colors';

type ButtonVariant = 'default' | 'disabled' | 'cancel';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
}

export const ActionButton = ({
  title,
  onPress,
  variant = 'default',
}: ActionButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    if (variant === 'default') {
      setIsPressed(true);
    }
  };

  const handlePressOut = () => {
    if (variant === 'default') {
      setIsPressed(false);
    }
  };

  const getButtonStyle = () => {
    if (variant === 'disabled') return styles.buttonDisabled;
    if (variant === 'cancel') return styles.buttonCancel;
    if (isPressed) return styles.buttonPressed;
    return styles.buttonDefault;
  };

  const getLabelStyle = () => {
    if (variant === 'disabled') return styles.buttonLabelDisabled;
    if (variant === 'cancel') return styles.buttonLabelCancel;
    return styles.buttonLabelDefault;
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle()]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={variant === 'disabled'}
    >
      <Text style={[styles.buttonLabel, getLabelStyle()]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 28,
  },
  buttonDefault: {
    backgroundColor: Colors.black100,
  },
  buttonDisabled: {
    backgroundColor: Colors.black18,
  },
  buttonCancel: {
    backgroundColor: Colors.black18,
  },
  buttonPressed: {
    backgroundColor: Colors.gray,
  },
  buttonLabel: {
    ...typography.body,
    fontWeight: 600,
  },
  buttonLabelDefault: {
    color: Colors.white100,
  },
  buttonLabelDisabled: {
    color: Colors.white100,
  },
  buttonLabelCancel: {
    color: Colors.black70,
  },
});

import React from 'react';
import { SwitchProps, StyleSheet } from 'react-native';
import { Colors } from '@/styles/Colors';
import ToggleSwitch from 'toggle-switch-react-native';

interface CustomSwitchProps extends SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
  ...props
}) => {
  return (
    <ToggleSwitch
      isOn={value}
      onColor={Colors.black100}
      offColor={Colors.black32}
      size="small"
      onToggle={isOn => onValueChange(isOn)}
      style={[styles.switch, props.style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});

export default CustomSwitch;

import React from 'react';
import { Switch, SwitchProps, StyleSheet } from 'react-native';
import { Colors } from '@/styles/Colors';

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
    <Switch
      value={value}
      trackColor={{ false: Colors.black18, true: Colors.black100 }}
      thumbColor={value ? Colors.white100 : Colors.white100}
      onValueChange={onValueChange}
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

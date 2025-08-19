import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, OndoColors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import Icon, { IconName } from './Icon';

interface ValidationRule {
  condition: boolean;
  message: string;
}

interface InputFieldProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  obscure?: boolean;
  validationRules?: ValidationRule[];
  showTimer?: boolean;
  timerDuration?: number; // seconds, default 180 (3:00)
  onTimerEnd?: () => void;
  onValidationChange?: (isValid: boolean) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  obscure = false,
  validationRules = [],
  showTimer = false,
  timerDuration = 180,
  onTimerEnd,
  onValidationChange,
}) => {
  const [isObscured, setIsObscured] = useState(obscure);
  const [timeLeft, setTimeLeft] = useState(timerDuration);

  useEffect(() => {
    if (showTimer && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            onTimerEnd?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showTimer, timeLeft, onTimerEnd]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const toggleObscure = () => {
    setIsObscured(!isObscured);
  };

  // Check if there are validation errors (only for single validation rule)
  const hasValidationError = validationRules.length === 1 && value.length > 0 && !validationRules[0].condition;
  
  // Check if all validation rules are satisfied
  const isAllValid = validationRules.length > 0 && validationRules.every(rule => rule.condition);
  
  // Call validation change callback when validation state changes
  useEffect(() => {
    if (onValidationChange && validationRules.length > 0) {
      onValidationChange(isAllValid);
    }
  }, [isAllValid, onValidationChange, validationRules.length]);

  // Determine text color (always black when there's text, gray when empty)
  const getTextColor = () => {
    if (value.length > 0) return Colors.black100;
    return Colors.black32;
  };

  // Determine border color (red when validation error, otherwise same as text)
  const getBorderColor = () => {
    if (hasValidationError) return OndoColors.get(40) || '#F86262';
    if (value.length > 0) return Colors.black100;
    return Colors.black32;
  };

  const textColor = getTextColor();
  const borderColor = getBorderColor();

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { borderBottomColor: borderColor }]}>
        <TextInput
          style={[styles.textInput, { color: textColor }]}
          placeholder={placeholder}
          placeholderTextColor={Colors.black32}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={obscure && isObscured}
        />

        {/* Right side content */}
        <View style={styles.rightContent}>
          {showTimer && (
            <Text
              style={[styles.timerText, timeLeft === 0 && styles.timerExpired]}
            >
              {formatTime(timeLeft)}
            </Text>
          )}

          {obscure && (
            <Pressable onPress={toggleObscure} style={styles.eyeButton}>
              <Icon 
                name={IconName.eye} 
                size={20} 
                color={isObscured ? Colors.gray : Colors.black100} 
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* Validation messages */}
      {validationRules.length > 0 && (
        <View style={styles.validationContainer}>
          {validationRules.length === 1 ? (
            // Single validation rule - only show when there's input and condition fails
            value.length > 0 && !validationRules[0].condition && (
              <Text style={[styles.validationText, styles.validationTextError]}>
                {validationRules[0].message}
              </Text>
            )
          ) : (
            // Multiple validation rules - always show all with status
            <View style={styles.validationGrid}>
              {validationRules.map((rule, index) => (
                <View key={index} style={styles.validationItem}>
                  <Text
                    style={[
                      styles.validationText,
                      rule.condition ? styles.validationTextValid : styles.validationTextInvalid,
                    ]}
                  >
                    {rule.message}
                  </Text>
                  <Icon 
                    name={IconName.check} 
                    size={14} 
                    color={rule.condition ? (OndoColors.get(-40) || '#4CAF50') : Colors.black40} 
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    paddingVertical: 0,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timerText: {
    ...typography.label2,
    color: Colors.black100,
  },
  timerExpired: {
    color: Colors.gray,
  },
  eyeButton: {
    padding: 4,
  },
  validationContainer: {
    marginTop: 12,
    gap: 8,
  },
  validationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  validationText: {
    ...typography.label3,
    color: Colors.gray,
  },
  validationTextError: {
    color: OndoColors.get(40) || '#F86262',
  },
  validationTextValid: {
    color: OndoColors.get(-40) || '#4CAF50',
  },
  validationTextInvalid: {
    color: Colors.black40,
  },
});

export default InputField;

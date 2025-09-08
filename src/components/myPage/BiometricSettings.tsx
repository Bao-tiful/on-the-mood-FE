import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import typography from '@/styles/Typography';

interface BiometricSettingsProps {
  onBiometricSettingsChange?: (enabled: boolean) => void;
}

const BiometricSettings: React.FC<BiometricSettingsProps> = ({
  onBiometricSettingsChange,
}) => {
  const {
    canUseBiometric,
    isBiometricEnabled,
    setBiometricEnabled,
    getBiometricTypeName,
    biometricCapabilities,
  } = useBiometricAuth();

  const [isToggling, setIsToggling] = useState(false);

  const handleToggleBiometric = async (value: boolean) => {
    if (isToggling) return;

    setIsToggling(true);

    try {
      if (value && !biometricCapabilities.available) {
        Alert.alert(
          '생체인식 사용 불가',
          '이 기기에서는 생체인식을 사용할 수 없습니다.\n설정에서 생체인식을 등록해주세요.',
          [{ text: '확인' }]
        );
        setIsToggling(false);
        return;
      }

      const success = await setBiometricEnabled(value);
      
      if (success) {
        onBiometricSettingsChange?.(value);
        
        if (value) {
          Alert.alert(
            '생체인식 활성화',
            `${getBiometricTypeName()}이 활성화되었습니다.\n다음번 앱 실행 시부터 생체인식으로 잠금을 해제할 수 있습니다.`,
            [{ text: '확인' }]
          );
        }
      } else {
        Alert.alert(
          '설정 저장 실패',
          '생체인식 설정을 저장하는 중 오류가 발생했습니다.',
          [{ text: '확인' }]
        );
      }
    } catch (error) {
      console.error('생체인식 설정 변경 중 오류:', error);
      Alert.alert(
        '오류 발생',
        '설정 변경 중 오류가 발생했습니다.',
        [{ text: '확인' }]
      );
    } finally {
      setIsToggling(false);
    }
  };

  // 생체인식을 사용할 수 없는 경우 컴포넌트를 렌더링하지 않음
  if (!canUseBiometric) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>생체인식 사용</Text>
          <Text style={styles.description}>
            비밀번호 대신 생체인식으로 앱 잠금을 해제합니다.
          </Text>
        </View>
        <Switch
          value={isBiometricEnabled}
          onValueChange={handleToggleBiometric}
          disabled={isToggling}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isBiometricEnabled ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    ...typography.body,
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
});

export default BiometricSettings;
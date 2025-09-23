import React, { useState, useCallback } from 'react';
import { Switch, Alert, View, StyleSheet } from 'react-native';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { Colors } from '@/styles/Colors';
import Toast from 'react-native-toast-message';
import { SectionContent } from '@/components/myPage/SectionItem';
import { useFocusEffect } from '@react-navigation/native';
import AlertModal from '@/components/feedback/AlertModal';

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
    loadBiometricEnabled,
    authenticateBiometricForSetup,
  } = useBiometricAuth();

  const [isToggling, setIsToggling] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);

  // 페이지 포커스 시 생체인식 상태 새로고침
  useFocusEffect(
    useCallback(() => {
      loadBiometricEnabled();
    }, [loadBiometricEnabled])
  );

  const handleToggleBiometric = async (value: boolean) => {
    if (isToggling) return;

    if (value) {
      // 생체인식 활성화 시 - Dialog 표시
      if (!biometricCapabilities.available) {
        Alert.alert(
          '생체인식 사용 불가',
          '이 기기에서는 생체인식을 사용할 수 없습니다.\n설정에서 생체인식을 등록해주세요.',
          [{ text: '확인' }]
        );
        return;
      }
      setShowBiometricModal(true);
    } else {
      // 생체인식 비활성화 시 - 즉시 처리
      handleBiometricDisable();
    }
  };

  // 생체인식 설정 '예' 선택 시
  const handleBiometricEnable = async () => {
    setShowBiometricModal(false);
    setIsToggling(true);
    
    try {
      // 먼저 생체인증을 요청 (설정용 - 활성화 상태와 무관)
      const authResult = await authenticateBiometricForSetup();
      
      if (authResult.success) {
        // 생체인증 성공 시 설정 저장
        const success = await setBiometricEnabled(true);
        if (success) {
          onBiometricSettingsChange?.(true);
          // Toast 메시지로 성공 알림
          Toast.show({
            type: 'info',
            text1: '생체인식 잠금해제를 설정했어요',
            visibilityTime: 2000,
          });
        } else {
          Alert.alert(
            '설정 실패',
            '생체인식 설정을 저장하는 중 오류가 발생했습니다.',
            [{ text: '확인' }]
          );
        }
      } else {
        // 생체인증 실패 시 설정하지 않음
        if (authResult.error && !authResult.error.includes('취소')) {
          Alert.alert('생체인증 실패', authResult.error);
        }
      }
    } catch (error) {
      console.error('생체인증 중 오류:', error);
      Alert.alert('오류', '생체인증 중 오류가 발생했습니다.');
    } finally {
      setIsToggling(false);
    }
  };

  // 생체인식 설정 '아니오' 선택 시
  const handleBiometricCancel = () => {
    setShowBiometricModal(false);
  };

  // 생체인식 비활성화 처리
  const handleBiometricDisable = async () => {
    setIsToggling(true);

    try {
      const success = await setBiometricEnabled(false);
      
      if (success) {
        onBiometricSettingsChange?.(false);
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
    <>
      <SectionContent label="생체인식 사용">
        <View style={styles.switchContainer}>
          <Switch
            value={isBiometricEnabled}
            onValueChange={handleToggleBiometric}
            disabled={isToggling}
            trackColor={{ false: '#767577', true: Colors.black100 }}
            thumbColor={Colors.white100}
          />
        </View>
      </SectionContent>

      {/* 생체인식 설정 Modal */}
      <AlertModal
        isModalVisible={showBiometricModal}
        title="생체인식 설정"
        content={`비밀번호 대신 ${getBiometricTypeName()}을 사용하여 앱 잠금을 해제하시겠습니까?`}
        primaryLabel="예"
        secondaryLabel="아니오"
        onPressPrimary={handleBiometricEnable}
        onPressSecondary={handleBiometricCancel}
        dismissHandler={handleBiometricCancel}
      />
    </>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 84,
    alignItems: 'flex-end',
  },
});

export default BiometricSettings;
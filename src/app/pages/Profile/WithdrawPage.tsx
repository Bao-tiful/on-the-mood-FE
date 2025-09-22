import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { IconName } from '@/components/Icon';
import Icon from '@/components/Icon';
import { ToolbarButton } from '@/components/ToolbarButton';
import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import { useBackgroundColor } from '@/hooks/useBackgroundColor';
import { ActionButton } from '@/components/ActionButton';
import { withdraw } from '@/api/endpoints/auth';
import AnimatedColorView from '@/components/editpage/AnimatedColorView';

const WithdrawPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<RootStackParamList, 'WithdrawPage'>>();
  const { currentTemperature } = route.params || {};
  const { colorState } = useBackgroundColor();
  const [isWithdrawEnabled, setIsWithdrawEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // MyPage에서 전달된 온도값 사용, 없으면 colorState 사용
  const displayTemperature = currentTemperature ?? colorState.color;

  const handleWithdraw = async () => {
    if (!isWithdrawEnabled || isLoading) return;

    setIsLoading(true);
    try {
      await withdraw();
      // 탈퇴 성공 시 Entrance 페이지로 이동
      navigation.reset({
        index: 0,
        routes: [{ name: 'Entrance' }],
      });
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      Alert.alert('오류', '회원 탈퇴 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedColorView
      style={{ flex: 1 }}
      activeIndex={displayTemperature + 40} // index.tsx에서 전달된 온도값 사용
      duration={300} // 부드러운 애니메이션
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Toolbar */}
        <View style={styles.topToolbar}>
          <ToolbarButton
            name={IconName.back}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Text
            style={{
              ...typography.heading2,
              color: Colors.black100,
            }}
          >
            화원 탈퇴
          </Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Body Content */}
        <View style={styles.bodyContainer}>
          {/* Caution Icon and Title */}
          <View style={styles.headerSection}>
            <Icon name={IconName.caution} size={100} color={Colors.black100} />
            <Text
              style={[
                typography.heading2,
                {
                  color: Colors.black100,
                  textAlign: 'center',
                  marginTop: 32,
                },
              ]}
            >
              탈퇴 전 확인하세요.
            </Text>
          </View>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Text
              style={[
                typography.body2,
                {
                  color: Colors.black40,
                  textAlign: 'center',
                },
              ]}
            >
              {`가입시 수집한 개인정보(이메일)를 포함하여\n작성한 모든 일기가 영구적으로 삭제되며\n다시는 복구할 수 없습니다.`}
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={styles.textButton}
            onPress={() => setIsWithdrawEnabled(!isWithdrawEnabled)}
          >
            <Icon
              name={
                isWithdrawEnabled
                  ? IconName.checkCircle
                  : IconName.uncheckCircle
              }
              size={24}
              color={isWithdrawEnabled ? Colors.black100 : Colors.black40}
            />
            <Text style={styles.textButtonLabel}>
              {`안내사항을 확인하였으며 이에 동의합니다`}
            </Text>
          </TouchableOpacity>
          <ActionButton
            title={isLoading ? '처리 중...' : '탈퇴하기'}
            onPress={handleWithdraw}
            variant={isWithdrawEnabled && !isLoading ? 'default' : 'disabled'}
          />
        </View>
      </SafeAreaView>
    </AnimatedColorView>
  );
};

export default WithdrawPage;

const styles = StyleSheet.create({
  safeArea: {
    gap: 20,
    margin: 16,
    flex: 1,
  },
  topToolbar: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  headerSection: {
    alignItems: 'center',
  },
  warningBox: {
    marginTop: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: Colors.black18,
    alignSelf: 'stretch',
  },
  textButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    marginBottom: 12,
  },
  textButtonLabel: {
    ...typography.body2,
    color: Colors.black100,
  },
});

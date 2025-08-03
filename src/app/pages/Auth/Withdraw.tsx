import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ToolbarButton } from '@/components/ToolbarButton';
import Icon, { IconName } from '@/components/Icon';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import typography from '@/styles/Typography';
import { Colors, OndoColors } from '@/styles/Colors';
import { useBackgroundColor } from '@/hooks/useBackgroundColor';

const Withdraw = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [readCaution, setReadCaution] = useState(false);
  const { colorState } = useBackgroundColor();

  return (
    <View
      style={{ flex: 1, backgroundColor: OndoColors.get(colorState.color) }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topToolbar}>
          <ToolbarButton
            name={IconName.back}
            onPress={async () => {
              navigation.goBack();
            }}
          />
          <Text style={typography.heading2}>회원 탈퇴</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.content}>
          {/* 안내문구 */}
          <View style={{ alignItems: 'center' }}>
            <Icon name={IconName.caution} size={100} />
            <View style={{ height: 32 }} />
            <Text style={typography.heading2}>탈퇴 전 확인하세요.</Text>
            <View style={{ height: 16 }} />
            <View style={styles.cautionBox}>
              <Text style={styles.caution}>
                가입시 수집한 개인정보(이메일)를 포함하여 {'\n'}
                작성한 모든 일기가 영구적으로 삭제되며 {'\n'}
                다시는 복구할 수 없습니다.
              </Text>
            </View>
          </View>
          {/* 하단버튼 */}
          <View style={{ alignItems: 'center', gap: 24 }}>
            <TouchableOpacity
              onPress={() => {
                setReadCaution(!readCaution);
              }}
            >
              <View style={styles.cautionAgreeToggle}>
                <Icon
                  name={
                    readCaution ? IconName.checkCircle : IconName.uncheckCircle
                  }
                  size={24}
                />
                <Text style={[typography.body2]}>
                  안내사항을 확인하였으며 이에 동의합니다.
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={!readCaution}
              style={[
                styles.bottomSheetButton,
                {
                  backgroundColor: readCaution
                    ? Colors.black100
                    : Colors.black18,
                },
              ]}
              onPress={() => {
                // 회원 탈퇴 로직 구현하기
              }}
            >
              <Text style={[typography.body, { color: Colors.white100 }]}>
                탈퇴하기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Withdraw;

const styles = StyleSheet.create({
  topToolbar: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  bottomSheetButton: {
    backgroundColor: 'orange',
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 50,
  },
  cautionBox: {
    backgroundColor: Colors.black18,
    width: '100%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  caution: { ...typography.body2, textAlign: 'center', color: Colors.black40 },
  cautionAgreeToggle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

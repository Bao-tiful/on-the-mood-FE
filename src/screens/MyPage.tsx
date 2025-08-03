import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors, OndoColors } from '@/styles/Colors';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import { ToolbarButton } from '@/components/ToolbarButton';
import Icon, { IconName } from '@/components/Icon';
import typography from '@/styles/Typography';
import { NotiTimePicker } from '@/components/myPage/NotiTimePicker';
import { AuthInfo, AuthType } from '@/components/myPage/AuthInfo';
import {
  SectionContent,
  SectionTitle,
} from '@/components/myPage/SectionItem';
import NotiTimeButton from '@/components/myPage/NotiTimeButton';

import { PermissionsAndroid, Platform } from 'react-native';
import { Meridiem, NotiTime } from '@/models/NotiTime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBackgroundColor } from '@/hooks/useBackgroundColor';

const MyPage = () => {
  const { colorState } = useBackgroundColor();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [isAlertOn, setIsAlertOn] = useState(false);
  const [notiTime, setNotiTime] = useState<NotiTime>({
    hour: 0,
    meridiem: Meridiem.AM,
    minute: 0,
  });
  const [isPasswordOn, setIsPasswordOn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadNotiTime = async () => {
      if (isAlertOn) {
        const notiTimeString = await AsyncStorage.getItem('@NotiTime');

        if (notiTimeString) {
          const parsedNotiTime = JSON.parse(notiTimeString);
          setNotiTime(parsedNotiTime);
          console.log(notiTimeString);
        }
      }
    };

    loadNotiTime();
  }, [isAlertOn]);

  const updatePasswordRequirement = async (newState: boolean) => {
    setIsPasswordOn(newState);

    if (newState) {
      // 화면 잠금을 추가하는 경우 비밀번호 설정 페이지로 이동
      navigation.navigate('PasswordPage');
    } else {
      // 화면 잠금을 제거하는 경우 현재 저장된 비밀번호 삭제
      await AsyncStorage.removeItem('@password');
    }
  };

  // 페이지가 전환될 때 패스워드가 잘 저장되어있는지 확인
  // 만약 패스워드가 없거나 유효하지 않다면 패스워드가 저장되지 않은 상태로 간주
  useFocusEffect(
    useCallback(() => {
      const loadPassword = async () => {
        const currentPassword = await AsyncStorage.getItem('@password');
        if (currentPassword && currentPassword.length === 4) {
          setIsPasswordOn(true);
        } else {
          setIsPasswordOn(false);
        }
      };

      loadPassword();
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: OndoColors.get(colorState.color),
      }}
    >
      <SafeAreaView style={styles.safeArea}>
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
            }}
          >
            내 정보
          </Text>
          {/* 내 정보 타이틀의 가운데 배치를 위해 여백 추가 */}
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.list}>
          {/* 계정 정보 */}
          <View style={styles.section}>
            <SectionContent>
              <AuthInfo authType={AuthType.apple} email={'hello@world.com'} />
            </SectionContent>
          </View>
          {/* 알림 설정 */}
          <View style={styles.section}>
            <SectionTitle label="알림 설정" />
            <SectionContent label="기록 시간 알림">
              <Switch
                value={isAlertOn}
                trackColor={{ true: Colors.black100 }}
                onValueChange={async value => {
                  // 알림 켜기
                  if (value) {
                    try {
                      if (Platform.OS === 'android') {
                        // Android에서 알림 권한 요청
                        const granted = await PermissionsAndroid.request(
                          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                          {
                            title: '알림 권한',
                            message: '알림을 받으시겠습니까?',
                            buttonNeutral: '나중에',
                            buttonNegative: '거부',
                            buttonPositive: '허용',
                          },
                        );

                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                          setIsAlertOn(value);
                          // TODO: 알림 등록하기 삽입
                        } else {
                          Alert.alert(
                            '알림 권한이 필요합니다',
                            '설정에서 알림을 허용해주세요.',
                          );
                        }
                      } else {
                        // iOS는 알림 권한이 자동으로 처리됨
                        setIsAlertOn(value);
                        // TODO: 알림 등록하기 삽입
                      }
                    } catch (error) {
                      console.error('알림 권한 요청 오류:', error);
                      Alert.alert('오류', '알림 권한을 확인할 수 없습니다.');
                    }
                  }
                  // 알림 끄기
                  else {
                    setIsAlertOn(false);
                    // TODO: 등록된 알림 제거
                  }
                }}
              />
            </SectionContent>

            {isAlertOn ? (
              <SectionContent label="시간">
                <NotiTimeButton
                  onPress={() => {
                    setModalVisible(true);
                  }}
                  timeString={`${notiTime.meridiem} ${notiTime.hour
                    .toString()
                    .padStart(2, '0')}:${notiTime.minute
                    .toString()
                    .padStart(2, '0')}`}
                />
              </SectionContent>
            ) : null}
          </View>
          {/* 화면 잠금 설정 */}
          <View style={styles.section}>
            <SectionTitle label="화면 잠금" />
            <SectionContent label="비밀번호">
              <Switch
                value={isPasswordOn}
                trackColor={{ true: Colors.black100 }}
                onValueChange={value => {
                  updatePasswordRequirement(value);
                }}
              />
            </SectionContent>

            {isPasswordOn ? (
              <SectionContent>
                {/* 셀 전체 터치를 위해 label을 child에 포함*/}
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    navigation.navigate('PasswordPage');
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={styles.sectionContentLabel}>
                      비밀번호 변경
                    </Text>
                    <Icon name={IconName.arrow} />
                  </View>
                </TouchableOpacity>
              </SectionContent>
            ) : null}
          </View>
          {/* 개발용 */}
          <View style={styles.section}>
            <SectionTitle label="개발용 / 삭제 예정" />
            <SectionContent>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  navigation.navigate('Entrance');
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={styles.sectionContentLabel}>로그인</Text>
                  <Icon name={IconName.arrow} />
                </View>
              </TouchableOpacity>
            </SectionContent>
          </View>
        </View>
      </SafeAreaView>
      <NotiTimePicker
        initialTime={notiTime}
        modalVisible={modalVisible}
        changeModalVisible={v => {
          setModalVisible(v);
        }}
        changeNotiTime={newNotiTime => {
          setNotiTime(newNotiTime);
          AsyncStorage.setItem('@NotiTime', JSON.stringify(newNotiTime));
        }}
      />
    </View>
  );
};

export default MyPage;

const styles = StyleSheet.create({
  topToolbar: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safeArea: { gap: 20, margin: 12 },
  list: { gap: 16, paddingVertical: 16 },
  section: {
    gap: 24,
  },
  sectionTitle: {
    marginVertical: 16,
  },
  sectionTitleLabel: {
    ...typography.headline,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black18,
  },
  sectionContentLabel: {
    ...typography.body,
  },
});

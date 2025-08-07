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
import { SectionContent, SectionTitle } from '@/components/myPage/SectionItem';
import NotiTimeButton from '@/components/myPage/NotiTimeButton';

import { Meridiem, NotiTime } from '@/models/NotiTime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBackgroundColor } from '@/hooks/useBackgroundColor';
import { useNotifications } from '@/hooks/useNotifications';

// 시간 변환 유틸리티 함수들
const convertTo24Hour = (notiTime: NotiTime): number => {
  if (notiTime.meridiem === Meridiem.PM && notiTime.hour !== 12) {
    return notiTime.hour + 12;
  }
  if (notiTime.meridiem === Meridiem.AM && notiTime.hour === 12) {
    return 0;
  }
  return notiTime.hour;
};

const formatTimeString = (notiTime: NotiTime): string => {
  const time24 = convertTo24Hour(notiTime);
  return `${String(time24).padStart(2, '0')}:${String(notiTime.minute).padStart(2, '0')}`;
};

const formatDisplayTime = (notiTime: NotiTime): string => {
  return `${notiTime.meridiem} ${notiTime.hour
    .toString()
    .padStart(2, '0')}:${notiTime.minute
    .toString()
    .padStart(2, '0')}`;
};

const parseTimeStringToNotiTime = (timeString: string): NotiTime => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return {
    hour: hours > 12 ? hours - 12 : hours === 0 ? 12 : hours,
    meridiem: hours >= 12 ? Meridiem.PM : Meridiem.AM,
    minute: minutes,
  };
};

// 상수
const DEFAULT_USER_EMAIL = 'hello@world.com'; // TODO: 실제 사용자 이메일로 교체
const PASSWORD_LENGTH = 4;

const MyPage = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colorState } = useBackgroundColor();

  // 알림 기능 초기화
  const {
    notificationSettings,
    requestPermissions,
    updateNotificationSettings,
    cancelAllNotifications,
  } = useNotifications();

  const [isAlertOn, setIsAlertOn] = useState(false);
  const [notiTime, setNotiTime] = useState<NotiTime>({
    hour: 0,
    meridiem: Meridiem.AM,
    minute: 0,
  });
  const [isPasswordOn, setIsPasswordOn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // 핸들러 함수들
  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      try {
        const granted = await requestPermissions();
        if (granted) {
          setIsAlertOn(true);
          const timeString = formatTimeString(notiTime);
          await updateNotificationSettings({ enabled: true, time: timeString });
        } else {
          Alert.alert('알림 권한이 필요합니다', '설정에서 알림을 허용해주세요.');
        }
      } catch (error) {
        console.error('알림 권한 요청 오류:', error);
        Alert.alert('오류', '알림 권한을 확인할 수 없습니다.');
      }
    } else {
      setIsAlertOn(false);
      await updateNotificationSettings({ enabled: false });
      await cancelAllNotifications();
    }
  };

  const handleNotificationTimeChange = async (newNotiTime: NotiTime) => {
    setNotiTime(newNotiTime);
    await AsyncStorage.setItem('@NotiTime', JSON.stringify(newNotiTime));
    
    if (isAlertOn) {
      const timeString = formatTimeString(newNotiTime);
      await updateNotificationSettings({ enabled: true, time: timeString });
    }
  };

  // 알림 설정 상태 동기화
  useEffect(() => {
    setIsAlertOn(notificationSettings.enabled);
    if (notificationSettings.enabled && notificationSettings.time) {
      setNotiTime(parseTimeStringToNotiTime(notificationSettings.time));
    }
  }, [notificationSettings]);

  useEffect(() => {
    const loadNotiTime = async () => {
      if (isAlertOn) {
        const notiTimeString = await AsyncStorage.getItem('@NotiTime');

        if (notiTimeString) {
          const parsedNotiTime = JSON.parse(notiTimeString);
          setNotiTime(parsedNotiTime);
        }
      }
    };

    loadNotiTime();
  }, [isAlertOn]);

  const handlePasswordToggle = async (newState: boolean) => {
    setIsPasswordOn(newState);
    
    if (newState) {
      navigation.navigate('PasswordPage');
    } else {
      await AsyncStorage.removeItem('@password');
    }
  };
  
  const handlePasswordChange = () => {
    navigation.navigate('PasswordPage');
  };

  // 페이지가 전환될 때 패스워드가 잘 저장되어있는지 확인
  // 만약 패스워드가 없거나 유효하지 않다면 패스워드가 저장되지 않은 상태로 간주
  useFocusEffect(
    useCallback(() => {
      const loadPassword = async () => {
        const currentPassword = await AsyncStorage.getItem('@password');
        setIsPasswordOn(currentPassword?.length === PASSWORD_LENGTH);
      };

      loadPassword();
    }, []),
  );

  return (
    <View
style={[styles.container, {
        backgroundColor: OndoColors.get(colorState.color),
      }]}
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
            style={[typography.heading2]}
          >
            내 정보
          </Text>
          {/* 내 정보 타이틀의 가운데 배치를 위해 여백 추가 */}
          <View style={styles.spacer} />
        </View>

        <View style={styles.list}>
          {/* 계정 정보 */}
          <View style={styles.section}>
            <SectionContent>
              <AuthInfo authType={AuthType.apple} email={DEFAULT_USER_EMAIL} />
            </SectionContent>
          </View>
          {/* 알림 설정 */}
          <View style={styles.section}>
            <SectionTitle label="알림 설정" />
            <SectionContent label="기록 시간 알림">
              <Switch
                value={isAlertOn}
                trackColor={{ true: Colors.black100 }}
                onValueChange={handleNotificationToggle}
              />
            </SectionContent>

            {isAlertOn ? (
              <SectionContent label="시간">
                <NotiTimeButton
                  onPress={() => {
                    setModalVisible(true);
                  }}
                  timeString={formatDisplayTime(notiTime)}
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
                onValueChange={handlePasswordToggle}
              />
            </SectionContent>

            {isPasswordOn ? (
              <SectionContent>
                {/* 셀 전체 터치를 위해 label을 child에 포함*/}
                <TouchableOpacity
                  style={styles.touchableContainer}
                  onPress={handlePasswordChange}
                >
                  <View style={styles.rowContainer}
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
                style={styles.touchableContainer}
                onPress={() => navigation.navigate('Entrance')}
              >
                <View style={styles.rowContainer}
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
        changeNotiTime={handleNotificationTimeChange}
      />
    </View>
  );
};

export default MyPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topToolbar: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spacer: {
    width: 44,
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
  touchableContainer: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

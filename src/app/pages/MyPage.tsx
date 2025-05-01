import {
  Alert,
  Linking,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, OndoColors } from "@/src/styles/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { ToolbarButton } from "@/src/components/ToolbarButton";
import Icon, { IconName } from "@/src/components/Icon";
import typography from "@/src/styles/Typography";
import { NotiTimePicker } from "@/src/components/myPage/NotiTimePicker";
import { AuthInfo, AuthType } from "@/src/components/myPage/AuthInfo";
import {
  SectionContent,
  SectionTitle,
} from "@/src/components/myPage/SectionItem";
import NotiTimeButton from "@/src/components/myPage/NotiTimeButton";

import * as Notifications from "expo-notifications";
import { Meridiem, NotiTime } from "@/src/models/NotiTime";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyPage = () => {
  const { customTempData: feelsLikeTempData } = useLocalSearchParams();

  const [customTemp, setCustomTemp] = useState(0);

  const [isAlertOn, setIsAlertOn] = useState(false);
  const [notiTime, setNotiTime] = useState<NotiTime>({
    hour: 0,
    meridiem: Meridiem.AM,
    minute: 0,
  });
  const [isPasswordOn, setIsPasswordOn] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    try {
      if (Array.isArray(feelsLikeTempData))
        throw new Error("feelsLikeTempData가 string[] 타입입니다");

      if (feelsLikeTempData) {
        setCustomTemp(Number(feelsLikeTempData));
      }
    } catch (error) {
      console.error("유효하지 않은 JSON을 변환하려 합니다 :", error);
    }
  }, [feelsLikeTempData]);

  useEffect(() => {
    const loadNotiTime = async () => {
      if (isAlertOn) {
        const notiTimeString = await AsyncStorage.getItem("@NotiTime");

        if (notiTimeString) {
          const parsedNotiTime = JSON.parse(notiTimeString);
          setNotiTime(parsedNotiTime);
          console.log(notiTimeString);
        }
      }
    };

    loadNotiTime();
  }, [isAlertOn]);

  return (
    <View
      style={{
        flex: 1,
        // 작성한 온도에 따른 배경색 지정
        backgroundColor: OndoColors.get(customTemp),
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topToolbar}>
          <ToolbarButton
            name={IconName.back}
            onPress={() => {
              router.back();
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
              <AuthInfo authType={AuthType.apple} email={"hello@world.com"} />
            </SectionContent>
          </View>
          {/* 알림 설정 */}
          <View style={styles.section}>
            <SectionTitle label="알림 설정" />
            <SectionContent label="기록 시간 알림">
              <Switch
                value={isAlertOn}
                trackColor={{ true: Colors.black100 }}
                onValueChange={async (value) => {
                  // 알림 켜기
                  if (value) {
                    const permissionStatus =
                      await Notifications.getPermissionsAsync();

                    console.log(permissionStatus.status);
                    // 알림 권한이 있다면 알림 켜기

                    switch (permissionStatus.status) {
                      case Notifications.PermissionStatus.UNDETERMINED:
                        await Notifications.requestPermissionsAsync();
                        break;

                      case Notifications.PermissionStatus.GRANTED:
                        setIsAlertOn(value);
                        // TODO: 알림 등록하기 삽입
                        break;
                      case Notifications.PermissionStatus.DENIED:
                        Linking.openSettings().catch(() => {
                          Alert.alert("오류", "설정을 열 수 없습니다.");
                        });
                        break;
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
                    .padStart(2, "0")}:${notiTime.minute
                    .toString()
                    .padStart(2, "0")}`}
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
                onValueChange={(value) => {
                  setIsPasswordOn(value);
                }}
              />
            </SectionContent>

            {isPasswordOn ? (
              <SectionContent>
                {/* 셀 전체 터치를 위해 label을 child에 포함*/}
                <TouchableOpacity style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
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
        </View>
      </SafeAreaView>
      <NotiTimePicker
        initialTime={notiTime}
        modalVisible={modalVisible}
        changeModalVisible={(v) => {
          setModalVisible(v);
        }}
        changeNotiTime={(newNotiTime) => {
          setNotiTime(newNotiTime);
          AsyncStorage.setItem("@NotiTime", JSON.stringify(newNotiTime));
        }}
      />
    </View>
  );
};

export default MyPage;

const styles = StyleSheet.create({
  topToolbar: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 12,
    justifyContent: "space-between",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black18,
  },
  sectionContentLabel: {
    ...typography.body,
  },
});

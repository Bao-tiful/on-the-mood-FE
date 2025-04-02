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

const MyPage = () => {
  const { customTempData } = useLocalSearchParams();

  const [customTemp, setCustomTemp] = useState(0);

  const [isAlertOn, setIsAlertOn] = useState(false);
  const [isPasswordOn, setIsPasswordOn] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    try {
      if (Array.isArray(customTempData))
        throw new Error("feelsLikeTempData가 string[] 타입입니다");

      if (customTempData) {
        setCustomTemp(Number(customTempData));
      }
    } catch (error) {
      console.error("유효하지 않은 JSON을 변환하려 합니다 :", error);
    }
  }, [customTempData]);

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
              position: "absolute",
              left: "50%",
              transform: [{ translateX: "-50%" }],
            }}
          >
            내 정보
          </Text>
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
                onValueChange={(value) => {
                  setIsAlertOn(value);
                  // 세팅 페이지로 이동할 수 있는 로직
                  if (value)
                    Linking.openSettings().catch(() => {
                      Alert.alert("오류", "설정을 열 수 없습니다.");
                    });
                }}
              />
            </SectionContent>

            {isAlertOn ? (
              <SectionContent label="시간">
                <NotiTimeButton
                  onPress={() => {
                    setModalVisible(true);
                  }}
                  timeString={"PM 08:00"}
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
        // initialDate={date}
        modalVisible={modalVisible}
        changeModalVisible={(v) => {
          setModalVisible(v);
        }}
        // changeCalendarDate={updateDate}
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

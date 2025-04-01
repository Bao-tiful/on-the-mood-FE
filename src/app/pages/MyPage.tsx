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
import BottomSheet from "@/src/components/BottomSheet";
import { Picker } from "@react-native-picker/picker";

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
      <SafeAreaView style={{ gap: 20, margin: 12 }}>
        <View style={{ gap: 4 }}>
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
        </View>
        <View style={{ gap: 16, paddingVertical: 16 }}>
          <View style={{ gap: 24 }}>
            {/* SignIn Info */}
            <View
              style={{
                paddingBottom: 24,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                borderBottomColor: Colors.black18,
                borderBottomWidth: 1,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: Colors.white100,
                  borderRadius: "50%",
                }}
              >
                <Icon name={IconName.googleLogo} size={12} />
              </View>
              <Text style={typography.headline}>hongildong@naver.com</Text>
            </View>
          </View>
          <View style={{ gap: 24 }}>
            <View style={{ marginVertical: 16 }}>
              <Text style={typography.headline}>알림 설정</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 24,
                borderBottomWidth: 1,
                borderBottomColor: Colors.black18,
              }}
            >
              <Text style={typography.body}>기록 시간 알림</Text>
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
            </View>
            {isAlertOn ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: 24,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.black18,
                }}
              >
                <Text style={typography.body}>시간</Text>
                <TouchableOpacity
                  style={{
                    padding: 8,
                    backgroundColor: Colors.black18,
                    borderRadius: 8,
                  }}
                  onPress={() => {
                    setModalVisible(true);
                  }}
                >
                  <Text style={typography.body2}>PM 08:00</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          <View style={{ gap: 24 }}>
            <View style={{ marginVertical: 16 }}>
              <Text style={typography.headline}>화면 잠금</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 24,
                borderBottomWidth: 1,
                borderBottomColor: Colors.black18,
              }}
            >
              <Text style={typography.body}>비밀번호</Text>
              <Switch
                value={isPasswordOn}
                trackColor={{ true: Colors.black100 }}
                onValueChange={(value) => {
                  setIsPasswordOn(value);
                }}
              />
            </View>

            {isPasswordOn ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: 24,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.black18,
                }}
              >
                <TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={typography.body}>비밀번호 변경</Text>
                    <Icon name={IconName.arrow} />
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
      <MyPageNotiTimePicker
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
  bottomSheetContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: "100%",
  },
  bottomSheetButton: {
    backgroundColor: Colors.black100,
    width: "100%",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    borderRadius: 28,
  },
  bottomSheetButtonLabel: {
    ...typography.body,
    fontWeight: 600,
    color: Colors.white100,
  },
  pickerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  datePicker: {
    flex: 1,
  },
  titleLable: {
    ...typography.headline,
    color: Colors.black100,
  },
});

interface BottomSheetProps {
  // initialTime: number;
  modalVisible: boolean; // boolean이면 boolean으로 명확하게 타입 지정 가능
  // changeCalendarDate: (newDate: Date) => void;
  changeModalVisible: (isModalOn: boolean) => void;
}

export const MyPageNotiTimePicker = ({
  // initialDate,
  modalVisible,
  // changeCalendarDate,
  changeModalVisible,
}: BottomSheetProps) => {
  // 모달 내에서 사용할 임시 날짜값
  const [tempDate, setTempDate] = useState(new Date());

  return (
    <View>
      <BottomSheet
        modalVisible={modalVisible}
        setModalVisible={changeModalVisible}
      >
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.titleLable}>다른 날짜 일기 보기</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.datePicker}
              selectedValue={tempDate.getFullYear().toString()}
              onValueChange={(itemValue: string) => {
                setTempDate(new Date(Number(itemValue), tempDate.getMonth()));
              }}
            >
              <Picker.Item
                label="오전"
                value="AM"
                color={Colors.black100}
                style={{
                  ...typography.body,
                  fontWeight: 600,
                  color: Colors.black100,
                }}
              />
              <Picker.Item
                label="오후"
                value="PM"
                color={Colors.black100}
                style={{
                  ...typography.body,
                  fontWeight: 600,
                  color: Colors.black100,
                }}
              />
            </Picker>
            <Picker
              style={styles.datePicker}
              selectedValue={tempDate.getMonth().toString()}
              onValueChange={(itemValue: string) => {
                // TODO: iOS에서 disable 처리 로직 따로 필요함
                setTempDate(
                  new Date(tempDate.getFullYear(), Number(itemValue))
                );
              }}
            >
              {Array.from({ length: 12 }, (_, i) => ({
                label: `${(i + 1).toString().padStart(2, "0")}`, // 1월부터 12월까지
                value: i, // 0부터 11까지
              })).map((month, index) => (
                <Picker.Item
                  key={index}
                  label={month.label}
                  value={month.value.toString()}
                  enabled={true}
                  color={Colors.black100}
                  style={{
                    ...typography.body,
                    fontWeight: 600,
                    color: Colors.black100,
                  }}
                />
              ))}
            </Picker>
            <Picker
              style={styles.datePicker}
              selectedValue={tempDate.getMonth().toString()}
              onValueChange={(itemValue: string) => {
                // TODO: iOS에서 disable 처리 로직 따로 필요함
                setTempDate(
                  new Date(tempDate.getFullYear(), Number(itemValue))
                );
              }}
            >
              {Array.from({ length: 6 }, (_, i) => ({
                label: `${(i * 10).toString().padStart(2, "0")}`,
                value: i * 10, // 0부터 11까지
              })).map((month, index) => (
                <Picker.Item
                  key={index}
                  label={month.label}
                  value={month.value.toString()}
                  enabled={true}
                  color={Colors.black100}
                  style={{
                    ...typography.body,
                    fontWeight: 600,
                    color: Colors.black100,
                  }}
                />
              ))}
            </Picker>
          </View>
          <TouchableOpacity
            style={styles.bottomSheetButton}
            onPress={() => {
              // changeCalendarDate(tempDate);
              changeModalVisible(false);
            }}
          >
            <Text style={styles.bottomSheetButtonLabel}>변경하기</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

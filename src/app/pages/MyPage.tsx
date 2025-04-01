import {
  FlatList,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, OndoColors } from "@/src/styles/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { ToolbarButton } from "@/src/components/ToolbarButton";
import Icon, { IconName } from "@/src/components/Icon";
import typography from "@/src/styles/Typography";
import { toDateString } from "@/src/utils/dateUtils";

const MyPage = () => {
  const { customTempData } = useLocalSearchParams();

  const [customTemp, setCustomTemp] = useState(0);

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
        <View style={{ gap: 16 }}>
          <View style={{ gap: 24 }}>
            {/* SignIn Info */}
            <View
              style={{
                paddingVertical: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
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
            <View
              style={{
                height: 1,
                backgroundColor: Colors.black18,
              }}
            />
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
              }}
            >
              <Text style={typography.body}>기록 시간 알림</Text>
              <Switch />
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: Colors.black18,
              }}
            />
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
              }}
            >
              <Text style={typography.body}>비밀번호</Text>
              <Switch />
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: Colors.black18,
              }}
            />
          </View>
        </View>
      </SafeAreaView>
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
});

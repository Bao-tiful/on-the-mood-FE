import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { OndoColors } from "@/src/styles/Colors";
import { router, useLocalSearchParams } from "expo-router";
import { ToolbarButton } from "@/src/components/ToolbarButton";
import { IconName } from "@/src/components/Icon";
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
          {/* <Text>MyPage</Text> */}
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

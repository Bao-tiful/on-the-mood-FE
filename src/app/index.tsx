import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { IconName } from "../components/Icon";
import { ToolbarButton } from "../components/ToolbarButton";
import Calendar from "../components/calendar/Calendar";
import Threads from "../components/calendar/Threads";
import { Colors, OndoColors } from "../styles/Colors";

export default function HomeScreen() {
  const [isGridMode, setIsGreedMode] = useState(true);
  const [date, setDate] = useState(new Date());

  const [todayColor, setTodayColor] = useState(Colors.white100);

  useEffect(() => {
    // TODO: 오늘의 색상값을 페이지 로드 시 가져오기
    setTodayColor(OndoColors.get(4) ?? Colors.white100);
  }, []);

  const updateDate = (newDate: Date) => {
    setDate(newDate);
  };

  return (
    <View style={[styles.background, { backgroundColor: todayColor }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topToolbar}>
          <ToolbarButton
            name={IconName.profile}
            onPress={async () => {
              router.push("/pages/MyPage");
            }}
          />
          <ToolbarButton
            name={IconName.list}
            onPress={() => {
              setIsGreedMode(!isGridMode);
            }}
          />
        </View>
        {isGridMode ? (
          <Calendar date={date} updateDate={updateDate} />
        ) : (
          <Threads />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    margin: 16,
    alignItems: "center",
  },
  topToolbar: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 12,
    justifyContent: "space-between",
  },
});

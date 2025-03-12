import typography from "@/constants/Typography";
import { Link, Stack } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import Calendar from "../components/calendar/Calendar";
import Threads from "../components/calendar/Threads";
import { ToolbarButton } from "../components/ToolbarButton";
import { IconName } from "../components/Icon";

export default function HomeScreen() {
  const [isGridMode, setIsGreedMode] = useState(true);

  // TODO: 오늘의 색상값을 페이지 로드 시 가져오기
  const todayColor = "#D7F5BA";

  return (
    <View style={[styles.background, { backgroundColor: todayColor }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topToolbar}>
          <ToolbarButton name={IconName.profile} onPress={() => {}} />
          <ToolbarButton
            name={IconName.list}
            onPress={() => {
              setIsGreedMode(!isGridMode);
            }}
          />
        </View>
        {isGridMode ? <Calendar /> : <Threads />}
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

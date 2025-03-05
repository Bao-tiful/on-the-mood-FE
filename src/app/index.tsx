import typography from "@/constants/Typography";
import { Link, Stack } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import Calendar from "./pages/Calendar";
import Threads from "./pages/Threads";
import { ToolbarButton } from "../components/ToolbarButton";

export default function HomeScreen() {
  const [isGridMode, setIsGreedMode] = useState(true);

  // TODO: 오늘의 색상값을 페이지 로드 시 가져오기
  const todayColor = "#00C7BE";

  return (
    <View style={[styles.background, { backgroundColor: todayColor }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        {/* TODO: Toolbar 아이콘 변경해주기 */}
        <View style={styles.topToolbar}>
          <ToolbarButton name="user" onPress={() => {}} />
          <ToolbarButton
            name="bars"
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
    justifyContent: "space-between",
  },
});

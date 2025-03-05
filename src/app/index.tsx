import typography from "@/constants/Typography";
import { Link, Stack } from "expo-router";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Button,
  TouchableOpacity,
} from "react-native";
import Calendar from "./pages/Calendar";
import Icon from "react-native-vector-icons/FontAwesome";
import { ToolbarButton } from "../components/ToolbarButton";

export default function HomeScreen() {
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Pretendard: "./assets/fonts/PretendardVariable.ttf",
      });
    }

    loadFonts();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        {/* Toolbar 아이콘 변경해주기 */}
        <View style={styles.topToolbar}>
          <ToolbarButton name="user" onPress={() => {}} />
          <ToolbarButton name="bars" onPress={() => {}} />
        </View>
        <Calendar />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
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

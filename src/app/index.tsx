import typography from "@/constants/Typography";
import { Link, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, SafeAreaView, Button } from "react-native";
import * as Font from "expo-font";

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

      <SafeAreaView>
        <View style={{ flexDirection: "row" }}>
          <View style={{ padding: 4, backgroundColor: "skyblue" }}>
            <Link href="/pages/Calendar">To Calendar</Link>
          </View>
          <View style={{ padding: 4, backgroundColor: "orange" }}>
            <Link href="/pages/Threads">To Threads</Link>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

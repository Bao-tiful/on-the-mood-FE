import { Link, Stack } from "expo-router";
import React from "react";
import { StyleSheet, View, Text, SafeAreaView, Button } from "react-native";

export default function HomeScreen() {
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

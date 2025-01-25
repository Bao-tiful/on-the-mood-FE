import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";

export default function HomeScreen() {
  return (
    <>
      <Text style={{ color: "black" }}> Hello world</Text>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    gap: 8,
  },
});

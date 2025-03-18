import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const LoginPage = () => {
  return (
    <View>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView>
        <Text>LoginPage</Text>
      </SafeAreaView>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({});

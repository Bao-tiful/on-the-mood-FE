import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Colors } from "@/src/styles/Colors";
import typography from "@/src/styles/Typography";
import SignInButton, { SignInType } from "@/src/components/login/SignInButton";
import { router } from "expo-router";

const LoginPage = () => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.lightGray }}>
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.logoContainer}>
            <Text style={[typography.title2, { color: Colors.black100 }]}>
              OntheMood
            </Text>
            <Text style={[typography.headline, { color: Colors.black100 }]}>
              온도로 느끼고, 색으로 기록하다.
            </Text>
          </View>
        </View>
        <View style={styles.signInButtonContainer}>
          <SignInButton
            type={SignInType.google}
            onPress={() => {
              console.log("google");
            }}
          />
          <SignInButton
            type={SignInType.apple}
            onPress={() => {
              console.log("apple");
            }}
          />
          {/* TODO: 이메일로 로그인 부분은 나중에 디자인 나오면 수정하기 */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              paddingHorizontal: 40,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                router.push("/pages/Auth/SignUp");
              }}
            >
              <Text>회원가입</Text>
            </TouchableOpacity>
            <Text>|</Text>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                router.push("/pages/Auth/SignIn");
              }}
            >
              <Text>이메일로 로그인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 120,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: {
    top: "25%",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  signInButtonContainer: {
    width: "100%",
    gap: 16,
  },
});

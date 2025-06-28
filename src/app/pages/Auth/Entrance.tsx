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
import Logo from "@/src/components/Logo";

const EntrancePage = () => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.lightGray }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Logo width={186} />
            <Text style={styles.catchphrase}>
              <Text style={styles.catchphraseEmphasis}>온도</Text>로 느끼고,
              {"\n"}
              <Text style={styles.catchphraseEmphasis}>색</Text>
              으로 기록하다.
            </Text>
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
        </View>
      </SafeAreaView>
    </View>
  );
};

export default EntrancePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    paddingHorizontal: 16,
    gap: 40,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  logoContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 24,
  },
  signInButtonContainer: {
    width: "100%",
    gap: 16,
  },
  catchphrase: {
    ...typography.headline,
    color: Colors.black40,
    lineHeight: 26,
  },
  catchphraseEmphasis: {
    fontWeight: "bold",
    color: Colors.black70,
  },
});

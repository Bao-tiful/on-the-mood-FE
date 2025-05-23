import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Colors } from "@/src/styles/Colors";
import typography from "@/src/styles/Typography";
import SignInButton, { SignInType } from "@/src/components/login/SignInButton";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

const EntrancePage = () => {
  const [userInfo, setUserInfo] = React.useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "",
    // android, iOS 버전은 안만들었고, Web Application 으로 Client를 생성해주었음
    // 그런데, 실제로 실행하려고 해보니 iOS 클라이언트 ID로 요청하고 있어서
    // 우선 웹 클라이언트 ID를 아래에 전달해두었음.
    androidClientId: "",
    iosClientId: "",
    // clientSecret: "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",
    redirectUri: "https://auth.expo.io/@amoled/on-the-mood-FE",
  });

  // Google 로그인 처리하는 함수
  const handleSignInWithGoogle = async () => {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      // 안드로이드, 웹 클라이언트 아이디를 사용하여 인증 요청 보냄.
      // Google 인증 요청을 위한 훅 초기화
      // promptAsync: 인증 요청 보냄.
      console.log(request);
      console.log(response);
      if (response?.type === "success") {
        // 인증 요청에 대한 응답이 성공이면, 토큰을 이용하여 유저 정보를 가져옴.
        await getUserInfo(response.authentication?.accessToken ?? "");
      }
    } else {
      // 유저 정보가 이미 있으면, 유저 정보를 가져옴.
      setUserInfo(JSON.parse(user));
    }
  };

  // 토큰을 이용하여 유저 정보를 가져오는 함수
  const getUserInfo = async (token: string) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userInfoResponse = await response.json();
      // 유저 정보를 AsyncStorage에 저장, 상태업뎃
      await AsyncStorage.setItem("@user", JSON.stringify(userInfoResponse));
      setUserInfo(userInfoResponse);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("@user");
    setUserInfo(null);
  };

  // Google 인증 응답이 바뀔때마다 실행
  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

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
              promptAsync();
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

export default EntrancePage;

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

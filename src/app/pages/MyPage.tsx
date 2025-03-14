import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { saveAccessToken } from "@/src/utils/storage";
import { getProfile, logIn, signUp } from "@/src/api/endpoints/auth";

const MyPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const [signUpResult, setSignUpResult] = useState("");
  const [logInResult, setLogInResult] = useState("");
  const [getProfileResult, setGetProfileResult] = useState("");

  return (
    <SafeAreaView style={{ gap: 20, margin: 12 }}>
      <View style={{ gap: 4 }}>
        <Text>회원가입</Text>
        <TextInput
          style={{ backgroundColor: "#aaaaaa", padding: 8 }}
          placeholder="이메일"
          autoCapitalize="none"
          placeholderTextColor="#ffffff"
          onChangeText={(v) => setEmail(v)}
        />
        <TextInput
          style={{ backgroundColor: "#aaaaaa", padding: 8 }}
          placeholder="비밀번호"
          autoCapitalize="none"
          placeholderTextColor="#ffffff"
          onChangeText={(v) => setPassword(v)}
        />
        <TextInput
          style={{ backgroundColor: "#aaaaaa", padding: 8 }}
          placeholder="닉네임"
          autoCapitalize="none"
          placeholderTextColor="#ffffff"
          onChangeText={(v) => setNickname(v)}
        />
        <Button
          onPress={async () => {
            try {
              const prop = {
                username: email,
                email: email,
                password: password,
                password2: password,
                nickname: nickname,
              };
              const result = await signUp(prop);
              setSignUpResult("성공");
            } catch (error) {
              setSignUpResult("error");
              console.error("ERROR : ", error);
            }
          }}
          title="회원가입"
          color="blue"
        />
        <Text> - 결과 : {signUpResult}</Text>
      </View>
      <View style={{ gap: 4 }}>
        <Text>로그인</Text>
        <TextInput
          style={{ backgroundColor: "#aaaaaa", padding: 8 }}
          placeholder="이메일"
          autoCapitalize="none"
          placeholderTextColor="#ffffff"
          onChangeText={(v) => setEmail(v)}
        />
        <TextInput
          style={{ backgroundColor: "#aaaaaa", padding: 8 }}
          autoCapitalize="none"
          placeholder="비밀번호"
          placeholderTextColor="#ffffff"
          onChangeText={(v) => setPassword(v)}
        />
        <Button
          onPress={async () => {
            try {
              const prop = {
                username: email,
                password: password,
              };
              const result = await logIn(prop);
              setLogInResult("성공");

              saveAccessToken(result.access);
            } catch (error) {
              setLogInResult("error");
              console.error("ERROR : ", error);
            }
          }}
          title="로그인"
          color="blue"
        />
        <Text> - 결과 : {logInResult}</Text>
      </View>
      <View style={{ gap: 4 }}>
        <Text>내 정보 조회</Text>

        <Button
          onPress={async () => {
            try {
              const result = await getProfile();
              setGetProfileResult(result["username"]);
            } catch (error) {
              setGetProfileResult("error");
              console.error("ERROR : ", error);
            }
          }}
          title="조회하기"
          color="blue"
        />
        <Text> - 결과 : {getProfileResult}</Text>
      </View>
    </SafeAreaView>
  );
};

export default MyPage;

const styles = StyleSheet.create({});

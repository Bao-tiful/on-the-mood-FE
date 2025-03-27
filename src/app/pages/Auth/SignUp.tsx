import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { ToolbarButton } from "@/src/components/ToolbarButton";
import { IconName } from "@/src/components/Icon";
import { signUp } from "@/src/api/endpoints/auth";
import { router } from "expo-router";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [signUpResult, setSignUpResult] = useState("");

  return (
    <SafeAreaView style={{ margin: 16 }}>
      <View style={styles.topToolbar}>
        <ToolbarButton
          name={IconName.back}
          onPress={() => {
            router.back();
          }}
        />
      </View>
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
              setSignUpResult(result);

              router.back();
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
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  topToolbar: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 12,
    justifyContent: "space-between",
  },
});

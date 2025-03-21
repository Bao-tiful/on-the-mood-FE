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
import { useRouter } from "expo-router";
import { logIn } from "@/src/api/endpoints/auth";
import { saveAccessToken } from "@/src/utils/storage";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logInResult, setLogInResult] = useState("");

  const router = useRouter();

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

              await saveAccessToken(result.access);
              // TODO: 전체 router history (라우팅 스택)을 초기화하고 이동하는 방법 적용 (index 페이지에서 뒤로가기가 안되도록 )
              router.back();
              router.replace("/");
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
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  topToolbar: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 12,
    justifyContent: "space-between",
  },
});

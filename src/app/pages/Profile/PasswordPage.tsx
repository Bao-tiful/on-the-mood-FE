import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { IconName } from "@/src/components/Icon";
import { ToolbarButton } from "@/src/components/ToolbarButton";
import { Colors, OndoColors } from "@/src/styles/Colors";
import typography from "@/src/styles/Typography";
import { router } from "expo-router";
import PasswordKeypad from "@/src/components/myPage/PasswordKeypad";
import PasswordIndicator from "@/src/components/myPage/PasswordIndicator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBackgroundColor } from "@/src/hooks/useBackgroundColor";

enum PasswordConfigStep {
  checkCurrent = 0,
  checkCurrentAgain = 1,
  inputNew = 2,
  validateNew = 3,
  validateAgain = 4,
}

const PasswordPage = () => {
  const { colorState } = useBackgroundColor();
  const [passwordInput, setPasswordInput] = useState("");
  const [step, setStep] = useState(0);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const indicatorLabel = [
    "현재 비밀번호를 입력해주세요.",
    "현재 비밀번호가 일치하지 않아요.\n다시 시도해주세요.",
    "새로운 비밀번호를 입력해주세요.",
    "확인을 위해 한 번 더 입력해주세요.",
    "비밀번호가 일치하지 않아요.\n처음부터 다시 시도해주세요.",
  ];

  useEffect(() => {
    const loadPassword = async () => {
      const storedPassword = await AsyncStorage.getItem("@password");

      if (storedPassword && storedPassword.length == 4) {
        // 설정된 비밀번호가 있다면 && 정확히 4자리라면
        setCurrentPassword(storedPassword);
        setStep(PasswordConfigStep.checkCurrent);
      } else {
        // 설정된 비밀번호가 없다면 && 유호하지 않은 비밀번호라면
        setStep(PasswordConfigStep.inputNew);
      }
    };

    loadPassword();
  }, []);

  const savePassword = async () => {
    await AsyncStorage.setItem("@password", newPassword);
  };

  useEffect(() => {
    if (passwordInput.length == 4) {
      switch (step) {
        case PasswordConfigStep.checkCurrent:
          // 기존 비밀번호 확인
          if (currentPassword == passwordInput) {
            // 비밀번호가 일치하는 경우 > 변경으로 이동
            setPasswordInput("");
            setStep(PasswordConfigStep.inputNew);
          } else {
            // 일치하지 않는 경우
            setPasswordInput("");
            setStep(PasswordConfigStep.checkCurrentAgain);
          }

          break;
        case PasswordConfigStep.checkCurrentAgain:
          if (currentPassword == passwordInput) {
            setPasswordInput("");
            setStep(PasswordConfigStep.inputNew);
          }
          // 일치하지 않는 경우
          else {
            setPasswordInput("");
            setStep(PasswordConfigStep.checkCurrentAgain);
          }
          break;
        case PasswordConfigStep.inputNew:
          // 새로운 비밀번호 입력하기
          // 입력된 패스워드 임시 저장
          setNewPassword(passwordInput);
          setPasswordInput("");
          setStep(step + 1);
          break;
        case PasswordConfigStep.validateNew:
          // 새로운 비밀번호 검사
          // 한 번 더 입력한 비밀번호가 일치하는 경우
          if (passwordInput == newPassword) {
            // 패스워드 저장하고 돌아가기
            savePassword();
            router.back();
          }
          // 일치하지 않는 경우
          else {
            setPasswordInput("");
            setStep(step + 1);
          }

          break;
        case PasswordConfigStep.validateAgain:
          // 새로운 비밀번호 검사 불일치
          if (passwordInput == newPassword) {
            // 패스워드 저장하고 돌아가기
            savePassword();
            router.back();
          }
          // 일치하지 않는 경우
          else {
            setPasswordInput("");
          }

          break;
      }
    }
  }, [passwordInput]);

  return (
    <View
      style={{
        flex: 1,
        // 작성한 온도에 따른 배경색 지정
        backgroundColor: OndoColors.get(colorState.color),
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topToolbar}>
          <ToolbarButton
            name={IconName.back}
            onPress={() => {
              router.back();
            }}
          />
          <Text
            style={{
              ...typography.heading2,
            }}
          >
            비밀번호 설정
          </Text>
          <View style={{ width: 44 }} />
        </View>
        {/* 비밀번호 UI */}
        <PasswordIndicator
          label={indicatorLabel[step]}
          password={passwordInput}
        />

        {/* 비밀번호 패드 */}
        <PasswordKeypad
          onNextInput={(newInput) => {
            switch (true) {
              case newInput >= 0:
                setPasswordInput(passwordInput.concat(newInput.toString()));
                break;
              default:
                setPasswordInput(passwordInput.slice(0, -1));
                break;
            }
          }}
        />
      </SafeAreaView>
    </View>
  );
};

export default PasswordPage;

const styles = StyleSheet.create({
  topToolbar: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  safeArea: { gap: 20, margin: 12, flex: 1 },
  button: {
    flex: 1,
    paddingVertical: 24,
    color: Colors.black100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  text: {
    ...typography.heading1,
    color: Colors.black100,
  },
});

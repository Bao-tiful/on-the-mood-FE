import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToolbarButton } from "@/src/components/ToolbarButton";
import Icon, { IconName } from "@/src/components/Icon";
import { router } from "expo-router";
import typography from "@/src/styles/Typography";
import SignInButton from "@/src/components/login/SignInButton";

const Withdraw = () => {
  return (
    <SafeAreaView>
      <View style={styles.topToolbar}>
        <ToolbarButton
          name={IconName.back}
          onPress={async () => {
            router.back();
          }}
        />
        <Text style={typography.heading2}>회원 탈퇴</Text>
        <View style={{ width: 44 }} />
      </View>
      <View>
        <Icon name={IconName.calendar} size={100}></Icon>
        <Text>탈퇴 전 확인하세요.</Text>
        <View>
          <Text>
            가입시 수집한 개인정보(이메일)를 포함하여 {"\n"}
            작성한 모든 일기가 영구적으로 삭제되며 {"\n"}
            다시는 복구할 수 없습니다.
          </Text>
        </View>
      </View>
      <View>
        <TouchableOpacity>
          <Icon name={IconName.check} size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomSheetButton} onPress={() => {}}>
          <Text>탈퇴하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Withdraw;

const styles = StyleSheet.create({
  topToolbar: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },

  bottomSheetButton: {
    backgroundColor: "orange",

    width: "100%",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 50,
  },
});

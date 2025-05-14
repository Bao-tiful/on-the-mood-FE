import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToolbarButton } from "@/src/components/ToolbarButton";
import Icon, { IconName } from "@/src/components/Icon";
import { router } from "expo-router";
import typography from "@/src/styles/Typography";
import SignInButton from "@/src/components/login/SignInButton";
import { Colors } from "@/src/styles/Colors";

const Withdraw = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
      <View style={styles.content}>
        <View style={{ alignItems: "center" }}>
          <Icon name={IconName.caution} size={100}></Icon>
          <View style={{ height: 32 }} />
          <Text style={typography.heading2}>탈퇴 전 확인하세요.</Text>
          <View style={{ height: 16 }} />
          <View
            style={{
              backgroundColor: Colors.black18,
              width: "100%",
              padding: 24,
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <Text
              style={[
                typography.body2,
                { color: Colors.black40, textAlign: "center" },
              ]}
            >
              가입시 수집한 개인정보(이메일)를 포함하여 {"\n"}
              작성한 모든 일기가 영구적으로 삭제되며 {"\n"}
              다시는 복구할 수 없습니다.
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "center", gap: 24 }}>
          <TouchableOpacity>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Icon name={IconName.uncheckCircle} size={24} />
              <Text style={[typography.body2]}>
                안내사항을 확인하였으며 이에 동의합니다.
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bottomSheetButton,
              { backgroundColor: Colors.black100 },
            ]}
            onPress={() => {}}
          >
            <Text style={[typography.body, { color: Colors.white100 }]}>
              탈퇴하기
            </Text>
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 40,
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

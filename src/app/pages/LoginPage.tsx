import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Colors } from "@/src/styles/Colors";
import typography from "@/src/styles/Typography";
import Icon, { IconName } from "@/src/components/Icon";

const LoginPage = () => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.lightGray }}>
      <SafeAreaView
        style={{
          flex: 1,
          marginHorizontal: 16,
          marginVertical: 120,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              top: "25%",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <Text style={[typography.title2, { color: Colors.black100 }]}>
              OntheMood
            </Text>
            <Text style={[typography.headline, { color: Colors.black100 }]}>
              온도로 느끼고, 색으로 기록하다.
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            gap: 16,
          }}
        >
          <TouchableOpacity
            style={{
              height: 56,
              width: "100%",
              backgroundColor: Colors.white100,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 100,
              flexDirection: "row", // 아이콘과 텍스트를 가로 정렬
            }}
          >
            <View style={{ position: "absolute", left: 16 }}>
              <Icon name={IconName.googleLogo} />
            </View>
            <Text
              style={[
                typography.body,
                {
                  fontWeight: "700",
                  color: Colors.black100,
                  textAlign: "center", // 텍스트 중앙 정렬
                },
              ]}
            >
              Google로 로그인
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 56,
              width: "100%",
              backgroundColor: Colors.black100,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 100,
              flexDirection: "row", // 아이콘과 텍스트를 가로 정렬
            }}
          >
            <View style={{ position: "absolute", left: 16 }}>
              <Icon name={IconName.appleLogo} />
            </View>
            <Text
              style={[
                typography.body,
                {
                  fontWeight: "700",
                  color: Colors.white100,
                  textAlign: "center", // 텍스트 중앙 정렬
                },
              ]}
            >
              Apple로 로그인
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({});

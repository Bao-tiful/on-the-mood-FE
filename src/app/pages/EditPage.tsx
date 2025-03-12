import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import React from "react";
import TemperatureSlider from "@/src/components/editpage/TemperatureSlider";
import { ToolbarButton } from "@/src/components/ToolbarButton";
import Icon, { IconName } from "@/src/components/Icon";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import typography from "@/constants/Typography";

const EditPage = () => {
  const { date, temperature } = useLocalSearchParams();

  const isoDateString = Array.isArray(date) ? date[0] : date;
  const parsedDate = isoDateString ? new Date(isoDateString) : null;

  const parsedTemperature = Array.isArray(temperature)
    ? Number(temperature[0])
    : Number(temperature);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View>
          <View style={styles.topToolbar}>
            <ToolbarButton
              name={IconName.back}
              onPress={() => {
                router.back();
              }}
            />
            <Text>{parsedDate?.toLocaleDateString("ko-KR")}</Text>
            <ToolbarButton name={IconName.check} onPress={() => {}} />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name={IconName.location} size={14} />
              <Text>서울특별시</Text>
            </View>
            <Text>|</Text>
            <View
              style={{
                flexDirection: "row",
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name={IconName.temperature} size={14} />
              <Text>체감온도 {temperature}°</Text>
            </View>
          </View>
        </View>
        <View style={{ height: 12 }} />
        <View style={{ marginVertical: 16 }}>
          <View style={{ alignItems: "center" }}>
            <TemperatureSlider
              feelsLikeTemp={parsedTemperature}
              changeMoodTemp={() => {}}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              paddingVertical: 24,
              paddingHorizontal: 16,
              gap: 24,
              backgroundColor: Colors.white40,
              borderRadius: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <Text>키워드</Text>
              <Text>키워드</Text>
              <Text>키워드</Text>
            </View>
            <TextInput
              style={[
                typography.body,
                {
                  textAlignVertical: "top",
                  minHeight: 64,
                },
              ]}
              multiline={true}
              numberOfLines={3}
              maxLength={100}
              placeholder={
                "오늘 나만의 온도는 어땠나요?\n오늘의 하루를 컬러와 간단한 문장으로 표현해보세요."
              }
              placeholderTextColor={Colors.black40}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Text>0</Text>
              <Text> /100</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditPage;

const styles = StyleSheet.create({
  container: {
    margin: 12,
    flex: 1,
    backgroundColor: "#a0d2ffff",
  },
  topToolbar: {
    flexDirection: "row",
    paddingVertical: 12,
    marginHorizontal: 4,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

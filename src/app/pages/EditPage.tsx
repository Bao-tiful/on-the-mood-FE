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
import { IconName } from "@/src/components/Icon";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import typography from "@/constants/Typography";
import LocationAndTemperature from "@/src/components/editpage/LocationAndTemperature";
import Keywords from "@/src/components/editpage/Keywords";

const EditPage = () => {
  const { date, temperature } = useLocalSearchParams();

  const isoDateString = Array.isArray(date) ? date[0] : date;
  const parsedDate = isoDateString ? new Date(isoDateString) : null;

  const parsedTemperature = Array.isArray(temperature)
    ? Number(temperature[0])
    : Number(temperature);

  return (
    // TODO: 여기에서 색상 변경해주기
    <View style={{ flex: 1, backgroundColor: "#a0d2ffff" }}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, gap: 12 }}
        >
          <View>
            <View style={styles.topToolbar}>
              <ToolbarButton
                name={IconName.back}
                onPress={() => {
                  router.back();
                }}
              />
              <Text style={typography.heading2}>
                {parsedDate?.toLocaleDateString("ko-KR")}
              </Text>
              <ToolbarButton name={IconName.check} onPress={() => {}} />
            </View>
            <LocationAndTemperature
              location={"서울특별시"}
              temperature={parsedTemperature}
            />
          </View>

          <View style={{ marginTop: 16 }}>
            <View style={{ alignItems: "center" }}>
              <TemperatureSlider
                feelsLikeTemp={parsedTemperature}
                changeMoodTemp={() => {}}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.noteEditorContainer}>
              <Keywords keywordList={["키워드 1", "키워드 2", "키워드 3"]} />
              <TextInput
                style={styles.noteEditor}
                multiline={true}
                numberOfLines={3}
                maxLength={100}
                placeholder={
                  "오늘 나만의 온도는 어땠나요?\n오늘의 하루를 컬러와 간단한 문장으로 표현해보세요."
                }
                placeholderTextColor={Colors.black40}
                autoFocus
              />
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <Text style={styles.noteCountingLabel}>0</Text>
                <Text style={styles.noteMaxLabel}> /100</Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default EditPage;

const styles = StyleSheet.create({
  container: {
    margin: 12,
    flex: 1,
  },
  topToolbar: {
    flexDirection: "row",
    paddingVertical: 12,
    marginHorizontal: 4,
    justifyContent: "space-between",
    alignItems: "center",
  },

  noteEditorContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 16,
    backgroundColor: Colors.white40,
    borderRadius: 16,
  },
  noteEditor: {
    ...typography.body,
    textAlignVertical: "top",
    minHeight: 64,
  },
  noteCountingLabel: { ...typography.label1, color: Colors.black100 },
  noteMaxLabel: { ...typography.label1, color: Colors.black40 },
});

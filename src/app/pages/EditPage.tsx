import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { IconName } from "@/src/components/Icon";
import { ToolbarButton } from "@/src/components/ToolbarButton";
import LocationAndTemperature from "@/src/components/editpage/LocationAndTemperature";
import NoteEditor from "@/src/components/editpage/NoteEditor";
import TemperatureSlider from "@/src/components/editpage/TemperatureSlider";
import typography from "@/src/styles/Typography";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";

const EditPage = () => {
  const { date, temperature } = useLocalSearchParams();

  const isoDateString = Array.isArray(date) ? date[0] : date;
  const parsedDate = isoDateString ? new Date(isoDateString) : null;

  const parsedTemperature = Array.isArray(temperature)
    ? Number(temperature[0])
    : Number(temperature);

  const [memo, setMemo] = useState("");

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
            <TemperatureSlider
              feelsLikeTemp={parsedTemperature}
              changeMoodTemp={() => {}}
            />
          </View>
          <View style={{ flex: 1 }}>
            <NoteEditor
              keywordList={["키워드 1", "keyword", "hello"]}
              memo={memo}
              onMemoChanged={(memo) => setMemo(memo)}
            />
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
});

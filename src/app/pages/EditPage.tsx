import {
  Button,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
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
import React, { useEffect, useMemo, useState } from "react";
import { OndoColors } from "@/src/styles/Colors";
import { postNote } from "@/src/api/endpoints/daily-notes";
import { toDateString } from "@/src/utils/dateUtils";
import AnimatedColorView from "@/src/components/editpage/AnimatedColorView";

const EditPage = () => {
  const { feelsLikeTempData, noteData, editableData } = useLocalSearchParams();

  const date = new Date();

  const [feelsLikeTemp, setFeelsLikeTemp] = useState(0);
  const [note, setNote] = useState<NoteItem | undefined>(undefined);
  const [editable, setEditable] = useState(true);

  useEffect(() => {
    try {
      if (Array.isArray(feelsLikeTempData))
        throw new Error("feelsLikeTempData가 string[] 타입입니다");

      if (feelsLikeTempData) {
        setFeelsLikeTemp(Number(feelsLikeTempData));
      }
    } catch (error) {
      console.error("유효하지 않은 JSON을 변환하려 합니다 :", error);
    }
  }, [feelsLikeTempData]);

  useEffect(() => {
    try {
      if (Array.isArray(noteData))
        throw new Error("noteData가 string[] 타입입니다");

      if (noteData) {
        const parsedNote = JSON.parse(noteData);
        // TODO: JSON -> NoteItem 만드는 Util 함수 추가하기
        setNote({
          id: parsedNote.id,
          location: parsedNote.location,
          custom_temp: parsedNote.custom_temp,
          content: parsedNote.content,
          created_at: new Date(parsedNote.created_at),
          updated_at: new Date(parsedNote.updated_at),
        });
        setMyMoodOndo(parsedNote.custom_temp);
      } else {
        setMyMoodOndo(Number(feelsLikeTempData));
      }
    } catch (error) {
      console.error("유효하지 않은 JSON을 변환하려 합니다 :", error);
    }
  }, [noteData]);

  useEffect(() => {
    try {
      if (Array.isArray(editableData))
        throw new Error("editableData가 string[] 타입입니다");

      if (editableData) {
        setEditable(JSON.parse(editableData.toLowerCase()));
      }
    } catch (error) {
      console.error("유효하지 않은 JSON을 변환하려 합니다 :", error);
    }
  }, [editableData]);

  const [myMoodOndo, setMyMoodOndo] = useState(feelsLikeTemp);
  const [memo, setMemo] = useState("");

  const colors = useMemo(
    () =>
      Array.from(OndoColors.keys())
        .sort((a, b) => a - b)
        .map((key) => {
          return OndoColors.get(key)!;
        }),

    []
  );

  return (
    <AnimatedColorView
      style={{
        flex: 1,
      }}
      colors={colors}
      activeIndex={myMoodOndo + 40}
      duration={200}
    >
      <View style={{ flex: 1 }}>
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
                <ToolbarButton
                  name={IconName.check}
                  onPress={async () => {
                    try {
                      const prop = {
                        location: "Seoul",
                        content: memo,
                        custom_temp: myMoodOndo,
                      };
                      const result = await postNote(prop);
                      console.log(result);
                      router.back();
                    } catch (error) {
                      console.error("ERROR : ", error);
                    }
                  }}
                />
              </View>
              <LocationAndTemperature
                location={"서울특별시"}
                temperature={parsedTemperature}
              />
              <Text style={typography.heading2}>{toDateString(date)}</Text>
              <ToolbarButton
                name={IconName.check}
                onPress={async () => {
                  try {
                    // 노트를 수정하려는 경우
                    if (note) {
                      const prop = {
                        content: memo,
                      };
                    }
                    // 오늘 노트를 처음 작성하는 경우
                    else {
                      const prop = {
                        location: "Seoul",
                        content: memo,
                        custom_temp: myMoodOndo,
                      };
                      const result = await postNote(prop);
                      console.log(result);
                    }

                    router.back();
                  } catch (error) {
                    console.error("ERROR : ", error);
                  }
                }}
              />
            </View>
            <LocationAndTemperature
              location={"서울특별시"}
              temperature={feelsLikeTemp}
            />
          </View>

          <View style={{ marginTop: 16 }}>
            <TemperatureSlider
              feelsLikeTemp={feelsLikeTemp}
              moodTemp={myMoodOndo}
              // TODO: 만약 note 정보가 있다면 해당 날짜에 선택한 온도 넣어주기
              changeMoodTemp={(temperature) => {
                setMyMoodOndo(temperature);
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <NoteEditor
              keywordList={["키워드 1", "keyword", "hello"]}
              memo={memo}
              onMemoChanged={(memo) => setMemo(memo)}
              defaultValue={note?.content}
              autoFocus={!note}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default EditPage;

const styles = StyleSheet.create({
  containerStyle: {
    height: 200,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "pink",
    marginBottom: 50,
  },
  animatedStyle: {
    borderWidth: 5,
    borderColor: "grey",
    borderRadius: 100,
  },
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

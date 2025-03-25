import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { IconName } from "@/src/components/Icon";
import { ToolbarButton } from "@/src/components/ToolbarButton";
import LocationAndTemperature from "@/src/components/editpage/LocationAndTemperature";
import NoteEditor from "@/src/components/editpage/NoteEditor";
import TemperatureSlider from "@/src/components/editpage/TemperatureSlider";
import typography from "@/src/styles/Typography";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { OndoColors } from "@/src/styles/Colors";
import { editNote, postNote } from "@/src/api/endpoints/daily-notes";
import { toDateString } from "@/src/utils/dateUtils";

const EditPage = () => {
  // 화면 진입 시 TextInput에 focus를 부여할 때 사용
  const inputRef = useRef<TextInput>(null);

  const { feelsLikeTempData, noteData, editableData } = useLocalSearchParams();

  const date = new Date();

  const [feelsLikeTemp, setFeelsLikeTemp] = useState(0);
  const [note, setNote] = useState<NoteItem | undefined>(undefined);
  const [editable, setEditable] = useState(true);

  const [myMoodOndo, setMyMoodOndo] = useState(feelsLikeTemp);
  const [memo, setMemo] = useState(note ? note.content : "");

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

      // 노트 데이터가 있는 경우 (기존 작성 데이터 O)
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
        setMemo(parsedNote.content);
      }
      // 노트 데이터가 없는 경우 (처음 작성하는 경우)
      else {
        // 페이지가 로드되고 잠시 후 키보드에 포커스를 부여하기
        setTimeout(() => {
          requestAnimationFrame(() => {
            inputRef.current?.focus();
          });
        }, 500);

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

  const submit = () => {
    return async () => {
      try {
        // 노트를 수정하려는 경우
        if (note) {
          const prop = {
            id: note.id,
            content: memo,
            custom_temp: myMoodOndo,
          };
          await editNote(prop);
        }

        // 오늘 노트를 처음 작성하는 경우
        else {
          // TODO: location 변경해주기
          const prop = {
            location: "Seoul",
            content: memo,
            custom_temp: myMoodOndo,
          };
          await postNote(prop);
        }

        router.back();
      } catch (error) {
        console.error("ERROR : ", error);
      }
    };
  };

  return (
    // TODO: 여기에서 색상 변경해주기
    <View style={{ flex: 1, backgroundColor: OndoColors.get(myMoodOndo) }}>
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
              <Text style={typography.heading2}>{toDateString(date)}</Text>
              {editable ? (
                <ToolbarButton name={IconName.check} onPress={submit()} />
              ) : (
                <View style={{ width: 44 }} />
              )}
            </View>
            <LocationAndTemperature
              location={"서울특별시"}
              temperature={feelsLikeTemp}
            />
          </View>

          <View
            // 수정 불가능한 경우에는 터치 이벤트를 제한
            pointerEvents={editable ? "auto" : "none"}
            style={{ marginTop: 16, flex: 1, gap: 12 }}
          >
            <View>
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
                ref={inputRef}
                autoFocus={false}
              />
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
});

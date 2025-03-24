import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToolbarButton } from "@/src/components/ToolbarButton";
import { IconName } from "@/src/components/Icon";
import { OndoColors } from "@/src/styles/Colors";
import DateLocationCell from "@/src/components/detailPage/DateLocationCell";
import PageDivider from "@/src/components/detailPage/PageDivider";
import ColorCodeCell from "@/src/components/detailPage/ColorCodeCell";
import OndoCell from "@/src/components/detailPage/OndoCell";
import NoteCell from "@/src/components/detailPage/NoteCell";

const DetailPage = () => {
  const { noteData } = useLocalSearchParams();
  const [note, setNote] = useState<NoteItem | undefined>(undefined);

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
      }
    } catch (error) {
      console.error("유효하지 않은 JSON을 변환하려 합니다 :", error);
    }
  }, [noteData]);

  return (
    <View
      style={{
        flex: 1,
        // 작성한 온도에 따른 배경색 지정
        backgroundColor: OndoColors.get(note?.custom_temp ?? 0),
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container}>
        {/* 툴바 */}
        <View style={styles.topToolbar}>
          <ToolbarButton
            name={IconName.back}
            onPress={() => {
              router.back();
            }}
          />
        </View>
        {/* 컨텐츠 */}
        {note !== undefined && note.created_at instanceof Date && (
          <View style={styles.contentContainer}>
            {/* 날짜 / 지역 */}
            <DateLocationCell
              createdAt={note.created_at}
              location={note.location}
            />
            {/* 노트 정보 */}
            <View>
              <ColorCodeCell ondo={note.custom_temp} />
              <PageDivider />
              <OndoCell ondo={note.custom_temp} />
              <PageDivider />
              <NoteCell
                note={note}
                onPress={() => {
                  router.push({
                    pathname: "/pages/EditPage",
                    params: {
                      editableData: JSON.stringify(false),
                      feelsLikeTempData: 30,
                      noteData: JSON.stringify(note),
                    },
                  });
                }}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default DetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 12,
  },
  topToolbar: {
    flexDirection: "row",
    paddingVertical: 12,
    marginHorizontal: 4,
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentContainer: {
    justifyContent: "space-between",
    flex: 1,
    marginTop: 16,
  },
});

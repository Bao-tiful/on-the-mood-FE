import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToolbarButton } from "@/src/components/ToolbarButton";
import { IconName } from "@/src/components/Icon";
import { Colors, OndoColors } from "@/src/styles/Colors";
import NoteInfoCell from "@/src/components/detailPage/DateLocationCell";
import NoteContent from "@/src/components/detailPage/NoteContent";
import typography from "@/src/styles/Typography";
import NoteOndoCard from "@/src/components/detailPage/NoteOndoCard";

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
            <NoteInfoCell
              createdAt={note.created_at}
              location={note.location}
              feelLikeTemp={note.custom_temp} // TODO: 실제 체감온도로 변경해주기
            />
            {/* 노트 정보 */}
            <View style={{ gap: 32 }}>
              <NoteContent note={note} />
              <NoteOndoCard note={note} />
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
  backgroundContainer: {
    height: 32,
    flexDirection: "column",
  },
  minMaxLabelRow: {
    flexDirection: "row",
    position: "absolute",
    justifyContent: "space-between",
    top: -30,
    left: 0,
    right: 0,
    bottom: 0,
  },
  minMaxLabel: {
    color: Colors.black40,
    ...typography.body,
  },
  backgroundTrack: {
    height: 32,
    width: "101%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backgroundTrackItem: {
    backgroundColor: Colors.black18,
    height: "100%",
    width: 2,
    borderRadius: "50%",
  },
});

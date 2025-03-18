import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToolbarButton } from "@/src/components/ToolbarButton";
import Icon, { IconName } from "@/src/components/Icon";
import typography from "@/src/styles/Typography";
import { Colors, OndoColors } from "@/src/styles/Colors";
import { toDateString } from "@/src/utils/dateUtils";

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
  }, []);

  const Divider = () => (
    <View
      style={{
        height: 1,
        backgroundColor: Colors.black18,
        marginVertical: 24,
      }}
    />
  );

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
          <ToolbarButton
            name={IconName.trash}
            onPress={() => {
              // TODO: 노트 삭제 기능이 필요할 지 논의하기
            }}
          />
        </View>
        {/* 컨텐츠 */}
        {note !== undefined && note.created_at instanceof Date && (
          <View style={styles.contentContainer}>
            {/* 날짜 / 지역 */}
            <DetailDateLocationCell
              createdAt={note.created_at}
              location={note.location}
            />
            {/* 노트 정보 */}
            <View>
              <DetailColorCodeCell ondo={note.custom_temp} />
              <Divider />
              <DetailOndoCell ondo={note.custom_temp} />
              <Divider />
              <DetailNoteCell
                note={note}
                onPressEdit={() => {
                  router.push({
                    pathname: "/pages/EditPage",
                    params: { temperature: note.custom_temp },
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

const DetailDateLocationCell = ({
  createdAt,
  location,
}: {
  createdAt: Date;
  location: string;
}) => (
  <View style={{ flex: 1, gap: 4 }}>
    <Text style={[typography.heading1, { color: Colors.black100 }]}>
      {toDateString(createdAt)}
    </Text>

    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      <Icon name={IconName.location} size={14} />
      <Text style={[typography.label1, { color: Colors.black100 }]}>
        {location}
      </Text>
    </View>
  </View>
);

const DetailColorCodeCell = ({ ondo }: { ondo: number }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
    }}
  >
    <View style={{ flexDirection: "row" }}>
      <Text
        style={[
          typography.label1,
          { color: Colors.black100, fontWeight: "bold" },
        ]}
      >
        {"Note\nMood Code"}
      </Text>

      <TouchableOpacity
        style={{ marginHorizontal: 8 }}
        onPress={() => {
          // TODO: tooltip 추가하기
        }}
      >
        <Icon name={IconName.info} />
      </TouchableOpacity>
    </View>
    <Text
      style={[
        typography.title2,
        {
          color: Colors.black100,
          fontWeight: "bold",
          textDecorationLine: "underline",
        },
      ]}
    >
      {OndoColors.get(ondo)}
    </Text>
  </View>
);

const DetailOndoCell = ({ ondo }: { ondo: number }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text
        style={[
          typography.label1,
          { color: Colors.black100, fontWeight: "bold" },
        ]}
      >
        {"Note\nOndo"}
      </Text>

      <View style={{ flexDirection: "row" }}>
        <Text style={[typography.display1]}>{ondo}</Text>
        <Text style={[typography.display2]}>°</Text>
      </View>
    </View>
  );
};

const DetailNoteCell = ({
  note,
  onPressEdit,
}: {
  note: NoteItem;
  onPressEdit: () => void;
}) => {
  return (
    <View>
      <View
        style={{
          backgroundColor: Colors.white40,
          paddingHorizontal: 16,
          paddingVertical: 24,
          borderRadius: 16,
          gap: 40,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 0,
            justifyContent: "space-between",
          }}
        >
          <Text
            style={[
              typography.label1,
              { color: Colors.black100, fontWeight: "bold" },
            ]}
          >
            {"Note\nOnthemood"}
          </Text>
          <ToolbarButton name={IconName.edit} onPress={onPressEdit} />
        </View>
        <View style={{ width: "100%" }}>
          <Text
            numberOfLines={4}
            style={[typography.body, { height: 25.6 * 4, textOverflow: "..." }]}
          >
            {note?.content}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
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
  },
});

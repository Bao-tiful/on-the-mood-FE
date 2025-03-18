import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToolbarButton } from "@/src/components/ToolbarButton";
import Icon, { IconName } from "@/src/components/Icon";
import typography from "@/src/styles/Typography";
import { Colors, OndoColors } from "@/src/styles/Colors";

const DetailPage = () => {
  const { noteData } = useLocalSearchParams();
  const [note, setNote] = useState<NoteItem | undefined>(undefined);

  useEffect(() => {
    try {
      if (Array.isArray(noteData))
        throw new Error("noteData가 string[] 타입입니다");

      if (noteData) {
        const parsedNote = JSON.parse(noteData);
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

  console.log("Type:", typeof note?.created_at);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: OndoColors.get(15),
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.container}>
        {/* 툴바 */}
        <View style={styles.topToolbar}>
          <ToolbarButton name={IconName.back} onPress={() => {}} />
          <ToolbarButton name={IconName.trash} onPress={() => {}} />
        </View>
        {/* 컨텐츠 */}
        {note !== undefined && note.created_at instanceof Date && (
          <View
            style={{
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            {/* 날짜 / 지역 */}
            <View style={{ flex: 1, gap: 8 }}>
              <Text style={[typography.heading1, { color: Colors.black100 }]}>
                {note.created_at.toDateString()}
              </Text>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 2 }}
              >
                <Icon name={IconName.location} size={14} />
                <Text style={[typography.label1, { color: Colors.black100 }]}>
                  {note?.location}
                </Text>
              </View>
            </View>
            {/* 노트 정보 */}
            <View>
              {/* 코드 */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text>{"Note\nMood Code"}</Text>
                  <Icon name={IconName.info} />
                </View>
                <Text>#C7FBEE</Text>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: "gray",
                  marginVertical: 10,
                }}
              />
              {/* 온도 */}
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>{"Note\nOnde"}</Text>

                  <Text>2°</Text>
                </View>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: "gray",
                  marginVertical: 10,
                }}
              />
              {/* 노트 */}
              <View>
                <Text>{note?.content}</Text>
              </View>
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
    margin: 12,
  },
  topToolbar: {
    flexDirection: "row",
    paddingVertical: 12,
    marginHorizontal: 4,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

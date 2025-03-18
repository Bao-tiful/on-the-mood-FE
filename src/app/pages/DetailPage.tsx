import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getNoteDetail } from "@/src/api/endpoints/daily-notes";

const DetailPage = () => {
  const { noteData } = useLocalSearchParams();
  const [note, setNote] = useState<NoteItem | undefined>(undefined);

  useEffect(() => {
    try {
      if (Array.isArray(noteData))
        throw new Error("noteData가 string[] 타입입니다");

      if (noteData) {
        const parsedNote = JSON.parse(noteData);
        setNote(parsedNote);
      }
    } catch (error) {
      console.error("유효하지 않은 JSON을 변환하려 합니다 :", error);
    }
  }, []);

  return (
    <View>
      <Text>{note?.content}</Text>
    </View>
  );
};

export default DetailPage;

const styles = StyleSheet.create({});

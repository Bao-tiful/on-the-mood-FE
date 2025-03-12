import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import Keywords from "./Keywords";
import typography from "@/constants/Typography";

type NoteEditorProps = {
  keywordList: string[];
  memo: string;
  onMemoChanged: (memo: string) => void;
};

const NoteEditor = ({ keywordList, memo, onMemoChanged }: NoteEditorProps) => {
  return (
    <View style={styles.noteEditorContainer}>
      <Keywords keywordList={keywordList} />
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
        onChangeText={(memo) => {
          onMemoChanged(memo);
        }}
      />
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Text style={styles.noteCountingLabel}>{memo.length}</Text>
        <Text style={styles.noteMaxLabel}> /100</Text>
      </View>
    </View>
  );
};

export default NoteEditor;

const styles = StyleSheet.create({
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

import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { forwardRef } from "react";
import { Colors } from "@/src/styles/Colors";
import Keywords from "./Keywords";
import typography from "@/src/styles/Typography";

type NoteEditorProps = {
  keywordList: string[];
  memo: string;
  onMemoChanged: (memo: string) => void;
  autoFocus?: boolean;
  defaultValue?: string;
};

const NoteEditor = forwardRef<TextInput, NoteEditorProps>(
  (
    {
      keywordList,
      memo,
      onMemoChanged,
      autoFocus = false,
      defaultValue = "",
    }: NoteEditorProps,
    ref
  ) => {
    return (
      <View style={styles.noteEditorContainer}>
        <View style={{ flex: 1 }}>
          <Keywords keywordList={keywordList} />
          <TextInput
            ref={ref}
            defaultValue={defaultValue}
            style={styles.noteEditor}
            multiline={true}
            numberOfLines={3}
            maxLength={100}
            placeholder={
              "오늘 나만의 온도는 어땠나요?\n오늘의 하루를 컬러와 간단한 문장으로 표현해보세요."
            }
            placeholderTextColor={Colors.black40}
            autoFocus={autoFocus}
            onChangeText={(memo) => {
              onMemoChanged(memo);
            }}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Text style={styles.noteCountingLabel}>{memo.length}</Text>
          <Text style={styles.noteMaxLabel}> /100</Text>
        </View>
      </View>
    );
  }
);

export default NoteEditor;

const styles = StyleSheet.create({
  noteEditorContainer: {
    flex: 1,
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
    // maxHeight: 80,
  },
  noteCountingLabel: { ...typography.label1, color: Colors.black100 },
  noteMaxLabel: { ...typography.label1, color: Colors.black40 },
});

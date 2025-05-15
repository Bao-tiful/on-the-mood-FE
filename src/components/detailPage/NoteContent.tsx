import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import React from "react";
import typography from "@/src/styles/Typography";
import { Colors } from "@/src/styles/Colors";

const NoteContent = ({ note }: { note: NoteItem }) => {
  return (
    <View
      style={{
        gap: 16,
      }}
    >
      <Text style={styles.title}>Mood Note</Text>
      <Text style={styles.content}>{note?.content}</Text>
    </View>
  );
};

export default NoteContent;

const styles = StyleSheet.create({
  title: {
    ...typography.label1,
    color: Colors.black100,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  content: {
    ...typography.body,
    color: Colors.black70,
  },
});

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/src/styles/Colors";
import typography from "@/src/styles/Typography";

type KeywordsProps = {
  keywordList: string[];
};

const Keywords = ({ keywordList }: KeywordsProps) => {
  return (
    <View style={styles.keywordContainer}>
      {Array.from(keywordList).map((keyword, index) => (
        <View style={styles.keywordCell} key={index}>
          <Text style={styles.keywordLabel}>{keyword}</Text>
        </View>
      ))}
    </View>
  );
};

export default Keywords;

const styles = StyleSheet.create({
  keywordContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    overflow: "hidden",
  },
  keywordCell: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 100,
    backgroundColor: Colors.black18,
  },
  keywordLabel: {
    ...typography.label2,
  },
});

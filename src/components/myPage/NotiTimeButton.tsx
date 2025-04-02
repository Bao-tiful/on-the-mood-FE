import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "@/src/styles/Colors";
import typography from "@/src/styles/Typography";

// TODO: 필요한 경우에 timeString을 내부 Time type으로 변경하기
const NotiTimeButton = ({
  timeString,
  onPress,
}: {
  timeString: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={typography.body2}>{timeString}</Text>
    </TouchableOpacity>
  );
};

export default NotiTimeButton;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: Colors.black18,
    borderRadius: 8,
  },
});

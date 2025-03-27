import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import typography from "@/src/styles/Typography";
import { Colors } from "@/src/styles/Colors";

const NoteCell = ({
  note,
  onPress,
}: {
  note: NoteItem;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
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
    </TouchableOpacity>
  );
};

export default NoteCell;

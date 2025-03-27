import { Text, View } from "react-native";

import typography from "@/src/styles/Typography";
import React from "react";
import { Colors } from "@/src/styles/Colors";

const OndoCell = ({ ondo }: { ondo: number }) => {
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

export default OndoCell;

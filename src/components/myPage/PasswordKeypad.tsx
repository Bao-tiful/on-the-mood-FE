import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import typography from "@/src/styles/Typography";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Icon, { IconName } from "../Icon";

type PasswordKeypadProps = {
  onNextInput: (value: number) => void;
};

const PasswordKeypad = ({ onNextInput }: PasswordKeypadProps) => {
  const buttons = Array.from({ length: 12 }, (_, i) => `${i + 1}`);

  return (
    <View>
      <FlatList
        scrollEnabled={false}
        data={buttons}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        renderItem={({ item }) => {
          const itemValue = Number(item);
          let content;
          switch (true) {
            case itemValue < 10:
              // 1~9
              content = (
                <TouchableOpacity
                  onPress={() => onNextInput(itemValue)}
                  style={styles.button}
                >
                  <Text style={styles.text}>{item}</Text>
                </TouchableOpacity>
              );
              break;
            case itemValue === 10:
              // 빈 칸
              content = null;
              break;
            case itemValue === 11:
              // 0
              content = (
                <TouchableOpacity
                  onPress={() => onNextInput(0)}
                  style={styles.button}
                >
                  <Text style={styles.text}>{0}</Text>
                </TouchableOpacity>
              );
              break;
            default:
              // 지우기
              content = (
                <TouchableOpacity
                  onPress={() => onNextInput(-1)}
                  style={styles.button}
                >
                  <Icon name={IconName.back} />
                </TouchableOpacity>
              );
              break;
          }
          return (
            <View
              style={{
                flex: 1,
                marginHorizontal: 4,
                marginVertical: 8,
              }}
            >
              {content}
            </View>
          );
        }}
      />
    </View>
  );
};

export default PasswordKeypad;

const styles = StyleSheet.create({
  topToolbar: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  safeArea: { gap: 20, margin: 12, flex: 1 },
  button: {
    flex: 1,
    paddingVertical: 24,
    color: Colors.black100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  text: {
    ...typography.heading1,
    color: Colors.black100,
  },
});

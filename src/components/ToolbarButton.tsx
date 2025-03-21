import { TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon, { IconName } from "./Icon";
import { Colors } from "@/src/styles/Colors";

type ToolbarButtonProps = {
  name: IconName;
  onPress: () => void;
};

export const ToolbarButton = ({ name, onPress }: ToolbarButtonProps) => (
  <TouchableOpacity onPress={onPress} style={styles.toolbarButton}>
    <Icon name={name} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  toolbarButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "50%",
    backgroundColor: Colors.black18,
  },
});

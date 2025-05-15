import { TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon, { IconName } from "./Icon";
import { Colors } from "@/src/styles/Colors";

type ToolbarButtonProps = {
  name: IconName;
  onPress: () => void;
  size?: number;
};

export const ToolbarButton = ({
  name,
  onPress,
  size = 44,
}: ToolbarButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.toolbarButton, { width: size, height: size }]}
  >
    <Icon name={name} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  toolbarButton: {
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "50%",
    backgroundColor: Colors.black18,
  },
});

import { TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

type ToolbarButtonProps = {
  name: string;
  onPress: () => void;
};

export const ToolbarButton = ({ name, onPress }: ToolbarButtonProps) => (
  <TouchableOpacity onPress={onPress} style={styles.toolbarButton}>
    <Icon name={name} size={20} color="black" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  toolbarButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "50%",
    backgroundColor: "#aaaaaaaa",
  },
});

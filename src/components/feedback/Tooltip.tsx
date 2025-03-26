import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Popover, {
  PopoverMode,
  PopoverPlacement,
} from "react-native-popover-view";
import { Colors } from "@/src/styles/Colors";
import typography from "@/src/styles/Typography";

/// 사용법
/// children으로 Tooltip을 열 때 사용할 컴포넌트를 전달 (<Icon /> 등)
/// title, content를 전달하면 툴팁을 화면에 띄워줍니다.

type TooltipProp = {
  title: string;
  content: string;
  children: React.ReactNode;
};

const Tooltip = ({ title, content, children }: TooltipProp) => {
  return (
    <Popover
      from={<TouchableOpacity>{children}</TouchableOpacity>}
      mode={PopoverMode.RN_MODAL}
      arrowSize={{ width: 0, height: 0 }}
      backgroundStyle={{ backgroundColor: "transparent" }}
      popoverStyle={{
        borderRadius: 8,
        shadowColor: Colors.black18,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 24,
        elevation: 6,
      }}
      placement={PopoverPlacement.BOTTOM}
    >
      <View style={[styles.container]}>
        <Text style={styles.titleLabel}>{title}</Text>
        <Text style={styles.contentLabel}>{content}</Text>
      </View>
    </Popover>
  );
};

export default Tooltip;

const styles = StyleSheet.create({
  container: { margin: 16, gap: 8, maxWidth: 180 },
  titleLabel: { ...typography.body },
  contentLabel: { ...typography.body2, textOverflow: "" },
});

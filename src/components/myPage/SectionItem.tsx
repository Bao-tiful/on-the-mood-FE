import { StyleSheet, Text, View } from "react-native";
import React from "react";
import typography from "@/src/styles/Typography";
import { Colors } from "@/src/styles/Colors";

export const SectionTitle = ({ label }: { label: string }) => {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleLabel}>{label}</Text>
    </View>
  );
};

export const SectionContent = ({
  label = "",
  children = null,
}: {
  label?: string;
  children?: React.ReactNode;
}) => {
  return (
    <View style={styles.sectionContent}>
      {label.length !== 0 ? (
        <Text style={styles.sectionContentLabel}>{label}</Text>
      ) : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    marginVertical: 16,
  },
  sectionTitleLabel: {
    ...typography.headline,
  },
  sectionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black18,
  },
  sectionContentLabel: {
    ...typography.body,
  },
});

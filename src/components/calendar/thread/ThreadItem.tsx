import typography from "@/src/styles/Typography";
import React, { useMemo, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, OndoColors } from "../../../styles/Colors";
import { Thread } from "../../../types/thread";
import Icon, { IconName } from "../../Icon";
import { ToolbarButton } from "../../ToolbarButton";
import { router } from "expo-router";

const ThreadItem = ({ thread }: { thread: Thread }) => {
  const formattedDate = useMemo(() => {
    return new Date(thread.updated_at).getDate();
  }, [thread.updated_at]);

  const bgColor = useMemo(() => {
    return OndoColors.get(thread.custom_temp) || "#fff";
  }, [thread.custom_temp]);

  const handleDetailPress = useCallback(() => {
    router.push({
      pathname: "/pages/DetailPage",
      params: {
        editableData: JSON.stringify(false),
        noteData: JSON.stringify(thread),
      },
    });
  }, [thread]);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* 왼쪽: 온도 정보 */}
      <View style={styles.leftBox}>
        <View>
          <Text style={[styles.dayText, typography.label1]}>
            {formattedDate} Day
          </Text>
          <Text style={[styles.label, typography.label1]}>기록 온도</Text>
        </View>
        <View>
          <View style={styles.locationContainer}>
            <Icon name={IconName.location} size={16} color="#fff" />
            <Text style={[styles.location, typography.label1]}>
              {thread.location}
            </Text>
          </View>
          <Text style={[styles.temperature, typography.title1]}>
            {thread.custom_temp}°
          </Text>
          <View style={styles.feelsLikeBox}>
            <Icon name={IconName.temperature} size={16} />
            <View>
              <Text style={[styles.feelsLikeText, typography.label2]}>
                체감 {thread.custom_temp}°
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 중앙 보더라인 */}
      <View style={styles.divider} />

      {/* 오른쪽: 일기 */}
      <View style={styles.rightBox}>
        <View style={styles.diaryHeader}>
          <View>
            <Text style={[styles.dayText, typography.label1]}>
              {formattedDate} Day
            </Text>
            <Text style={[styles.label, typography.label1]}>온도 일기</Text>
          </View>
          <ToolbarButton
            name={IconName.arrow}
            size={44}
            onPress={handleDetailPress}
          />
        </View>
        <Text
          style={[styles.diaryText, typography.body2]}
          numberOfLines={5}
          ellipsizeMode="tail"
        >
          {thread.content}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 8,
    minHeight: 224,
    height: 224,
  },
  leftBox: {
    flex: 1,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  rightBox: {
    flex: 1,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  locationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  diaryHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  divider: {
    width: 1,
    height: 224,
    backgroundColor: Colors.black18,
  },
  dayText: {
    marginBottom: 4,
  },
  label: {
    marginBottom: 4,
  },
  location: {
    color: Colors.black70,
    marginBottom: 4,
  },
  temperature: {
    color: Colors.black100,
  },
  feelsLikeBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 5,
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: Colors.black18,
  },
  feelsLikeText: {
    color: Colors.black70,
  },
  diaryText: {
    marginTop: 8,
    color: Colors.black70,
    maxHeight: 105,
    overflow: "hidden",
  },
});

export default ThreadItem;

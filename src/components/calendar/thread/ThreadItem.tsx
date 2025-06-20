import typography from "@/src/styles/Typography";
import React, { useMemo, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, OndoColors } from "../../../styles/Colors";
import { Thread } from "../../../types/thread";
import Icon, { IconName } from "../../Icon";
import { ToolbarButton } from "../../ToolbarButton";
import { router } from "expo-router";

// 상수 정의
const CONSTANTS = {
  ITEM_HEIGHT: 224,
  BORDER_RADIUS: 12,
  PADDING: 16,
  MARGIN_HORIZONTAL: 15,
  MARGIN_BOTTOM: 8,
  ICON_SIZE: 16,
  ARROW_SIZE: 44,
  MAX_DIARY_HEIGHT: 105,
} as const;

// 온도 정보 박스 컴포넌트
const TemperatureSection = React.memo(
  ({ thread, formattedDate }: { thread: Thread; formattedDate: number }) => (
    <View style={styles.leftBox}>
      <View>
        <Text style={[styles.dayText, typography.label1]}>
          {formattedDate} Day
        </Text>
        <Text style={[styles.label, typography.label1]}>기록 온도</Text>
      </View>
      <View>
        <View style={styles.locationContainer}>
          <Icon
            name={IconName.location}
            size={CONSTANTS.ICON_SIZE}
            color="#fff"
          />
          <Text style={[styles.location, typography.label1]}>
            {thread.location}
          </Text>
        </View>
        <Text style={[styles.temperature, typography.title1]}>
          {thread.custom_temp}°
        </Text>
        <View style={styles.feelsLikeBox}>
          <Icon name={IconName.temperature} size={CONSTANTS.ICON_SIZE} />
          <View>
            <Text style={[styles.feelsLikeText, typography.label2]}>
              체감 {thread.custom_temp}°
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
);

// 일기 내용 박스 컴포넌트
const DiarySection = React.memo(
  ({
    thread,
    formattedDate,
    onPress,
  }: {
    thread: Thread;
    formattedDate: number;
    onPress: () => void;
  }) => (
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
          size={CONSTANTS.ARROW_SIZE}
          onPress={onPress}
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
  )
);

const ThreadItem = ({ thread }: { thread: Thread }) => {
  const formattedDate = useMemo(() => {
    return new Date(thread.updated_at).getDate();
  }, [thread.updated_at]);

  const bgColor = useMemo(() => {
    return OndoColors.get(thread.custom_temp) || Colors.white100;
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
    <View
      style={[styles.container, { backgroundColor: bgColor }]}
      accessibilityRole="button"
      accessibilityLabel={`${formattedDate}일 일기, 온도 ${thread.custom_temp}도`}
    >
      <TemperatureSection thread={thread} formattedDate={formattedDate} />

      {/* 중앙 보더라인 */}
      <View style={styles.divider} />

      <DiarySection
        thread={thread}
        formattedDate={formattedDate}
        onPress={handleDetailPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: CONSTANTS.BORDER_RADIUS,
    marginHorizontal: CONSTANTS.MARGIN_HORIZONTAL,
    marginBottom: CONSTANTS.MARGIN_BOTTOM,
    minHeight: CONSTANTS.ITEM_HEIGHT,
    height: CONSTANTS.ITEM_HEIGHT,
    elevation: 1,
    shadowColor: Colors.black100,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftBox: {
    flex: 1,
    padding: CONSTANTS.PADDING,
    justifyContent: "space-between",
  },
  rightBox: {
    flex: 1,
    padding: CONSTANTS.PADDING,
    justifyContent: "space-between",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  diaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  divider: {
    width: 1,
    height: CONSTANTS.ITEM_HEIGHT,
    backgroundColor: Colors.black18,
  },
  dayText: {
    marginBottom: 4,
    color: Colors.black100,
  },
  label: {
    marginBottom: 4,
    color: Colors.black70,
  },
  location: {
    color: Colors.black70,
    marginBottom: 4,
  },
  temperature: {
    color: Colors.black100,
  },
  feelsLikeBox: {
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
    maxHeight: CONSTANTS.MAX_DIARY_HEIGHT,
    overflow: "hidden",
  },
});

export default ThreadItem;

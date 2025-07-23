import typography from "@/src/styles/Typography";
import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../styles/Colors";
import { Thread } from "../../../types/thread";
import Icon, { IconName } from "../../Icon";
import { ToolbarButton } from "../../ToolbarButton";
import { router } from "expo-router";
import { useThreadItemData } from "@/src/hooks/useThreadItemData";

// 온도 정보 박스 컴포넌트
const TemperatureSection = React.memo(
  ({
    thread,
    formattedDate,
    backgroundColor,
  }: {
    thread: Thread;
    formattedDate: number;
    backgroundColor: string;
  }) => (
    <View style={[styles.leftBox, { backgroundColor }]}>
      <View>
        <Text style={[styles.dayText, typography.label1]}>
          {formattedDate} Day
        </Text>
        <Text style={[styles.dayText, typography.label1]}>기록 온도</Text>
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
          <Text style={[styles.feelsLikeText, typography.label2]}>
            체감 {thread.custom_temp}°
          </Text>
        </View>
      </View>
    </View>
  )
);

// 일기 내용 박스 컴포넌트
const DiarySection = React.memo(
  ({
    thread,
    onPress,
    backgroundColor,
  }: {
    thread: Thread;
    onPress: () => void;
    backgroundColor: string;
  }) => (
    <View style={[styles.rightBox, { backgroundColor }]}>
      <View style={styles.diaryHeader}>
        <View>
          <Text style={[styles.label, typography.label1]}>무드온도</Text>
          <Text style={[styles.label, typography.label1]}>일기</Text>
        </View>
        <ToolbarButton name={IconName.arrow} size={44} onPress={onPress} />
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
  const { formattedDate, backgroundColor, accessibilityLabel } =
    useThreadItemData(thread);

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
      style={[styles.container]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <TemperatureSection
        thread={thread}
        formattedDate={formattedDate}
        backgroundColor={backgroundColor}
      />

      <DiarySection
        thread={thread}
        onPress={handleDetailPress}
        backgroundColor={backgroundColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 16,
    marginHorizontal: 15,
    marginBottom: 8,
    minHeight: 224,
    height: 224,
    elevation: 1,
    gap: 2,
  },
  largeScreenContainer: {
    // 800px 이상 화면용 스타일
    marginHorizontal: 20,
    minHeight: 250,
    height: 250,
  },
  smallScreenContainer: {
    // 800px 미만 화면용 스타일
    marginHorizontal: 15,
    minHeight: 224,
    height: 224,
  },
  leftBox: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
    borderRadius: 16,
  },
  rightBox: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  diaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dayText: {
    color: Colors.black100,
  },
  label: {
    color: Colors.black100,
  },
  location: {
    color: Colors.black70,
    fontWeight: "semibold",
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
    maxHeight: 105,
    overflow: "hidden",
  },
});

export default ThreadItem;

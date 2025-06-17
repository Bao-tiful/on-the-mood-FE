import { Colors, OndoColors } from "@/src/styles/Colors";
import typography from "@/src/styles/Typography";
import { isDateToday } from "@/src/utils/dateUtils";
import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

interface CalendarCellProps {
  isSelected: boolean;
  date: Date;
  onPress: (newDate: Date) => void;
  data: NoteItem | undefined;
}

export function CalendarCell({
  isSelected,
  date,
  data,
  onPress,
}: CalendarCellProps) {
  const isToday = isDateToday(date);

  const cellStyle = data
    ? {
        ...styles.calendarCellWithData,
        color: OndoColors.get(data.custom_temp) ?? Colors.white100,
      }
    : styles.calendarCellWithoutData;
  const selectedStyle = isSelected ? styles.calendarCellSelected : null;

  return (
    <TouchableOpacity
      style={[
        styles.calendarCell,
        cellStyle,
        selectedStyle,
        isToday ? { borderColor: Colors.black100, borderWidth: 2 } : null,
      ]}
      onPressOut={() => onPress(date)}
    >
      <Text
        style={[
          {
            color: selectedStyle?.color || cellStyle.color || Colors.black100,
          },
          styles.calendarCellText,
        ]}
      >
        {date.getDate()}
      </Text>

      {/* 오늘 날짜인 경우에만 보여주는 인디케이터 */}
      {isToday ? (
        <>
          <View
            style={[
              styles.todayDot,
              {
                backgroundColor:
                  selectedStyle?.color || cellStyle.color || Colors.black100,
              },
            ]}
          />
          <Text style={styles.todayLabel}>Today</Text>
        </>
      ) : null}
    </TouchableOpacity>
  );
}

// 유효하지 않은 날짜의 캘린더 칸
export function EmptyCalendarCell() {
  return (
    <View style={[styles.calendarCell, styles.invalidCalendarCell]}>
      <View />
    </View>
  );
}

// 빈 줄만 채우는 날짜의 캘린더 칸
export function PlaceholderCalendarCell() {
  return (
    <View style={[styles.calendarCell]}>
      <View />
    </View>
  );
}

const styles = StyleSheet.create({
  calendarCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    margin: 6,
  },
  calendarCellText: {
    ...typography.body,
    fontWeight: 600,
  },
  invalidCalendarCell: {
    backgroundColor: "transparent",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: Colors.black18,
  },
  calendarCellWithData: {
    backgroundColor: "black",
    // color: "white",
    borderColor: Colors.black100,
  },
  calendarCellWithoutData: {
    backgroundColor: "transparent",
    color: Colors.black100,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.black18,
  },
  calendarCellSelected: {
    backgroundColor: Colors.white100,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowColor: Colors.black18,
    // TODO: 각 날짜의 색상 넣어주기
    color: Colors.black100,
    borderColor: "white",
  },
  todayDot: {
    position: "absolute",
    bottom: "16%",
    borderRadius: "50%",
    width: 4,
    height: 4,
    fontWeight: "bold",
  },
  todayLabel: {
    ...typography.label4,
    color: Colors.black100,
    position: "absolute",
    bottom: -14,
  },
});

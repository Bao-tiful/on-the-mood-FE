import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

interface CalendarCellProps {
  date: Date;
  onPress: (newDate: Date) => void;
  data: NoteItem | undefined;
}

export function CalendarCell({ date, data, onPress }: CalendarCellProps) {
  const todayDate = new Date();
  const isToday =
    date.getFullYear() == todayDate.getFullYear() &&
    date.getMonth() == todayDate.getMonth() &&
    date.getDate() == todayDate.getDate();
  const cellStyle = data
    ? styles.calendarCellWithData
    : styles.calendarCellWithoutData;
  return (
    <TouchableOpacity
      style={[styles.calendarCell, cellStyle]}
      onPressOut={() => onPress(date)}
    >
      <Text style={{ color: cellStyle.color || "black" }}>
        {date.getDate()}
      </Text>

      {/* 오늘 날짜인 경우에만 보여주기 */}
      {isToday ? (
        <View
          style={[
            styles.todayIndicator,
            { backgroundColor: cellStyle.color || "black" },
          ]}
        />
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
  invalidCalendarCell: {
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  calendarCellWithData: {
    backgroundColor: "black",
    color: "white",
  },
  calendarCellWithoutData: {
    backgroundColor: "white",
    color: "black",
  },
  todayIndicator: {
    position: "absolute",
    bottom: "16%",
    borderRadius: "50%",
    width: 4,
    height: 4,
    fontWeight: "bold",
  },
});

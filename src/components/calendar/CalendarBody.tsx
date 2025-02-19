import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";

interface CalendarBodyProps {
  date: Date;
  changeDate: (newDate: Date) => void;
  notes: Map<number, NoteItem>;
}

/// props로 입력된 Date가 포함된 월의 달력을 보여준다.
function CalendarBody({ date, changeDate, notes }: CalendarBodyProps) {
  // date가 포함된 달의 1일의 요일을 구함
  const firstDay = new Date(date.getFullYear(), date.getMonth());
  // 해당 달의 1일의 요일
  const firstDayOffset = firstDay.getDay();
  // 해당 달의 마지막 날짜
  const lastDate = new Date(
    new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime() - 1
  ).getDate();
  // 캘린더의 각 칸에 대한 id를 부여하는 list
  // 여기에서의 date는 각 칸이 가지는 날짜를 의미한다.
  const items = Array.from({ length: 7 * 6 }, (_, index) => ({
    date: index - firstDayOffset + 1,
  }));

  return (
    <>
      <WeekdayNames />
      <FlatList
        data={items}
        renderItem={({ item }) => {
          if (item.date > 0 && item.date <= lastDate) {
            // 1일부터 마지막 날까지
            return (
              <CalendarCell
                date={new Date(date.getFullYear(), date.getMonth(), item.date)}
                data={notes.get(item.date)}
                onPress={changeDate}
              />
            );
          } else {
            return <EmptyCalendarCell />;
          }
        }}
        keyExtractor={(item) => item.date.toString()}
        numColumns={7}
        scrollEnabled={false}
      />
    </>
  );
}

// 캘린더의 요일 목록
function WeekdayNames() {
  const weekdayNameList = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <View style={styles.weekdayContainer}>
      {weekdayNameList.map((item, index) => (
        <Text style={styles.weekdayCell} key={index}>
          {item}
        </Text>
      ))}
    </View>
  );
}

interface CalendarCellProps {
  date: Date;
  onPress: (newDate: Date) => void;
  data: NoteItem | undefined;
}

function CalendarCell({ date, data, onPress }: CalendarCellProps) {
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
function EmptyCalendarCell() {
  return (
    <View style={[styles.calendarCell, styles.invalidCalendarCell]}>
      <View />
    </View>
  );
}

const styles = StyleSheet.create({
  weekdayContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  weekdayCell: {
    flexDirection: "row",
    flex: 1,
    textAlign: "center",
    color: "grey",
  },
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

export default CalendarBody;

import React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import {
  CalendarCell,
  EmptyCalendarCell,
} from "@components/calendar/GridCalendarCell";
import { Colors } from "@/src/styles/Colors";
import typography from "@/src/styles/Typography";

interface GridCalendarProps {
  date: Date;
  changeDate: (newDate: Date) => void;
  notes: Map<number, NoteItem>;
}

/// props로 입력된 Date가 포함된 월의 달력을 보여준다.
export const GridCalendar = ({
  date,
  changeDate,
  notes,
}: GridCalendarProps) => {
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
    <View>
      <WeekdayNames />
      <FlatList
        data={items}
        renderItem={({ item }) => {
          if (item.date > 0 && item.date <= lastDate) {
            // 1일부터 마지막 날까지
            let cellDate = new Date(
              date.getFullYear(),
              date.getMonth(),
              item.date
            );
            let isSelected =
              date.getFullYear() == cellDate.getFullYear() &&
              date.getMonth() == cellDate.getMonth() &&
              date.getDate() == cellDate.getDate();
            return (
              <CalendarCell
                isSelected={isSelected}
                date={cellDate}
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
    </View>
  );
};

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

const styles = StyleSheet.create({
  weekdayContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  weekdayCell: {
    ...typography.label2,
    flexDirection: "row",
    flex: 1,
    textAlign: "center",
    color: Colors.black100,
  },
});

export default GridCalendar;

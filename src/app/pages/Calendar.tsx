import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import CalendarDatePicker from "@/src/components/CalendarDatePicker";

export default function Calendar() {
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.monthPickerButton}>
            {date.getFullYear().toString()}년 {(date.getMonth() + 1).toString()}
            월
          </Text>
        </TouchableOpacity>
        <Text>노트 개수 : N개</Text>
        <WeekdayNames />
        <CalendarContainer date={date} />
      </View>
      {/* ModalVisible에 의해 제어되는 바텀시트 */}
      <CalendarDatePicker
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        initialDate={date}
        setDate={setDate}
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

// 유효하지 않은 날짜의 캘린더 칸
function EmptyCalendarCell() {
  return <View style={styles.emptyCalendarCell}></View>;
}

function CalendarCell({ date }: CalendarCellProps) {
  return (
    <View style={styles.calendarCell}>
      <Text>{date}</Text>
    </View>
  );
}

/// props로 입력된 Date가 포함된 월의 달력을 보여준다.
function CalendarContainer({ date }: CalendarProps) {
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
    <FlatList
      data={items}
      renderItem={({ item }) => {
        if (item.date > 0 && item.date <= lastDate) {
          // 1일부터 마지막 날까지
          return <CalendarCell date={item.date} />;
        } else {
          return <EmptyCalendarCell />;
        }
      }}
      keyExtractor={(item) => item.date.toString()}
      numColumns={7}
      scrollEnabled={false}
    />
  );
}

interface CalendarProps {
  date: Date;
}

interface CalendarCellProps {
  date: number;
}

interface CalendarItem {
  id: number;
  text: string;
}

const styles = StyleSheet.create({
  monthPickerButton: {
    fontSize: 32,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
  },
  weekdayContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  weekdayCell: {
    flexDirection: "row",
    flex: 1,
    textAlign: "center",
  },
  calendarCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    margin: 6,
    backgroundColor: "white",
  },
  emptyCalendarCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: "50%",
    alignSelf: "center",
    margin: 6,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "lightgrey",
  },
});

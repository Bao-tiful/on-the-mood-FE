import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Calendar() {
  const [modalVisible, setModalVisible] = useState(false);
  const pressButton = () => {
    setModalVisible(true);
  };

  const date: Date = new Date();

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => pressButton()}>
          <Text style={styles.monthPickerButton}>
            {date.getFullYear().toString()}년 {(date.getMonth() + 1).toString()}
            월
          </Text>
        </TouchableOpacity>
        <Text>노트 개수 : N개</Text>
        <WeekdayNames />
        <CalendarContainer date={date} />
      </View>
    </>
  );
}

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

function EmptyCalendarCell() {
  return <View style={styles.emptyCalendarCell}></View>;
}

function CalendarCell({ id }: CalendarCellProps) {
  return (
    <View style={styles.calendarCell}>
      <Text>{id + 1}</Text>
    </View>
  );
}

function CalendarContainer({ date }: CalendarProps) {
  // date가 포함된 달의 1일의 요일을 구함
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  const firstDayOffset = firstDay.getDay();
  const lastDayOffset = new Date(
    new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime() - 1
  ).getDate();
  const items = Array.from({ length: 35 }, (_, index) => ({
    id: index - firstDayOffset,
  }));

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => {
        if (item.id >= 0 && item.id < lastDayOffset) {
          return <CalendarCell id={item.id} />;
        } else {
          return <EmptyCalendarCell />;
        }
      }}
      keyExtractor={(item) => item.id.toString()}
      numColumns={7}
      scrollEnabled={false}
    />
  );
}

interface CalendarProps {
  date: Date;
}

interface CalendarCellProps {
  id: number;
}

interface CalendarItem {
  id: number;
  text: string;
}

interface CalendarContainerProps {
  items?: CalendarItem[]; // 배열이 undefined일 수도 있으므로 `?` 사용
}

const styles = StyleSheet.create({
  monthPickerButton: {
    fontSize: 16,
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

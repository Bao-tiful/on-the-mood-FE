import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";

import CalendarDatePicker from "@/src/components/CalendarDatePicker";

export default function Calendar() {
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const changeModalVisible = (isModalOn: boolean) => {
    setModalVisible(isModalOn);
  };
  const [date, setDate] = useState(new Date());

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
      <CalendarDatePicker
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        initialDate={date}
        setDate={setDate}
      />
    </>
  );
}

  // TODO: 오늘의 색상값을 페이지 로드 시 가져오기
  const todayColor = "#d0b0e0";

  const todayWeatherCell = (
    <View style={[styles.todayCell, { backgroundColor: todayColor }]}>
      <Text style={styles.todayCellTitle}>{"Today\nweather color"}</Text>
      <View style={{ width: "100%" }}>
        {/* TODO: 핀 아이콘 변경 */}
        <Text style={styles.todayWeatherLocation}>📍 서울특별시</Text>
        <Text style={styles.todayWeatherTemperature}>4°</Text>
      </View>
    </View>
  );
}

function EmptyCalendarCell() {
  return <View style={styles.emptyCalendarCell}></View>;
}

function CalendarCell({ date }: CalendarCellProps) {
  return (
    <View style={styles.calendarCell}>
      <Text>{date}</Text>
    </View>
  );

function CalendarContainer({ date }: CalendarProps) {
  // date가 포함된 달의 1일의 요일을 구함
  const firstDay = new Date(date.getFullYear(), date.getMonth());
  const firstDayOffset = firstDay.getDay();
  const lastDate = new Date(
    new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime() - 1
  ).getDate();
  const items = Array.from({ length: 7 * 6 }, (_, index) => ({
    date: index - firstDayOffset + 1,
  }));

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => {
        if (item.date > 0 && item.date <= lastDate) {
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
    width: "100%",
    maxWidth: 450,
    flexDirection: "column",
    justifyContent: "space-between",
    rowGap: 20,
  },
  todayContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    maxHeight: 250,
    columnGap: 16,
  },
  todayCell: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 32,
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  todayCellTitle: {
    width: "100%",
    fontWeight: 600,
  },
  todayWeatherLocation: {
    fontSize: 14,
    color: "black",
  },
  todayWeatherTemperature: {
    fontSize: 48,
    fontWeight: 400,
    color: "black",
  },
  todayWriteButton: {
    width: "40%",
    aspectRatio: 1,
    borderRadius: "50%",
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: 24,
  },
});

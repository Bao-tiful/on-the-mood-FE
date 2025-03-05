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

  const todayWeatherCell = (
    <View style={[styles.todayCell]}>
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
    <>
      <View style={styles.container}>
        {/* 캘린더 */}
        <MoodNoteCalendar
          changeModalVisible={(isModalOn: boolean) => {
            setModalVisible(isModalOn);
          }}
          date={date}
          changeCalendarDate={(newDate: Date) => {
            setDate(newDate);
          }}
          notes={notes}
        />
        {/* 투데이 셀 */}
        <View style={styles.todayContainer}>
          {todayWeatherCell}
          {todayNoteCell}
        </View>
      </View>
      {/* ModalVisible에 의해 제어되는 바텀시트 */}
      <CalendarDatePicker
        initialDate={date}
        modalVisible={modalVisible}
        changeModalVisible={changeModalVisible}
        changeCalendarDate={changeCalendarDate}
      />
    </>
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
    backgroundColor: "#ffffff88",
    borderRadius: "10%",
  },
  todayCell: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 32,
    alignItems: "center",
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderColor: "lightgrey",
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

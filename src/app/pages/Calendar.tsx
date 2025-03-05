import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { CalendarDatePicker } from "@/src/components/calendar/CalendarDatePicker";
import { MoodNoteCalendar } from "@/src/components/calendar/MoodNoteCalendar";
import CalendarBottomNote from "@/src/components/calendar/CalendarBottomNote";

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

  // 테스트를 위한 노트 목데이터
  const notes = new Map<number, NoteItem>([
    [
      1,
      {
        id: "4f3398fa-4a6b-48d2-920c-73be06721b3ba",
        content: "와라라라1",
        temperature: 2,
        created_at: new Date("2025-01-01T19:33:43.215138Z"),
      },
    ],
    [
      5,
      {
        id: "4f3398fa-4a6b-48d2-920c-73be06721b3bb",
        content: "와라라라2",
        temperature: 5,
        created_at: new Date("2025-01-02T19:33:43.215138Z"),
      },
    ],
    [
      7,
      {
        id: "4f3398fa-4a6b-48d2-920c-73be06721b3bc",
        content: "와라라라3",
        temperature: 7,
        created_at: new Date("2025-01-03T19:33:43.215138Z"),
      },
    ],
  ]);

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
        <CalendarBottomNote date={date} />
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
    columnGap: 2,
  },
  todayCell: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#ffffff88",
  },
  todayWeatherCell: {
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
  },
  todayNoteCell: {
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
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

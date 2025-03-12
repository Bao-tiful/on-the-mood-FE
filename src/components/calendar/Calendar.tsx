import { CalendarDatePicker } from "@/src/components/calendar/CalendarDatePicker";
import { MoodNoteCalendar } from "@/src/components/calendar/MoodNoteCalendar";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const Calendar = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const changeModalVisible = (isModalOn: boolean) => {
    setModalVisible(isModalOn);
  };

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
        content:
          "소소한 순간들이 만든 좋은 하루 🍵 오랜만에 여유로운 아침, 좋아하는 노래 들으며 기분 좋게 출근. 일하면서 예상치 못한 문제들이 있었지만, 동료들과 협력하며 해결!",
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
      </View>
      {/* ModalVisible에 의해 제어되는 바텀시트 */}
      <CalendarDatePicker
        initialDate={date}
        modalVisible={modalVisible}
        changeModalVisible={changeModalVisible}
        changeCalendarDate={(newDate: Date) => {
          setDate(newDate);
        }}
      />
    </>
  );
};

export default Calendar;

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

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

export default function Calendar() {
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const changeModalVisible = (isModalOn: boolean) => {
    setModalVisible(isModalOn);
  };

  const changeCalendarDate = (newDate: Date) => {
    setDate(newDate);
  };

  // 테스트를 위한 노트 목데이터
  const notes = new Map([
    [
      1,
      {
        id: "4f3398fa-4a6b-48d2-920c-73be06721b3ba",
        content: "와라라라1",
        created_at: new Date("2025-01-01T19:33:43.215138Z"),
      },
    ],
    [
      5,
      {
        id: "4f3398fa-4a6b-48d2-920c-73be06721b3bb",
        content: "와라라라2",
        created_at: new Date("2025-01-02T19:33:43.215138Z"),
      },
    ],
    [
      7,
      {
        id: "4f3398fa-4a6b-48d2-920c-73be06721b3bc",
        content: "와라라라3",
        created_at: new Date("2025-01-03T19:33:43.215138Z"),
      },
    ],
  ]);

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
  const todayNoteCell = (
    <View style={styles.todayCell}>
      <Text style={styles.todayCellTitle}>{"Today\nMood Note"}</Text>
      <View style={{ width: "100%" }}>
        <TouchableOpacity style={styles.todayWriteButton}>
          {/* TODO: + 아이콘 변경 */}
          <Text
            style={{
              color: styles.todayWriteButton.color,
              fontSize: styles.todayWriteButton.fontSize,
            }}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

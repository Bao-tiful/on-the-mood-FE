import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import CalendarDatePicker from "@/src/components/CalendarDatePicker";

export default function Calendar() {
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const changeModalVisible = (newState: boolean) => {
    setModalVisible(newState);
  };

  const changeCalendarDate = (newDate: Date) => {
    setDate(newDate);
  };

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
    <View style={[styles.todayBox, { backgroundColor: "lavender" }]}>
      <Text style={{ width: "100%" }}>{"Today\nweather color"}</Text>
      <View style={{ width: "100%" }}>
        {/* TODO: 핀 아이콘 변경 */}
        <Text style={styles.todayWeatherLocation}>📍 서울특별시</Text>
        <Text style={styles.todayWeatherTemperature}>4°</Text>
      </View>
    </View>
  );

  const todayMoodNoteCell = (
    <View style={styles.todayBox}>
      <Text style={{ width: "100%" }}>{"Today\nMood Note"}</Text>
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <MoodNoteCalendar
            changeMoalVisible={function (newState: boolean): void {
              setModalVisible(newState);
            }}
            date={date}
            changeCalendarDate={function (newDate: Date): void {
              setDate(newDate);
            }}
            notes={notes}
          />
          <View style={styles.todayContainer}>
            {todayWeatherCell}
            {todayMoodNoteCell}
          </View>
        </View>
      </SafeAreaView>
      {/* ModalVisible에 의해 제어되는 바텀시트 */}
      <CalendarDatePicker
        modalVisible={modalVisible}
        changeModalVisible={changeModalVisible}
        initialDate={date}
        changeCalendarDate={changeCalendarDate}
      />
    </>
  );
}

interface MoodNoteCalendarProp {
  changeMoalVisible: (newState: boolean) => void;
  date: Date;
  changeCalendarDate: (newDate: Date) => void;
  notes: Map<number, NoteItem>;
}

const MoodNoteCalendar = ({
  changeMoalVisible,
  date,
  changeCalendarDate,
  notes,
}: MoodNoteCalendarProp) => {
  return (
    <View style={styles.calendarContainer}>
      <TouchableOpacity onPress={() => changeMoalVisible(true)}>
        <Text style={styles.monthPickerButton}>
          {date.getFullYear().toString()}년 {(date.getMonth() + 1).toString()}월
        </Text>
      </TouchableOpacity>
      <Text style={styles.moodNoteCount}>Mood Note({notes.size})</Text>
      <View style={{ paddingVertical: 24 }}>
        <WeekdayNames />
        <CalendarContainer
          date={date}
          changeDate={changeCalendarDate}
          notes={notes}
        />
      </View>
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

// 유효하지 않은 날짜의 캘린더 칸
function EmptyCalendarCell() {
  return (
    <View style={[styles.calendarCell, styles.invalidCalendarCell]}>
      <View />
    </View>
  );
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

/// props로 입력된 Date가 포함된 월의 달력을 보여준다.
function CalendarContainer({ date, changeDate, notes }: CalendarProps) {
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
  );
}

interface CalendarProps {
  date: Date;
  changeDate: (newDate: Date) => void;
  notes: Map<number, NoteItem>;
}

interface CalendarCellProps {
  date: Date;
  onPress: (newDate: Date) => void;
  data: NoteItem | undefined;
}

interface CalendarItem {
  id: number;
  text: string;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    margin: 16,
    alignItems: "center",
  },
  container: {
    flex: 1,
    maxWidth: 500,
    flexDirection: "column",
    justifyContent: "space-between",
    rowGap: 20,
  },
  calendarContainer: {
    flex: 1,
    flexDirection: "column",
    overflow: "hidden",
  },
  monthPickerButton: {
    fontSize: 32,
    fontWeight: 500,
  },
  moodNoteCount: {
    fontSize: 32,
    color: "grey",
  },
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
  todayContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    maxHeight: 250,
    columnGap: 16,
  },
  todayBox: {
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
  todayWeatherLocation: {
    fontSize: 14,
    color: "grey",
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

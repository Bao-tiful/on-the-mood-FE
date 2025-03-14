import { CalendarDatePicker } from "@/src/components/calendar/CalendarDatePicker";
import { MoodNoteCalendar } from "@/src/components/calendar/MoodNoteCalendar";
import { getNotes } from "@/src/api/endpoints/daily-notes";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

interface CalendarProps {
  date: Date;
  updateDate: (newDate: Date) => void;
}

const Calendar = ({ date, updateDate }: CalendarProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notes, setNotes] = useState<Map<number, NoteItem>>(
    new Map<number, NoteItem>()
  );

  const changeModalVisible = (isModalOn: boolean) => {
    setModalVisible(isModalOn);
  };

  useEffect(() => {
    getNotes().then((result) => {
      const fetchedNotes = new Map<number, NoteItem>(
        result.map((note, _): [number, NoteItem] => [
          new Date(note.created_at).getDate(),
          {
            id: note.id,
            location: note.location,
            custom_temp: note.custom_temp,
            content: note.content,
            created_at: new Date(note.created_at),
            updated_at: new Date(note.updated_at),
          },
        ])
      );
      setNotes(fetchedNotes);
    });
  }, []);

  useEffect(() => {
    // getWeather({ latitude: 128.59, longitude: 35.87 }).then((result) => {
    //   // 날씨 데이터 받아와서 처리해주기
    // });
  }, []);

  return (
    <>
      <View style={styles.container}>
        {/* 캘린더 */}
        <MoodNoteCalendar
          changeModalVisible={(isModalOn: boolean) => {
            setModalVisible(isModalOn);
          }}
          date={date}
          changeCalendarDate={updateDate}
          notes={notes}
        />
      </View>
      {/* ModalVisible에 의해 제어되는 바텀시트 */}
      <CalendarDatePicker
        initialDate={date}
        modalVisible={modalVisible}
        changeModalVisible={changeModalVisible}
        changeCalendarDate={updateDate}
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

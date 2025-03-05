import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import GridCalendar from "@/src/components/calendar/GridCalendar";

interface MoodNoteCalendarProp {
  date: Date;
  notes: Map<number, NoteItem>;
  changeCalendarDate: (newDate: Date) => void;
  changeModalVisible: (isModalOn: boolean) => void;
}

export const MoodNoteCalendar = ({
  changeModalVisible: changeModalVisible,
  date,
  changeCalendarDate,
  notes,
}: MoodNoteCalendarProp) => {
  return (
    <View style={styles.calendarContainer}>
      <TouchableOpacity onPress={() => changeModalVisible(true)}>
        <Text style={styles.monthPickerButton}>
          {date.getFullYear().toString()}년 {(date.getMonth() + 1).toString()}월
        </Text>
      </TouchableOpacity>
      <Text style={styles.moodNoteCount}>Mood Note({notes.size})</Text>
      <View style={{ height: 24 }} />
      <GridCalendar date={date} changeDate={changeCalendarDate} notes={notes} />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

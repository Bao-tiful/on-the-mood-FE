import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import GridCalendar from "@/src/components/calendar/GridCalendar";
import CalendarBottomNote from "./CalendarBottomNote";
import typography from "@/constants/Typography";
import Icon, { IconName } from "../Icon";
import { Colors } from "@/constants/Colors";

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
  const MonthPicker = (
    <TouchableOpacity onPress={() => changeModalVisible(true)}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.monthPickerLabel}>
          {/* month는 1월이 0부터 시작하기 때문에 1 더해줌 */}
          {date.getFullYear().toString()}년 {(date.getMonth() + 1).toString()}월
        </Text>

        <View style={styles.monthPickerIcon}>
          <Icon name={IconName.downWhite} size={12} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.calendarContainer}>
      <View>
        {/* 년,월 선택 버튼 */}
        {MonthPicker}
        <Text style={styles.moodNoteCount}>Mood Note({notes.size})</Text>
        <View style={{ height: 16 }} />
        <GridCalendar
          date={date}
          changeDate={changeCalendarDate}
          notes={notes}
        />
        {/* 투데이 셀 */}
      </View>
      <CalendarBottomNote date={date} note={notes.get(date.getDate())} />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  monthPickerLabel: {
    ...typography.title3,
    fontWeight: 800,
  },
  monthPickerIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.black100,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  moodNoteCount: {
    ...typography.title3,
    fontWeight: 600,
    color: Colors.black40,
  },
});

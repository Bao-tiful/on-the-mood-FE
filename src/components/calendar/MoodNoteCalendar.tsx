import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import GridCalendar from "@/src/components/calendar/GridCalendar";
import ThreadCalendarCell from "./ThreadCalendarCell";
import Icon, { IconName } from "../Icon";
import { Colors } from "@/src/styles/Colors";
import TodayNoteCell from "./TodayNoteCell";
import typography from "@/src/styles/Typography";
import { isDateToday } from "@/src/utils/dateUtils";

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
  const isToday = isDateToday(date);

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
    <View style={{ justifyContent: "space-between", flex: 1 }}>
      <View style={styles.calendarContainer}>
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
      <View style={[{ height: 224, borderRadius: 16, overflow: "hidden" }]}>
        {isToday && notes.get(date.getDate()) == undefined ? (
          <TodayNoteCell date={date} location={"서울특별시"} temperature={12} />
        ) : (
          <ThreadCalendarCell date={date} note={notes.get(date.getDate())} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
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

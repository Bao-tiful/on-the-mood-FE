import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import CalendarGrid from "@/src/components/calendar/CalendarGrid";
import ThreadCalendarCell from "./ThreadCalendarCell";
import Icon, { IconName } from "../Icon";
import { Colors } from "@/src/styles/Colors";
import TodayNoteCell from "./TodayNoteCell";
import typography from "@/src/styles/Typography";
import { getKrWeekday, isDateToday } from "@/src/utils/dateUtils";
import { LocationData } from "@/src/api/endpoints/weather";

interface CalendarContentProp {
  date: Date;
  notes: Map<number, NoteItem>;
  feelLikeTemp: number;
  location?: LocationData;
  changeCalendarDate: (newDate: Date) => void;
  changeModalVisible: (isModalOn: boolean) => void;
}

export const CalendarContent = ({
  changeModalVisible: changeModalVisible,
  date,
  changeCalendarDate,
  notes,
  feelLikeTemp,
  location,
}: CalendarContentProp) => {
  const isToday = isDateToday(date);

  const MonthPicker = (
    <TouchableOpacity onPress={() => changeModalVisible(true)}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.monthPickerLabel}>
          {/* month는 1월이 0부터 시작하기 때문에 1 더해줌 */}
          {date.getFullYear().toString()}.{(date.getMonth() + 1).toString()}
        </Text>

        <View style={styles.monthPickerIcon}>
          <Icon name={IconName.down} size={12} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ justifyContent: "space-between", flex: 1 }}>
      <View style={styles.calendarContainer}>
        {/* 년,월 선택 버튼 */}
        <Text style={styles.dateLabel}>
          {date.getDate().toString()}일 {getKrWeekday(date)}요일
        </Text>
        {MonthPicker}
        <View style={{ height: 16 }} />
        <CalendarGrid
          date={date}
          changeDate={changeCalendarDate}
          notes={notes}
        />
        {/* 투데이 셀 */}
      </View>
      <View style={[{ height: 224, borderRadius: 16, overflow: "hidden" }]}>
        {isToday && notes.get(date.getDate()) == undefined ? (
          <TodayNoteCell
            date={date}
            location={location}
            temperature={feelLikeTemp}
          />
        ) : (
          <ThreadCalendarCell
            date={date}
            note={notes.get(date.getDate())}
            location={location}
          />
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
    ...typography.title2,
  },
  monthPickerIcon: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: Colors.black18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  dateLabel: {
    ...typography.heading1,
    color: Colors.black40,
  },
});

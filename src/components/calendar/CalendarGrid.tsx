import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import {
  CalendarCell,
  EmptyCalendarCell,
  PlaceholderCalendarCell,
} from '@components/calendar/CalendarGridCell';
import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import { firstDayOfMonth, isSameDay, lastDayOfMonth } from '@/utils/dateUtils';
import { NoteItem } from '@/models/NoteItem';

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date | null;
  changeDate: (newDate: Date) => void;
  notes: Map<number, NoteItem>;
}

/// props로 입력된 currentDate가 포함된 월의 달력을 보여준다.
export const CalendarGrid = ({
  currentDate,
  selectedDate,
  changeDate,
  notes,
}: CalendarGridProps) => {
  // currentDate가 포함된 달의 첫째 날의 요일
  const firstDayOffset = firstDayOfMonth(currentDate).getDay();
  // currentDate가 포함된 달의 마지막 날짜
  const lastDate = lastDayOfMonth(currentDate).getDate();

  // 캘린더의 각 칸에 대한 id를 부여하는 list
  // 여기에서의 date는 각 칸이 가지는 날짜(N일)를 의미한다.
  const items = Array.from({ length: 7 * 6 }, (_, index) => ({
    date: index - firstDayOffset + 1,
  }));

  return (
    <View>
      <WeekdayNames />
      <FlatList
        data={items}
        renderItem={({ item }) => {
          let cellDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            item.date,
          );

          if (item.date > 0 && item.date <= lastDate) {
            // 1일부터 마지막 날까지

            let isSelected = selectedDate
              ? isSameDay(selectedDate, cellDate)
              : false;
            return (
              <CalendarCell
                isSelected={isSelected}
                date={cellDate}
                data={notes.get(item.date)}
                onPress={changeDate}
              />
            );
          } else {
            if (item.date > 0 && item.date - lastDate - cellDate.getDay() > 0) {
              return <PlaceholderCalendarCell />;
            } else {
              return <EmptyCalendarCell />;
            }
          }
        }}
        keyExtractor={item => item.date.toString()}
        numColumns={7}
        scrollEnabled={false}
      />
    </View>
  );
};

// 캘린더의 요일 목록
function WeekdayNames() {
  const weekdayNameList = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

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

const styles = StyleSheet.create({
  weekdayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weekdayCell: {
    ...typography.label2,
    flexDirection: 'row',
    flex: 1,
    textAlign: 'center',
    color: Colors.black40,
  },
});

export default CalendarGrid;

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, Animated } from 'react-native';
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
export const CalendarGrid = React.memo(
  ({ currentDate, selectedDate, changeDate, notes }: CalendarGridProps) => {
    // 애니메이션을 위한 opacity 값
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const prevCurrentDate = useRef(currentDate);

    // currentDate가 변경되면 페이드 애니메이션 실행
    useEffect(() => {
      const prevDate = prevCurrentDate.current;
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const prevMonth = prevDate.getMonth();
      const prevYear = prevDate.getFullYear();

      // 월이나 연도가 변경되었을 때만 애니메이션 실행
      if (currentMonth !== prevMonth || currentYear !== prevYear) {
        // 페이드 아웃 -> 페이드 인
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }

      prevCurrentDate.current = currentDate;
    }, [currentDate, fadeAnim]);

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
      <View style={styles.container}>
        <WeekdayNames />
        <Animated.View
          style={[styles.animatedContainer, { opacity: fadeAnim }]}
        >
          <FlatList
            style={styles.flatList}
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
                if (
                  item.date > 0 &&
                  item.date - lastDate - cellDate.getDay() > 0
                ) {
                  return <PlaceholderCalendarCell />;
                } else {
                  return <EmptyCalendarCell />;
                }
              }
            }}
            keyExtractor={item =>
              `${currentDate.getFullYear()}-${currentDate.getMonth()}-${
                item.date
              }`
            }
            numColumns={7}
            scrollEnabled={false}
            getItemLayout={(data, index) => ({
              length: 50, // 각 셀의 대략적인 높이
              offset: Math.floor(index / 7) * 50,
              index,
            })}
          />
        </Animated.View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // 주요 props가 변경되지 않았다면 리렌더링 방지
    return (
      prevProps.currentDate.getTime() === nextProps.currentDate.getTime() &&
      prevProps.selectedDate?.getTime() === nextProps.selectedDate?.getTime() &&
      prevProps.notes === nextProps.notes
    );
  },
);

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
  container: {
    overflow: 'visible', // 그림자가 잘리지 않도록
  },
  animatedContainer: {
    overflow: 'visible',
  },
  flatList: {
    overflow: 'visible', // 그림자가 잘리지 않도록
  },
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

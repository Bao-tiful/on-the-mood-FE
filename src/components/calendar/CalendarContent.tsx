import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import ThreadCalendarCell from './ThreadCalendarCell';
import Icon, { IconName } from '../Icon';
import { Colors } from '@/styles/Colors';
import TodayNoteCell from './TodayNoteCell';
import EmptyMonthCell from './EmptyMonthCell';
import typography from '@/styles/Typography';
import { getKrWeekday, isDateToday } from '@/utils/dateUtils';
import { LocationData } from '@/api/endpoints/weather';
import { useScreenSize } from '@/hooks/useScreenSize';
import { NoteItem } from '@/models/NoteItem';

interface CalendarContentProp {
  currentDate: Date;
  selectedDate: Date | null;
  notes: Map<number, NoteItem>;
  feelLikeTemp: number;
  location?: LocationData;
  changeCalendarDate: (newDate: Date) => void;
  changeModalVisible: (isModalOn: boolean) => void;
}

export const CalendarContent = ({
  changeModalVisible: changeModalVisible,
  currentDate,
  selectedDate,
  changeCalendarDate,
  notes,
  feelLikeTemp,
  location,
}: CalendarContentProp) => {
  // 기기별 ScreenHeight 에 따라 UI를 다르게 보여주기 위해 사용
  const { isLargeScreen } = useScreenSize();

  const isToday = selectedDate ? isDateToday(selectedDate) : false;

  const MonthPicker = (
    <TouchableOpacity onPress={() => changeModalVisible(true)}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[isLargeScreen ? typography.title2 : typography.title3]}>
          {/* month는 1월이 0부터 시작하기 때문에 1 더해줌 */}
          {currentDate.getFullYear().toString()}.
          {(currentDate.getMonth() + 1).toString().padStart(2, '0')}
        </Text>

        <View style={styles.monthPickerIcon}>
          <Icon name={IconName.down} size={12} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ justifyContent: 'space-between', flex: 1 }}>
      <View style={styles.calendarContainer}>
        <View
          style={[
            styles.dateLabelContainer,
            {
              flexDirection: isLargeScreen ? 'column' : 'row-reverse',
              alignItems: isLargeScreen ? 'flex-start' : 'center',
              justifyContent: isLargeScreen ? 'flex-start' : 'space-between',
            },
          ]}
        >
          {/* 년,월 선택 버튼 */}
          <Text
            style={[
              styles.dateLabel,
              isLargeScreen ? typography.heading1 : typography.heading2,
            ]}
          >
            {selectedDate
              ? `${selectedDate.getDate()}일 ${getKrWeekday(selectedDate)}요일`
              : `${currentDate.getFullYear()}.${(currentDate.getMonth() + 1)
                  .toString()
                  .padStart(2, '0')} 기록 없음`}
          </Text>
          {MonthPicker}
        </View>
        <View style={{ height: 8 }} />
        <CalendarGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          changeDate={changeCalendarDate}
          notes={notes}
        />
      </View>
      {/* 투데이 셀 */}
      <View
        style={[
          {
            flex: 1,
            minHeight: 135,
            maxHeight: 230,
            borderRadius: 16,
            overflow: 'hidden',
            shadowColor: Colors.black100,
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.04,
            shadowRadius: 16,
            elevation: 4, // Android shadow
          },
        ]}
      >
        {selectedDate === null ? (
          <EmptyMonthCell currentDate={currentDate} />
        ) : isToday && notes.get(selectedDate.getDate()) == undefined ? (
          <TodayNoteCell location={location} temperature={feelLikeTemp} />
        ) : (
          <ThreadCalendarCell
            date={selectedDate}
            note={notes.get(selectedDate.getDate())}
            location={location}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    // flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'visible', // 그림자가 잘리지 않도록 변경
  },
  dateLabelContainer: {
    flexGrow: 1,
    overflow: 'hidden',
  },
  monthPickerIcon: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: Colors.black18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  dateLabel: {
    color: Colors.black40,
  },
});

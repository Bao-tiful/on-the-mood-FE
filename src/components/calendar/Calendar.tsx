import { CalendarDatePicker } from '@/components/calendar/CalendarDatePicker';
import { CalendarContent } from '@/components/calendar/CalendarContent';
import { useMemo, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNotes } from '@/hooks/useNotes';
import { LocationData } from '@/api/endpoints/weather';
import React from 'react';
import { NoteItem } from '@/models/NoteItem';

interface CalendarProps {
  date: Date;
  updateDate: (newDate: Date) => void;
  location?: LocationData;
  feelLikeTemp: number;
  onSelectedDateChange?: (selectedDate: Date | null, noteData: any) => void;
  onRefresh?: (refreshFn: () => void) => void;
}

const Calendar = ({
  date,
  updateDate,
  location,
  feelLikeTemp,
  onSelectedDateChange,
  onRefresh,
}: CalendarProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  // 현재 보고 있는 달/년도 (달력 그리기용)
  const [currentDate, setCurrentDate] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1),
  );
  // 실제 선택된 날짜 (UI 표시용)
  const [selectedDate, setSelectedDate] = useState<Date | null>(date);
  // 사용자가 수동으로 날짜를 선택했는지 확인하는 상태
  const [isManualSelection, setIsManualSelection] = useState(false);

  const changeModalVisible = (isModalOn: boolean) => {
    setModalVisible(isModalOn);
  };

  const { notes, reloadNotes } = useNotes(currentDate);

  // 외부에서 onRefresh 콜백으로 reloadNotes 함수 제공
  useEffect(() => {
    if (onRefresh) {
      onRefresh(() => reloadNotes(currentDate));
    }
  }, [onRefresh, reloadNotes, currentDate]);

  const notesMap = useMemo(() => {
    const map = new Map<number, NoteItem>();
    // useNotes에서 이미 currentDate 기준으로 데이터를 받아오므로
    // 추가 필터링 없이 바로 날짜별로 매핑
    for (const note of notes) {
      map.set(note.created_at.getDate(), note);
    }
    return map;
  }, [notes]);

  // notes가 변경될 때마다 selectedDate를 가장 이른 날짜로 설정 (수동 선택이 아닌 경우에만)
  useEffect(() => {
    // 사용자가 수동으로 선택한 날짜가 있으면 자동 설정하지 않음
    if (isManualSelection) {
      return;
    }

    const today = new Date();
    const isTodayInThisMonth =
      today.getFullYear() === currentDate.getFullYear() &&
      today.getMonth() === currentDate.getMonth();

    if (notes.length > 0) {
      // 노트가 있으면 가장 이른 날짜 선택
      const sortedNotes = notes
        .slice()
        .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

      const earliestDate = sortedNotes[0].created_at;
      setSelectedDate(earliestDate);
      console.log('ETT', earliestDate.toDateString());
      
      // HomeScreen으로 선택된 날짜와 노트 정보 전달
      const noteData = notesMap.get(earliestDate.getDate());
      onSelectedDateChange?.(earliestDate, noteData);
    } else if (isTodayInThisMonth) {
      // 노트가 없고 오늘이 이 달에 있으면 오늘 선택
      setSelectedDate(today);
      onSelectedDateChange?.(today, null);
    } else {
      // 노트도 없고 오늘도 아니면 선택 없음
      setSelectedDate(null);
      onSelectedDateChange?.(null, null);
    }
  }, [notes, currentDate, notesMap, onSelectedDateChange, isManualSelection]);

  // 달 변경 시 해당 달의 첫 번째 노트 날짜로 자동 이동하는 로직
  const handleDateChange = (newDate: Date) => {
    const newYear = newDate.getFullYear();
    const newMonth = newDate.getMonth();
    const today = new Date();

    // 1. 달력은 새로운 달로 이동 (1일로 설정)
    setCurrentDate(new Date(newYear, newMonth, 1));
    
    // 2. 달이 바뀔 때는 수동 선택 상태를 초기화하여 자동 선택이 되도록 함
    setIsManualSelection(false);

    // 3. 오늘 날짜가 이 달에 포함되는지 확인
    const isTodayInThisMonth =
      today.getFullYear() === newYear && today.getMonth() === newMonth;

    // 4. 새로운 달의 노트들 찾기
    const monthNotes = notes.filter(note => {
      const noteYear = note.created_at.getFullYear();
      const noteMonth = note.created_at.getMonth() - 1;
      return noteYear === newYear && noteMonth === newMonth;
    });

    // 5. 선택 우선순위: 오늘 날짜 > 첫 번째 노트 > null
    if (isTodayInThisMonth) {
      // 오늘 날짜가 이 달에 있으면 오늘 선택
      updateDate(today);
      setSelectedDate(today);
    } else if (monthNotes.length > 0) {
      // 오늘이 아니고 노트가 있으면 첫 번째 노트 날짜 선택
      const sortedDates = monthNotes
        .map(note => note.created_at.getDate())
        .sort((a, b) => a - b);

      const firstNoteDate = new Date(newYear, newMonth, sortedDates[0]);
      updateDate(firstNoteDate);
      setSelectedDate(firstNoteDate);
    } else {
      // 오늘도 아니고 노트도 없으면 선택 없음
      updateDate(new Date(newYear, newMonth, 1));
      setSelectedDate(null);
    }
    console.log('selected date: ', selectedDate?.toISOString());
  };

  return (
    <>
      <View style={styles.container}>
        {/* 캘린더 */}
        <CalendarContent
          changeModalVisible={(isModalOn: boolean) => {
            setModalVisible(isModalOn);
          }}
          currentDate={currentDate}
          selectedDate={selectedDate}
          changeCalendarDate={(newDate: Date) => {
            setSelectedDate(newDate);
            setIsManualSelection(true); // 사용자가 수동으로 날짜를 선택했음을 표시
            // updateDate(newDate);
            
            // HomeScreen으로 선택된 날짜와 노트 정보 전달
            const noteData = notesMap.get(newDate.getDate());
            onSelectedDateChange?.(newDate, noteData);
          }}
          notes={notesMap}
          location={location}
          feelLikeTemp={feelLikeTemp}
        />
      </View>
      {/* ModalVisible에 의해 제어되는 바텀시트 */}
      <CalendarDatePicker
        initialDate={currentDate}
        modalVisible={modalVisible}
        changeModalVisible={changeModalVisible}
        changeCalendarDate={handleDateChange}
      />
    </>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 450,
    flexDirection: 'column',
    justifyContent: 'space-between',
    rowGap: 20,
  },
  todayContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    maxHeight: 250,
    columnGap: 2,
  },
  todayCell: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff88',
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
    width: '100%',
    fontWeight: 600,
  },
  todayWeatherLocation: {
    fontSize: 14,
    color: 'black',
  },
  todayWeatherTemperature: {
    fontSize: 48,
    fontWeight: 400,
    color: 'black',
  },
  todayWriteButton: {
    width: '40%',
    aspectRatio: 1,
    borderRadius: 1000,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 24,
  },
});

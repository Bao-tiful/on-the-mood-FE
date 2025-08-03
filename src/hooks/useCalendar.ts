import { useState } from 'react';

const useCalendar = (initialDate: Date) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const changeDate = (date: Date) => {
    setSelectedDate(date);
  };

  /// 선택된 날짜가 포함된 월의 1일의 요일
  /// 월요일이 1 ~ 일요일이 7
  const firstDayOffset = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  ).getDay();

  // 선택된 날짜가 포함된 월의 마지막 날짜
  const lastDate = new Date(
    new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      1
    ).getTime() - 1
  ).getDate();

  return { selectedDate, changeDate, firstDayOffset, lastDate };
};

export default useCalendar;

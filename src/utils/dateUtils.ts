/// 해당 날짜의 시간 정보를 생략하고, 날짜 정보만 남깁니다.
export const parseDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/// 해당 날짜가 오늘 날짜와 동일한 지 확인하고, boolean 값을 반환합니다.
export const isDateToday = (date: Date): boolean => {
  const today = new Date();

  return (
    date.getFullYear() == today.getFullYear() &&
    date.getMonth() == today.getMonth() &&
    date.getDate() == today.getDate()
  );
};

/// 해당 날짜가 포함된 달의 1일을 반환합니다.
/// 2025-01-23 12:34:56 => 2025-01-01 00:00:00 을 반환
export const firstDayOfMonth = (date: Date): Date => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

  return firstDay;
};

/// 해당 날짜가 포함된 달의 마지막 날짜를 반환합니다.
/// 2025-01-23 12:34:56 => 2025-01-31 00:00:00 을 반환
/// 2025-02-23 12:34:56 => 2025-02-28 00:00:00 을 반환
export const lastDayOfMonth = (date: Date): Date => {
  return parseDate(
    new Date(new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime() - 1)
  );
};

/// 두 Date 데이터가 같은 날짜에 속해있는지 확인하고, boolean 값을 반환합니다.
export const isSameDay = (from: Date, target: Date): boolean => {
  return (
    from.getFullYear() == target.getFullYear() &&
    from.getMonth() == target.getMonth() &&
    from.getDate() == target.getDate()
  );
};

/// yyyy.MM.dd. 의 형식으로 Date 데이터를 string 으로 변환해줍니다.
export const toDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}.`;
};

const weekdayKR = ['일', '월', '화', '수', '목', '금', '토'];

export const getKrWeekday = (date: Date): string => {
  return weekdayKR[date.getDay()];
};

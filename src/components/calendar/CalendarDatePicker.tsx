import { StyleSheet, View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import BottomSheet from '@components/BottomSheet';
import { ActionButton } from '@components/ActionButton';
import typography from '@/styles/Typography';
import { Colors } from '@/styles/Colors';
import { getUserProfile } from '@/utils/storage';

interface BottomSheetProps {
  initialDate: Date;
  modalVisible: boolean; // boolean이면 boolean으로 명확하게 타입 지정 가능
  changeCalendarDate: (newDate: Date) => void;
  changeModalVisible: (isModalOn: boolean) => void;
}

export const CalendarDatePicker = ({
  initialDate,
  modalVisible,
  changeCalendarDate,
  changeModalVisible,
}: BottomSheetProps) => {
  // 모달 내에서 사용할 임시 날짜값
  const [tempDate, setTempDate] = useState(initialDate);
  // 사용자 가입일과 현재 날짜 상태
  const [joinDate, setJoinDate] = useState<Date | null>(null);
  const [currentDate] = useState(new Date());

  // 사용자 프로필 로드하여 가입일 가져오기
  useEffect(() => {
    const loadUserProfile = async () => {
      const profile = await getUserProfile();
      if (profile && profile.date_joined) {
        // date_joined는 ISO 문자열 형태이므로 Date 객체로 변환
        setJoinDate(new Date(profile.date_joined));
      }
    };

    loadUserProfile();
  }, []);

  // 선택 가능한 연도 범위 계산
  const getAvailableYears = () => {
    if (!joinDate) return [];

    const joinYear = joinDate.getFullYear();
    const currentYear = currentDate.getFullYear();
    const years = [];

    for (let year = joinYear; year <= currentYear; year++) {
      years.push(year);
    }

    return years;
  };

  // 선택 가능한 월 범위 계산 (선택된 연도에 따라)
  const getAvailableMonths = (selectedYear: number) => {
    if (!joinDate) return [];

    const joinYear = joinDate.getFullYear();
    const joinMonth = joinDate.getMonth(); // 0-11
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-11

    let startMonth = 0;
    let endMonth = 11;

    // 가입 연도인 경우 가입 월부터 시작
    if (selectedYear === joinYear) {
      startMonth = joinMonth;
    }

    // 현재 연도인 경우 현재 월까지만
    if (selectedYear === currentYear) {
      endMonth = currentMonth;
    }

    const months = [];
    for (let month = startMonth; month <= endMonth; month++) {
      months.push(month);
    }

    return months;
  };

  const availableYears = getAvailableYears();
  const availableMonths = getAvailableMonths(tempDate.getFullYear());

  // 가입일 정보가 없거나 사용 가능한 연도가 없으면 로딩 또는 에러 상태
  if (!joinDate || availableYears.length === 0) {
    return (
      <View>
        <BottomSheet
          modalVisible={modalVisible}
          setModalVisible={changeModalVisible}
        >
          <View style={styles.bottomSheetContainer}>
            <Text style={styles.titleLable}>다른 날짜 일기 보기</Text>
            <Text style={styles.loadingText}>
              {!joinDate
                ? '사용자 정보를 불러오는 중...'
                : '선택 가능한 날짜가 없습니다.'}
            </Text>
          </View>
        </BottomSheet>
      </View>
    );
  }

  return (
    <View>
      <BottomSheet
        modalVisible={modalVisible}
        setModalVisible={changeModalVisible}
      >
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.titleLable}>다른 날짜 일기 보기</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={[styles.datePicker, styles.pickerStyle]}
              selectedValue={tempDate.getFullYear().toString()}
              onValueChange={(itemValue: string) => {
                const newYear = Number(itemValue);
                const availableMonthsForNewYear = getAvailableMonths(newYear);

                // 새로 선택한 연도에서 현재 선택된 월이 유효하지 않으면 첫 번째 유효한 월로 설정
                let newMonth = tempDate.getMonth();
                if (!availableMonthsForNewYear.includes(newMonth)) {
                  newMonth = availableMonthsForNewYear[0] || 0;
                }

                setTempDate(new Date(newYear, newMonth));
              }}
              itemStyle={styles.pickerItemStyle}
            >
              {availableYears.map(year => (
                <Picker.Item
                  key={year}
                  label={`${year}년`}
                  value={year.toString()}
                  color={Colors.black100}
                  style={styles.pickerItemTextStyle}
                />
              ))}
            </Picker>
            <Picker
              style={[styles.datePicker, styles.pickerStyle]}
              selectedValue={tempDate.getMonth().toString()}
              onValueChange={(itemValue: string) => {
                setTempDate(
                  new Date(tempDate.getFullYear(), Number(itemValue)),
                );
              }}
              itemStyle={styles.pickerItemStyle}
            >
              {availableMonths.map(monthIndex => (
                <Picker.Item
                  key={monthIndex}
                  label={`${monthIndex + 1}월`}
                  value={monthIndex.toString()}
                  color={Colors.black100}
                  style={styles.pickerItemTextStyle}
                />
              ))}
            </Picker>
          </View>
          <ActionButton
            title="보러가기"
            onPress={() => {
              changeCalendarDate(tempDate);
              changeModalVisible(false);
            }}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: '100%',
  },
  pickerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  datePicker: {
    flex: 1,
  },
  pickerStyle: {
    backgroundColor: Colors.white100,
    color: Colors.black100,
  },
  pickerItemStyle: {
    ...typography.body,
    fontWeight: '600',
    color: Colors.black100,
    fontSize: 18,
    height: 120,
  },
  pickerItemTextStyle: {
    ...typography.body,
    fontWeight: 600,
    color: Colors.black100,
  },
  titleLable: {
    ...typography.headline,
    color: Colors.black100,
  },
  loadingText: {
    ...typography.body,
    color: Colors.black70,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

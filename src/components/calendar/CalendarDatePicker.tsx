import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import BottomSheet from '@components/BottomSheet';
import typography from '@/styles/Typography';
import { Colors } from '@/styles/Colors';

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
              style={styles.datePicker}
              selectedValue={tempDate.getFullYear().toString()}
              onValueChange={(itemValue: string) => {
                setTempDate(new Date(Number(itemValue), tempDate.getMonth()));
              }}
            >
              <Picker.Item
                label="2024년"
                value="2024"
                color={Colors.black100}
                style={{
                  ...typography.body,
                  fontWeight: 600,
                  color: Colors.black100,
                }}
              />
              <Picker.Item
                label="2025년"
                value="2025"
                color={Colors.black100}
                style={{
                  ...typography.body,
                  fontWeight: 600,
                  color: Colors.black100,
                }}
              />
            </Picker>
            <Picker
              style={styles.datePicker}
              selectedValue={tempDate.getMonth().toString()}
              onValueChange={(itemValue: string) => {
                // TODO: iOS에서 disable 처리 로직 따로 필요함
                setTempDate(
                  new Date(tempDate.getFullYear(), Number(itemValue)),
                );
              }}
            >
              {Array.from({ length: 12 }, (_, i) => ({
                label: `${i + 1}월`, // 1월부터 12월까지
                value: i, // 0부터 11까지
              })).map((month, index) => (
                <Picker.Item
                  key={index}
                  label={month.label}
                  value={month.value.toString()}
                  enabled={true}
                  color={Colors.black100}
                  style={{
                    ...typography.body,
                    fontWeight: 600,
                    color: Colors.black100,
                  }}
                />
              ))}
            </Picker>
          </View>
          <TouchableOpacity
            style={styles.bottomSheetButton}
            onPress={() => {
              changeCalendarDate(tempDate);
              changeModalVisible(false);
            }}
          >
            <Text style={styles.bottomSheetButtonLabel}>보러가기</Text>
          </TouchableOpacity>
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
  bottomSheetButton: {
    backgroundColor: Colors.black100,
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    borderRadius: 28,
  },
  bottomSheetButtonLabel: {
    ...typography.body,
    fontWeight: 600,
    color: Colors.white100,
  },
  pickerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  datePicker: {
    flex: 1,
  },
  titleLable: {
    ...typography.headline,
    color: Colors.black100,
  },
});

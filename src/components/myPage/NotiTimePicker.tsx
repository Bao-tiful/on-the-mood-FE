import React from 'react';
import typography from '@/styles/Typography';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import BottomSheet from '../BottomSheet';
import { Colors } from '@/styles/Colors';

import { Meridiem, NotiTime } from '@/models/NotiTime';
import { ActionButton } from '../ActionButton';

interface NotiTimePickerProps {
  initialTime: NotiTime;
  modalVisible: boolean; // boolean이면 boolean으로 명확하게 타입 지정 가능
  changeNotiTime: (newTime: NotiTime) => void;
  changeModalVisible: (isModalOn: boolean) => void;
}

export const NotiTimePicker = ({
  initialTime,
  modalVisible,
  changeNotiTime,
  changeModalVisible,
}: NotiTimePickerProps) => {
  // 모달 내에서 사용할 임시 시간값
  const [hour, setHour] = useState<number>(initialTime.hour);
  const [minute, setMinute] = useState<number>(initialTime.minute);
  const [meridiem, setMeridiem] = useState(initialTime.meridiem);

  useEffect(() => {
    setHour(initialTime.hour);
    setMinute(initialTime.minute);
    setMeridiem(initialTime.meridiem);
  }, [initialTime]);

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
              selectedValue={meridiem}
              onValueChange={(itemValue: Meridiem) => {
                setMeridiem(itemValue);
              }}
            >
              <Picker.Item
                label="오전"
                value={Meridiem.AM}
                color={Colors.black100}
                style={{
                  ...typography.body,
                  fontWeight: 600,
                  color: Colors.black100,
                }}
              />
              <Picker.Item
                label="오후"
                value={Meridiem.PM}
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
              selectedValue={hour}
              onValueChange={(itemValue: number) => {
                setHour(itemValue);
              }}
            >
              {Array.from({ length: 12 }, (_, i) => ({
                label: `${(i + 1).toString().padStart(2, '0')}`, // 01부터 12까지
                value: i + 1, // 1부터 12까지
              })).map((month, index) => (
                <Picker.Item
                  key={index}
                  label={month.label}
                  value={month.value}
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
            <Picker
              style={styles.datePicker}
              selectedValue={minute}
              onValueChange={(itemValue: number) => {
                setMinute(itemValue);
              }}
            >
              {Array.from({ length: 6 }, (_, i) => ({
                label: `${(i * 10).toString().padStart(2, '0')}`,
                value: i * 10, // 0, 10, 20, 30, 40, 50
              })).map((minute, index) => (
                <Picker.Item
                  key={index}
                  label={minute.label}
                  value={minute.value}
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
          <ActionButton
            title="변경하기"
            onPress={() => {
              const newNotiTime: NotiTime = {
                hour: hour,
                minute: minute,
                meridiem: meridiem,
              };
              console.log('NEW', newNotiTime);
              changeNotiTime(newNotiTime);
              changeModalVisible(false);
            }}
            variant="default"
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  topToolbar: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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

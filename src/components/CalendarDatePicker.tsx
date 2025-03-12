import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import BottomSheet from "./BottomSheet";
import { Picker } from "@react-native-picker/picker";

interface BottomSheetProps {
  modalVisible: boolean; // boolean이면 boolean으로 명확하게 타입 지정 가능
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  initialDate: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

export default function CalendarDatePicker({
  modalVisible,
  setModalVisible,
  initialDate,
  setDate,
}: BottomSheetProps) {
  const [tempDate, setTempDate] = useState(initialDate);

  return (
    <View>
      <BottomSheet
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      >
        <View style={styles.bottomSheetContainer}>
          <Text>다른 날짜 일기 보기</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.datePicker}
              selectedValue={tempDate.getFullYear().toString()}
              onValueChange={(itemValue: string) => {
                setTempDate(new Date(Number(itemValue), tempDate.getMonth()));
              }}
            >
              <Picker.Item label="2024년" value="2024" />
              <Picker.Item label="2025년" value="2025" />
            </Picker>
            <Picker
              style={styles.datePicker}
              selectedValue={tempDate.getMonth().toString()}
              onValueChange={(itemValue: string) => {
                // TODO: iOS에서 disable 처리 로직 따로 필요함
                setTempDate(
                  new Date(tempDate.getFullYear(), Number(itemValue))
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
                />
              ))}
            </Picker>
          </View>
          <TouchableOpacity
            style={styles.bottomSheetButton}
            onPress={() => {
              setDate(tempDate);
              setModalVisible(false);
            }}
          >
            <Text>변경하기</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: "100%",
  },
  bottomSheetButton: {
    backgroundColor: "orange",

    width: "100%",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 16,
  },
  pickerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  datePicker: {
    flex: 1,
  },
});

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

type CalendarBottomNoteProps = {
  date: Date;
};

const CalendarBottomNote = ({ date }: CalendarBottomNoteProps) => {
  const todayWeatherCell = (
    <View style={[styles.todayCell, styles.todayWeatherCell]}>
      <Text style={styles.todayCellTitle}>
        {date.getDate() + " Day \nOndo"}
      </Text>
      <View style={{ width: "100%" }}>
        {/* TODO: 핀 아이콘 변경 */}
        <Text style={styles.todayWeatherLocation}>📍 서울특별시</Text>
        <Text style={styles.todayWeatherTemperature}>4°</Text>
      </View>
    </View>
  );
  const todayNoteCell = (
    <View style={[styles.todayCell, styles.todayNoteCell]}>
      <Text style={styles.todayCellTitle}>{"Today\nMood Note"}</Text>
      <View style={{ width: "100%" }}>
        <TouchableOpacity style={styles.todayWriteButton}>
          {/* TODO: + 아이콘 변경 */}
          <Text
            style={{
              color: styles.todayWriteButton.color,
              fontSize: styles.todayWriteButton.fontSize,
            }}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.todayContainer}>
      {todayWeatherCell}
      {todayNoteCell}
    </View>
  );
};

export default CalendarBottomNote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 450,
    flexDirection: "column",
    justifyContent: "space-between",
    rowGap: 20,
  },
  todayContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    maxHeight: 250,
    columnGap: 2,
  },
  todayCell: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#ffffff88",
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
    width: "100%",
    fontWeight: 600,
  },
  todayWeatherLocation: {
    fontSize: 14,
    color: "black",
  },
  todayWeatherTemperature: {
    fontSize: 48,
    fontWeight: 400,
    color: "black",
  },
  todayWriteButton: {
    width: "40%",
    aspectRatio: 1,
    borderRadius: "50%",
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: 24,
  },
});

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ToolbarButton } from "../ToolbarButton";

type CalendarBottomNoteProps = {
  date: Date;
  note: NoteItem | undefined;
};

const CalendarBottomNote = ({ date, note }: CalendarBottomNoteProps) => {
  const todayWeatherCell = (
    <View style={[styles.todayCell, styles.todayWeatherCell]}>
      <Text style={styles.todayCellTitle}>
        {date.getDate() + " Day \nOndo"}
      </Text>
      <View style={{ width: "100%" }}>
        {/* TODO: 핀 아이콘 변경 */}
        <Text style={styles.todayWeatherLocation}>📍 서울특별시</Text>
        <Text style={styles.todayWeatherTemperature}>
          {note?.temperature ?? "-"}°
        </Text>
      </View>
    </View>
  );
  const todayNoteCell = (
    <View style={[styles.todayCell, styles.todayNoteCell]}>
      <View style={{ flexDirection: "row", paddingHorizontal: 0 }}>
        <Text style={styles.todayCellTitle}>{"Today\nMood Note"}</Text>
        {note != undefined ? (
          <ToolbarButton name="arrow-right" onPress={() => {}} />
        ) : (
          <View />
        )}
      </View>
      <View style={{ width: "100%" }}>
        {note != undefined ? (
          <View />
        ) : (
          <TouchableOpacity style={styles.todayWriteButton}>
            <Text
              style={{
                color: styles.todayWriteButton.color,
                fontSize: styles.todayWriteButton.fontSize,
              }}
            >
              {/* // TODO: 아이콘 변경  */}+
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.todayCellContent}>{note?.content}</Text>
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
    flex: 1,
    flexDirection: "row",
    textAlign: "left",
    fontWeight: 600,
    width: "100%",
  },
  todayCellContent: {
    overflow: "hidden",
    textOverflow: "...",
    maxHeight: 100,
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

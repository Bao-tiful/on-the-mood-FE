import { Colors } from "@/src/styles/Colors";
import typography from "@/src/styles/Typography";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon, { IconName } from "../Icon";
import { ToolbarButton } from "../ToolbarButton";

type ThreadCalendarCellProps = {
  date: Date;
  note: NoteItem | undefined;
};

const ThreadCalendarCell = ({ date, note }: ThreadCalendarCellProps) => {
  const WeatherCell = (
    <View style={[styles.todayCell]}>
      <Text style={styles.todayCellTitle}>
        {date.getDate() + " Day \nOndo"}
      </Text>
      <View style={{ width: "100%" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name={IconName.location} size={17} />
          <Text style={styles.todayWeatherLocation}> 서울특별시</Text>
        </View>
        <Text style={styles.todayWeatherTemperature}>
          {note?.custom_temp ?? "-"}°
        </Text>
      </View>
    </View>
  );
  const NoteCell = (
    <View style={[styles.todayCell]}>
      <View style={{ flexDirection: "row", paddingHorizontal: 0 }}>
        <Text style={styles.todayCellTitle}>{"Today\nMood Note"}</Text>
        {note != undefined ? (
          <ToolbarButton name={IconName.arrow} onPress={() => {}} />
        ) : (
          <View />
        )}
      </View>
      <View style={{ width: "100%" }}>
        <Text style={styles.todayCellContent}>{note?.content}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {WeatherCell}
      {NoteCell}
    </View>
  );
};

export default ThreadCalendarCell;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    maxHeight: 250,
    columnGap: 1,
  },
  todayCell: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    backgroundColor: Colors.white40,
  },
  todayCellTitle: {
    flex: 1,
    flexDirection: "row",
    textAlign: "left",
    width: "100%",
    ...typography.label1,
    fontWeight: 700,
    color: Colors.black100,
  },
  todayCellContent: {
    ...typography.body2,
    color: Colors.black100,
    textOverflow: "...",
    maxHeight: 110,
  },
  todayWeatherLocation: {
    ...typography.label1,
    fontWeight: 600,
    color: Colors.black100,
  },
  todayWeatherTemperature: {
    ...typography.title1,
    color: Colors.black100,
  },
});

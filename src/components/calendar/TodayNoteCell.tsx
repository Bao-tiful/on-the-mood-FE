import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import typography from "@/constants/Typography";
import Icon, { IconName } from "../Icon";

type TodayNoteCellProps = {
  date: Date;
  location: string;
  temperature: number;
};

const TodayNoteCell = ({ date, location, temperature }: TodayNoteCellProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.todayCell}>
        <Text style={styles.todayCellTitle}>{"Today \nOndo"}</Text>
        <View style={{ width: "100%" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name={IconName.location} size={17} />
            <Text style={styles.todayWeatherLocation}> {location}</Text>
          </View>
          <Text style={styles.todayWeatherTemperature}>
            {temperature ?? "-"}°
          </Text>
        </View>
      </View>
      <View style={styles.todayCell}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 8,
          }}
        >
          <Text style={styles.todayCellTitle}>{"Today \nMood Note"}</Text>
          <Text style={styles.todayCellDescription}>
            {"오늘의 하루를 \n+버튼을 눌러 기록해보세요."}
          </Text>
        </View>
        <TouchableOpacity style={styles.todayWriteButton}>
          {/* + SVG 아이콘의 색상 변경이 불가능해, 우선은 텍스트로 넣었음 */}
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
};

export default TodayNoteCell;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    maxHeight: 250,
    columnGap: 8,
  },
  todayCell: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    borderColor: Colors.black32,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  todayCellTitle: {
    textAlign: "left",
    width: "100%",
    ...typography.label1,
    fontWeight: 700,
    color: Colors.black100,
  },
  todayCellDescription: {
    flexDirection: "row",
    textAlign: "left",
    width: "100%",
    ...typography.label3,
    color: Colors.black32,
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
  todayWriteButton: {
    width: 68,
    aspectRatio: 1,
    borderRadius: "50%",
    backgroundColor: Colors.black100,
    alignItems: "center",
    justifyContent: "center",
    color: Colors.white100,
    fontSize: 24,
  },
});

import { LocationData } from "@/src/api/endpoints/weather";
import { Colors } from "@/src/styles/Colors";
import typography from "@/src/styles/Typography";
import { isDateToday } from "@/src/utils/dateUtils";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon, { IconName } from "../Icon";
import { ToolbarButton } from "../ToolbarButton";

type ThreadCalendarCellProps = {
  date: Date;
  note: NoteItem | undefined;
  location?: LocationData;
};

const ThreadCalendarCell = ({
  date,
  note,
  location,
}: ThreadCalendarCellProps) => {
  const WeatherCell = (
    <View style={[styles.todayCell]}>
      <Text style={styles.todayCellTitle}>{"오늘의 \n체감 온도"}</Text>
      <View style={{ width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Icon name={IconName.location} size={17} />
          <Text style={[styles.todayWeatherLocation]}>{location?.name_ko}</Text>
        </View>
        <Text style={[styles.temperature, typography.title1]}>{77}°</Text>
        <View style={styles.feelsLikeBox}>
          <Icon name={IconName.temperature} size={16} />
          <Text style={[styles.feelsLikeText, typography.label2]}>
            체감 {note?.custom_temp}°
          </Text>
        </View>
      </View>
    </View>
  );

  const NoteCell = (
    <View style={[styles.todayCell]}>
      <View style={{ flexDirection: "row", paddingHorizontal: 0 }}>
        <Text style={styles.todayCellTitle}>{"무드온도\n일기"}</Text>
        {note !== undefined ? (
          <ToolbarButton
            name={IconName.arrow}
            onPress={() => {
              if (isDateToday(note?.created_at)) {
                router.push({
                  pathname: "/pages/EditPage",
                  // TODO: feelsLikeTempData를 오늘의 체감온도로 수정해주기
                  // 이 데이터는 note에 들어있을 예정이라, note에서 값 가져와도 좋을 것 같음
                  params: {
                    noteData: JSON.stringify(note),
                    locationData: JSON.stringify(location),
                  },
                });
              } else {
                router.push({
                  pathname: "/pages/DetailPage",
                  params: { noteData: JSON.stringify(note) },
                });
              }
            }}
          />
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
    gap: 2,
  },
  todayCell: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    backgroundColor: Colors.white40,
    borderRadius: 16,
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
    color: Colors.black70,
  },
  todayWeatherTemperature: {
    ...typography.title1,
    color: Colors.black100,
  },
  feelsLikeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 5,
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: Colors.black18,
  },
  feelsLikeText: {
    color: Colors.black70,
  },
  temperature: {
    color: Colors.black100,
  },
});

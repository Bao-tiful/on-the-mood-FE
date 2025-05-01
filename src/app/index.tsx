import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { IconName } from "../components/Icon";
import { ToolbarButton } from "../components/ToolbarButton";
import Calendar from "../components/calendar/Calendar";
import Threads from "../components/calendar/Threads";
import { Colors, OndoColors } from "../styles/Colors";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { getWeather, LocationData } from "../api/endpoints/weather";

export default function HomeScreen() {
  const [isGridMode, setIsGreedMode] = useState(true);
  const [date, setDate] = useState(new Date());
  const [todayTemperature, setTodayTemperature] = useState(0);
  const [location, setLocation] = useState<LocationData | null>(null);

  const { geoLocation } = useGeoLocation();

  useEffect(() => {
    const getTemperature = async () => {
      if (geoLocation)
        await getWeather({
          latitude: geoLocation?.latitude,
          longitude: geoLocation?.longitude,
        }).then((weatherData) => {
          setLocation(weatherData.location);
          setTodayTemperature(weatherData.avg_feels_like_temp);
        });
    };

    getTemperature();
  }, [geoLocation]);

  const updateDate = (newDate: Date) => {
    setDate(newDate);
  };

  return (
    <View
      style={[
        styles.background,
        {
          backgroundColor: OndoColors.get(todayTemperature) ?? Colors.white100,
        },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={[styles.safeArea]}>
        <View style={styles.topToolbar}>
          <ToolbarButton
            name={IconName.profile}
            onPress={async () => {
              // 디버깅을 위해 해당 버튼을 누르면 로그인 페이지로 이동하도록 연결
              router.replace("/pages/Auth/Entrance");
            }}
          />
          <ToolbarButton
            name={IconName.list}
            onPress={() => {
              setIsGreedMode(!isGridMode);
            }}
          />
        </View>
        <View style={isGridMode ? styles.content : styles.thread}>
          {isGridMode ? (
            <Calendar
              date={date}
              updateDate={updateDate}
              location={location ?? undefined}
              feelLikeTemp={todayTemperature}
            />
          ) : (
            <Threads updateDate={updateDate} />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
  },
  topToolbar: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
  },
  thread: {
    flex: 1,
    width: "100%",
  },
});

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import { IconName } from '../components/Icon';
import { ToolbarButton } from '../components/ToolbarButton';
import Calendar from '../components/calendar/Calendar';
import Threads from '../components/calendar/thread/Threads';
import { Colors, OndoColors } from '../styles/Colors';
import { useGeoLocation } from '../hooks/useGeoLocation';
import { getWeather, LocationData } from '../api/endpoints/weather';
import { useBackgroundColor } from '../hooks/useBackgroundColor';

export default function HomeScreen() {
  const [isGridMode, setIsGreedMode] = useState(true);
  const [date, setDate] = useState(new Date());
  const [todayTemperature, setTodayTemperature] = useState(0);
  const { setBackgroundColor } = useBackgroundColor();
  const [location, setLocation] = useState<LocationData | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { geoLocation } = useGeoLocation();

  useEffect(() => {
    const getTemperature = async () => {
      if (geoLocation) {
        await getWeather({
          latitude: geoLocation?.latitude,
          longitude: geoLocation?.longitude,
        }).then(weatherData => {
          setLocation(weatherData.location);
          setTodayTemperature(weatherData.avg_feels_like_temp);
          setBackgroundColor(weatherData.avg_feels_like_temp);
        });
      }
    };

    getTemperature();
  }, [geoLocation, setBackgroundColor]);

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
      <SafeAreaView style={[styles.safeArea]}>
        <View style={styles.topToolbar}>
          <ToolbarButton
            name={IconName.profile}
            onPress={async () => {
              navigation.navigate('MyPage');
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
    alignItems: 'center',
  },
  topToolbar: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  thread: {
    flex: 1,
    width: '100%',
  },
});

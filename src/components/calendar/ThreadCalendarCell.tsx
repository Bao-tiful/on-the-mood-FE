import { LocationData } from '@/api/endpoints/weather';
import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon, { IconName } from '../Icon';
import { ToolbarButton } from '../ToolbarButton';
import { NoteItem } from '@/models/NoteItem';
import { isDateToday } from '@/utils/dateUtils';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';

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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const WeatherCell = (
    <View style={[styles.todayCell]}>
      <Text style={styles.todayCellTitle}>{'오늘의 \n체감 온도'}</Text>
      <View style={{ width: '100%' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <Icon name={IconName.location} size={17} />
          <Text style={[styles.todayWeatherLocation]}>{location?.name_ko}</Text>
        </View>
        <Text style={[styles.temperature, typography.title1]}>
          {note?.avg_feels_like_temp}°
        </Text>
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
    <TouchableOpacity
      style={[styles.todayCell]}
      onPress={() => {
        if (note) {
          if (isDateToday(note.created_at)) {
            navigation.navigate('EditPage', {
              selectedDate: date.toISOString(),
              noteData: JSON.stringify(note),
              locationData: JSON.stringify(location),
            });
          } else {
            navigation.navigate('DetailPage', {
              noteData: JSON.stringify(note),
            });
          }
        }
      }}
    >
      <View style={styles.diaryHeader}>
        <View>
          <Text style={[styles.label, typography.label1]}>무드온도</Text>
          <Text style={[styles.label, typography.label1]}>일기</Text>
        </View>
        {note !== undefined ? (
          <View style={styles.iconContainer}>
            <Icon name={IconName.arrow} />
          </View>
        ) : (
          <View />
        )}
      </View>
      <Text
        style={[styles.diaryText, typography.body2]}
        numberOfLines={5}
        ellipsizeMode="tail"
      >
        {note?.content}
      </Text>
    </TouchableOpacity>
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
    flexDirection: 'row',
    width: '100%',
    maxHeight: 250,
    columnGap: 1,
    gap: 2,
  },
  todayCell: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
    backgroundColor: Colors.white40,
    borderRadius: 16,
  },
  diaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  label: {
    color: Colors.black100,
  },
  diaryText: {
    marginTop: 8,
    color: Colors.black70,
    maxHeight: 105,
    overflow: 'hidden',
    width: '100%',
    textAlign: 'left',
  },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
    backgroundColor: Colors.black18,
  },
  todayCellTitle: {
    flex: 1,
    flexDirection: 'row',
    textAlign: 'left',
    width: '100%',
    ...typography.label1,
    fontWeight: 700,
    color: Colors.black100,
  },
  todayCellContent: {
    ...typography.body2,
    color: Colors.black100,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 5,
    marginTop: 4,
    alignSelf: 'flex-start',
    backgroundColor: Colors.black18,
  },
  feelsLikeText: {
    color: Colors.black70,
  },
  temperature: {
    color: Colors.black100,
  },
});

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import Icon, { IconName } from '../Icon';
import { LocationData } from '@/api/endpoints/weather';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';

type TodayNoteCellProps = {
  temperature: number;
  location?: LocationData;
};

const TodayNoteCell = ({ location, temperature }: TodayNoteCellProps) => {
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
          <Icon name={IconName.location} size={17} color={Colors.black70} />
          <Text style={[styles.todayWeatherLocation]}>
            {location?.name_ko ?? ' -'}
          </Text>
        </View>
        <View style={styles.feelsLikeBox}>
          <Icon name={IconName.temperature} size={16} />
          <Text style={[styles.feelsLikeText, typography.label2]}>
            체감 {temperature}°
          </Text>
        </View>
      </View>
    </View>
  );

  const NoteCell = (
    <View style={styles.todayCell}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={styles.todayCellTitle}>{'무드온도\n일기'}</Text>
        <TouchableOpacity
          style={styles.todayWriteButton}
          onPress={() => {
            const today = new Date();
            navigation.navigate('EditPage', {
              selectedDate: today.toISOString(),
              locationData: JSON.stringify(location),
            });
          }}
        >
          <Icon name={IconName.plus} size={24} />
        </TouchableOpacity>
        <Text style={styles.todayCellDescription}>
          {'버튼을 눌러\n오늘 하루를 기록해보세요\n* 당일에만 기록할 수 있어요'}
        </Text>
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

export default TodayNoteCell;

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
  todayCellTitle: {
    textAlign: 'left',
    width: '100%',
    alignSelf: 'flex-start',
    ...typography.label1,
    fontWeight: 700,
    color: Colors.black100,
  },
  todayCellDescription: {
    flexDirection: 'row',
    textAlign: 'center',
    width: '100%',
    ...typography.label3,
    color: Colors.black32,
  },
  todayCellContent: {
    ...typography.body2,
    color: Colors.black100,
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
    borderRadius: 1000,
    backgroundColor: Colors.black18,
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.white100,
    fontSize: 24,
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

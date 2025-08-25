import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import Icon, { IconName } from '../Icon';

interface EmptyMonthCellProps {
  currentDate: Date;
}

const EmptyMonthCell = ({ currentDate }: EmptyMonthCellProps) => {
  const WeatherCell = (
    <View style={[styles.todayCell]}>
      <Text style={styles.todayCellTitle}>
        {currentDate.getMonth() + 1 + '월의 \n기록 온도'}
      </Text>
      <View style={{ width: '100%' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <Icon name={IconName.location} size={17} color={Colors.black70} />
          <Text style={[styles.todayWeatherLocation]}>-</Text>
        </View>
      </View>
    </View>
  );

  const NoteCell = (
    <View style={[styles.todayCell]}>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.todayCellTitle}>{'무드온도\n일기'}</Text>
      </View>
      <View style={{ width: '100%' }}>
        <Icon name={IconName.sad} size={70} color={Colors.black32} />
        <Text
          style={styles.todayCellContent}
        >{`해당 달에는\n작성한 일기가 없어요.`}</Text>
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

export default EmptyMonthCell;

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
    color: Colors.black70,
    maxHeight: 110,
    marginTop: 8,
  },
  todayWeatherLocation: {
    ...typography.label1,
    color: Colors.black70,
  },
  todayWeatherTemperature: {
    ...typography.title1,
    color: Colors.black100,
  },
});

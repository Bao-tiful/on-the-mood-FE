import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';

interface EmptyMonthCellProps {
  currentDate: Date;
}

const EmptyMonthCell = ({ currentDate }: EmptyMonthCellProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.emptyCell}>
        <Text style={styles.title}>
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </Text>
        <Text style={styles.description}>
          이 달에는 기록이 없습니다.
        </Text>
        <Text style={styles.subDescription}>
          달력에서 날짜를 선택하여 새로운 기록을 작성해보세요.
        </Text>
      </View>
    </View>
  );
};

export default EmptyMonthCell;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    minHeight: 135,
    maxHeight: 230,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyCell: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.black18,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    backgroundColor: Colors.white100,
  },
  title: {
    ...typography.label1,
    fontWeight: 700,
    color: Colors.black70,
    marginBottom: 8,
  },
  description: {
    ...typography.body2,
    color: Colors.black40,
    textAlign: 'center',
    marginBottom: 4,
  },
  subDescription: {
    ...typography.label3,
    color: Colors.black32,
    textAlign: 'center',
    lineHeight: 16,
  },
});
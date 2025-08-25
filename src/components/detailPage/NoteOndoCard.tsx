import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import typography from '@/styles/Typography';
import { Colors, OndoColors } from '@/styles/Colors';
import Tooltip from '../feedback/Tooltip';
import Icon, { IconName } from '../Icon';
import Toast from 'react-native-toast-message';
import { NoteItem } from '@/models/NoteItem';

const NoteOndoCard = ({ note }: { note: NoteItem }) => {
  const maxTemp = 40;
  const minTemp = -40;

  const copyColorCode = () => {
    // TODO: 클립보드 복사 기능 구현
    console.log('색상 코드 복사:', OndoColors.get(note.custom_temp));
  };

  return (
    <View
      style={{
        backgroundColor: Colors.black18,
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderRadius: 16,
      }}
    >
      {/* 노트 온도 레이블 */}
      <View style={styles.rowContainer}>
        <Text style={styles.sectionTitle}>{'Note\nOndo'}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[typography.display2]}>{note.custom_temp}°</Text>
        </View>
      </View>
      <View style={{ height: 8 }} />
      {/* 노트 온도 차트 */}
      <View style={styles.backgroundContainer}>
        <View style={styles.minMaxLabelRow}>
          <Text style={styles.minMaxLabel}>{minTemp}°</Text>
          <Text style={styles.minMaxLabel}>{maxTemp}°</Text>
        </View>
        <View style={styles.backgroundTrack}>
          {Array.from({ length: 40 - -40 + 1 }).map((_, index) => (
            <View
              style={[
                styles.backgroundTrackItem,
                // 해당 체감온도에 해당하는 칸은 색상 구분
                index <= note.custom_temp + 40
                  ? { backgroundColor: Colors.black40 }
                  : { backgroundColor: Colors.black18 },
              ]}
              key={index}
            />
          ))}
        </View>
      </View>
      <View style={{ height: 24 }} />
      {/* 노트 컬러 코드*/}
      <View style={styles.rowContainer}>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Text style={styles.sectionTitle}>{'Mood\nColor Code'}</Text>
          <Tooltip
            title={'💡 Mood Code란?'}
            content={
              '이 코드는 여러분의 감정온도를 기반으로 생성된 색상 값입니다. HEX 컬러 코드를 복사하여 다양한 곳에서 활용해보세요!'
            }
            children={<Icon name={IconName.info} size={24} />}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            Toast.show({
              type: 'info',
              text1: '컬러코드를 복사했어요',
              visibilityTime: 2000,
            });
            copyColorCode();
          }}
        >
          <View style={styles.colorCodeContainer}>
            <Text style={styles.colorCode}>
              {OndoColors.get(note.custom_temp)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoteOndoCard;

const styles = StyleSheet.create({
  backgroundContainer: {
    height: 32,
    flexDirection: 'column',
  },
  minMaxLabelRow: {
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'space-between',
    top: -30,
    left: 0,
    right: 0,
    bottom: 0,
  },
  minMaxLabel: {
    color: Colors.black40,
    ...typography.body,
  },
  backgroundTrack: {
    height: 32,
    width: '101%',
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backgroundTrackItem: {
    backgroundColor: Colors.black18,
    height: '100%',
    width: 2,
    borderRadius: 1000,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.label1,
    color: Colors.black100,
    fontWeight: 'bold',
  },
  colorCode: {
    ...typography.headline,
    color: Colors.black100,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  colorCodeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: Colors.black18,
    borderRadius: 8,
  },
});

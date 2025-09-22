import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { ToolbarButton } from '@/components/ToolbarButton';
import { IconName } from '@/components/Icon';
import { Colors, OndoColors } from '@/styles/Colors';
import NoteInfoCell from '@/components/detailPage/DateLocationCell';
import NoteContent from '@/components/detailPage/NoteContent';
import typography from '@/styles/Typography';
import NoteOndoCard from '@/components/detailPage/NoteOndoCard';
import { NoteItem } from '@/models/NoteItem';

type DetailPageRouteProp = RouteProp<
  { DetailPage: { noteData: string } },
  'DetailPage'
>;

const DetailPage = () => {
  const route = useRoute<DetailPageRouteProp>();
  const navigation = useNavigation();
  const { noteData } = route.params;
  const [note, setNote] = useState<NoteItem | undefined>(undefined);

  useEffect(() => {
    try {
      if (Array.isArray(noteData)) {
        throw new Error('noteData가 string[] 타입입니다');
      }

      if (noteData) {
        const parsedNote = JSON.parse(noteData);
        // TODO: JSON -> NoteItem 만드는 Util 함수 추가하기
        setNote({
          id: parsedNote.id,
          location: parsedNote.location,
          custom_temp: parsedNote.custom_temp,
          avg_feels_like_temp: parsedNote.avg_feels_like_temp,
          content: parsedNote.content,
          created_at: new Date(parsedNote.created_at),
          updated_at: new Date(parsedNote.updated_at),
        });
      }
    } catch (error) {
      console.error('유효하지 않은 JSON을 변환하려 합니다 :', error);
    }
  }, [noteData]);

  return (
    <View
      style={[
        styles.mainContainer,
        {
          // 작성한 온도에 따른 배경색 지정
          backgroundColor: OndoColors.get(note?.custom_temp ?? 0),
        },
      ]}
    >
      <SafeAreaView style={styles.container}>
        {/* 툴바 */}
        <View style={styles.topToolbar}>
          <ToolbarButton
            name={IconName.back}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        {/* 컨텐츠 */}
        {note !== undefined && note.created_at instanceof Date && (
          <View style={styles.contentContainer}>
            {/* 날짜 / 지역 */}
            <NoteInfoCell
              createdAt={note.created_at}
              location={note.location}
              feelLikeTemp={note.avg_feels_like_temp} // TODO: 실제 체감온도로 변경해주기
            />
            {/* 노트 정보 */}
            <View style={styles.noteInfoContainer}>
              <NoteContent note={note} />
              <NoteOndoCard note={note} />
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default DetailPage;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginHorizontal: 12,
  },
  topToolbar: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginHorizontal: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentContainer: {
    justifyContent: 'space-between',
    flex: 1,
    marginTop: 16,
  },
  noteInfoContainer: {
    gap: 32,
  },
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
});

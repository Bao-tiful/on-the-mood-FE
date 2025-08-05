import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { IconName } from '@/components/Icon';
import { ToolbarButton } from '@/components/ToolbarButton';
import LocationAndTemperature from '@/components/editpage/LocationAndTemperature';
import NoteEditor from '@/components/editpage/NoteEditor';
import TemperatureSlider from '@/components/editpage/TemperatureSlider';
import typography from '@/styles/Typography';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

type EditPageRouteParams = {
  noteData?: string;
  locationData?: string;
};
import React, { useEffect, useMemo, useState } from 'react';
import { Colors, OndoColors } from '@/styles/Colors';
import { editNote, postNote } from '@/api/endpoints/daily-notes';
import { toDateString } from '@/utils/dateUtils';
import AnimatedColorView from '@/components/editpage/AnimatedColorView';
import { LocationData } from '@/api/endpoints/weather';
import { useMoodKeyword } from '@/hooks/useKeywords';
import { useBackgroundColor } from '@/hooks/useBackgroundColor';
import { NoteItem } from '@/models/NoteItem';

const EditPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route =
    useRoute<RouteProp<{ EditPage: EditPageRouteParams }, 'EditPage'>>();
  const { colorState } = useBackgroundColor();
  const { noteData, locationData } = route.params || {};

  const date = new Date();

  const [feelsLikeTemp, setFeelsLikeTemp] = useState(0);
  const [note, setNote] = useState<NoteItem | undefined>(undefined);
  const [location, setLocation] = useState<LocationData | undefined>(undefined);
  const { moodKeywordSet } = useMoodKeyword();

  // 온도 가져와서 기본 배경색 지정하기
  useEffect(() => {
    setFeelsLikeTemp(Number(colorState.color));
  }, [colorState.color]);

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
          content: parsedNote.content,
          created_at: new Date(parsedNote.created_at),
          updated_at: new Date(parsedNote.updated_at),
        });
        setMyMoodOndo(parsedNote.custom_temp);
      } else {
        setMyMoodOndo(Number(colorState.color));
      }
    } catch (error) {
      console.error('유효하지 않은 JSON을 변환하려 합니다 :', error);
    }
  }, [colorState.color, noteData]);

  useEffect(() => {
    try {
      if (Array.isArray(locationData)) {
        throw new Error('editableData가 string[] 타입입니다');
      }

      if (locationData) {
        setLocation(JSON.parse(locationData.toLowerCase()));
      }
    } catch (error) {
      console.error('유효하지 않은 JSON을 변환하려 합니다 :', error);
    }
  }, [locationData]);

  const [myMoodOndo, setMyMoodOndo] = useState(feelsLikeTemp);
  const [memo, setMemo] = useState('');

  const colors = useMemo(
    () =>
      Array.from(OndoColors.keys())
        .sort((a, b) => a - b)
        .map(key => {
          return OndoColors.get(key)!;
        }),

    [],
  );

  return (
    <AnimatedColorView
      style={{
        flex: 1,
      }}
      colors={colors}
      activeIndex={myMoodOndo + 40}
      duration={200}
    >
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={styles.container}>
            <View>
              <View style={styles.topToolbar}>
                <ToolbarButton
                  name={IconName.back}
                  onPress={() => {
                    navigation.goBack();
                  }}
                />

                <Text style={typography.heading2}>{toDateString(date)}</Text>
                <ToolbarButton
                  name={IconName.check}
                  onPress={async () => {
                    try {
                      // 노트를 수정하려는 경우
                      if (note) {
                        const prop = {
                          id: note.id,
                          content: memo,
                          custom_temp: myMoodOndo,
                        };
                        // const result =
                        await editNote(prop);
                      }
                      // 오늘 노트를 처음 작성하는 경우
                      else {
                        const prop = {
                          location: location?.name ?? 'Seoul',
                          content: memo,
                          custom_temp: myMoodOndo,
                        };
                        // const result =
                        await postNote(prop);
                      }

                      navigation.goBack();
                    } catch (error) {
                      console.error('ERROR : ', error);
                    }
                  }}
                />
              </View>
              <LocationAndTemperature
                location={location?.name_ko ?? ''}
                temperature={feelsLikeTemp}
              />
            </View>
            <Text
              style={[
                { alignSelf: 'center', marginTop: 20, color: Colors.black70 },
                typography.label4,
              ]}
            >
              {feelsLikeTemp === myMoodOndo ? '체감 온도' : '기록 온도'}
            </Text>
            <View style={{ marginTop: 8, marginBottom: 16 }}>
              <TemperatureSlider
                feelsLikeTemp={feelsLikeTemp}
                myMoodOndo={myMoodOndo}
                // TODO: 만약 note 정보가 있다면 해당 날짜에 선택한 온도 넣어주기
                changeMoodTemp={temperature => {
                  setMyMoodOndo(temperature);
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <NoteEditor
                keywordList={moodKeywordSet.getKeywordsByTemp(feelsLikeTemp)}
                memo={memo}
                onMemoChanged={newMemo => setMemo(newMemo)}
                defaultValue={note?.content}
                autoFocus={!note}
              />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </AnimatedColorView>
  );
};

export default EditPage;

const styles = StyleSheet.create({
  containerStyle: {
    height: 200,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'pink',
    marginBottom: 50,
  },
  animatedStyle: {
    borderWidth: 5,
    borderColor: 'grey',
    borderRadius: 100,
  },
  container: {
    margin: 12,
    flex: 1,
  },
  topToolbar: {
    flexDirection: 'row',
    paddingTop: 12,
    marginHorizontal: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

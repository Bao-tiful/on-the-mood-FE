import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import { IconName } from '@/components/Icon';
import { ToolbarButton } from '@/components/ToolbarButton';
import LocationAndTemperature from '@/components/editpage/LocationAndTemperature';
import NoteEditor from '@/components/editpage/NoteEditor';
import TemperatureSlider from '@/components/editpage/TemperatureSlider';
import AnimatedColorView from '@/components/editpage/AnimatedColorView';

import { Colors, OndoColors } from '@/styles/Colors';
import typography from '@/styles/Typography';

import { editNote, postNote } from '@/api/endpoints/daily-notes';
import { LocationData } from '@/api/endpoints/weather';

import { toDateString } from '@/utils/dateUtils';

import { useMoodKeyword } from '@/hooks/useKeywords';
import { useBackgroundColor } from '@/hooks/useBackgroundColor';

import { NoteItem } from '@/models/NoteItem';
import AlertModal from '@/components/feedback/AlertModal';
import Toast from 'react-native-toast-message';

// Types
type EditPageRouteParams = {
  noteData?: string;
  locationData?: string;
};

// Constants
const TEMPERATURE_OFFSET = 40;
const ANIMATION_DURATION = 200;

// Utility functions
const parseNoteData = (noteDataString: string): NoteItem | null => {
  try {
    if (Array.isArray(noteDataString)) {
      throw new Error('noteData가 string[] 타입입니다');
    }

    const parsedNote = JSON.parse(noteDataString);

    return {
      id: parsedNote.id,
      location: parsedNote.location,
      custom_temp: parsedNote.custom_temp,
      avg_feels_like_temp: parsedNote.avg_feels_like_temp,
      content: parsedNote.content,
      created_at: new Date(parsedNote.created_at),
      updated_at: new Date(parsedNote.updated_at),
    };
  } catch (error) {
    console.error('유효하지 않은 JSON을 변환하려 합니다:', error);
    return null;
  }
};

const parseLocationData = (locationDataString: string): LocationData | null => {
  try {
    if (Array.isArray(locationDataString)) {
      throw new Error('locationData가 string[] 타입입니다');
    }

    return JSON.parse(locationDataString.toLowerCase());
  } catch (error) {
    console.error('유효하지 않은 JSON을 변환하려 합니다:', error);
    return null;
  }
};

const EditPage = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route =
    useRoute<RouteProp<{ EditPage: EditPageRouteParams }, 'EditPage'>>();
  const { colorState } = useBackgroundColor();
  const { noteData, locationData } = route.params || {};
  const { moodKeywordSet } = useMoodKeyword();

  const date = new Date();

  // State
  const [feelsLikeTemp, setFeelsLikeTemp] = useState(0);
  const [myMoodOndo, setMyMoodOndo] = useState(0);
  const [memo, setMemo] = useState('');
  const [note, setNote] = useState<NoteItem | undefined>(undefined);
  const [location, setLocation] = useState<LocationData | undefined>(undefined);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);

  // 온도 가져와서 기본 배경색 지정하기
  useEffect(() => {
    const temperature = Number(colorState.color);
    setFeelsLikeTemp(temperature);
    if (!note) {
      setMyMoodOndo(temperature);
    }
  }, [colorState.color, note]);

  // JSON 데이터 파싱 및 상태 업데이트
  useEffect(() => {
    if (noteData) {
      const parsedNote = parseNoteData(noteData);
      if (parsedNote) {
        setNote(parsedNote);
        setMyMoodOndo(parsedNote.custom_temp);
      }
    }
  }, [noteData]);

  useEffect(() => {
    if (locationData) {
      const parsedLocation = parseLocationData(locationData);
      if (parsedLocation) {
        setLocation(parsedLocation);
      }
    }
  }, [locationData]);

  // Memoized values
  const colors = useMemo(
    () =>
      Array.from(OndoColors.keys())
        .sort((a, b) => a - b)
        .map(key => OndoColors.get(key)!),
    [],
  );

  const temperatureLabel = useMemo(
    () => (feelsLikeTemp === myMoodOndo ? '체감 온도' : '기록 온도'),
    [feelsLikeTemp, myMoodOndo],
  );

  // Event handlers
  const handleBackPress = useCallback(() => {
    setIsAlertModalVisible(true);
  }, []);

  const handleTemperatureChange = useCallback((temperature: number) => {
    setMyMoodOndo(temperature);
  }, []);

  const handleMemoChange = useCallback((newMemo: string) => {
    setMemo(newMemo);
  }, []);

  const handleSavePress = useCallback(async () => {
    try {
      if (note) {
        // 노트 수정
        await editNote({
          id: note.id,
          content: memo,
          custom_temp: myMoodOndo,
        });
        Toast.show({
          type: 'white',
          text1: '기록을 수정했어요.',
          visibilityTime: 2000,
        });
      } else {
        // 새 노트 작성
        await postNote({
          location: location?.name ?? 'Seoul',
          content: memo,
          custom_temp: myMoodOndo,
        });
        Toast.show({
          type: 'info',
          text1: '오늘을 기록했어요!',
          visibilityTime: 2000,
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('노트 저장 실패:', error);
      Toast.show({
        type: 'info',
        text1: '일기 저장에 실패했습니다.',
        visibilityTime: 2000,
      });
    }
  }, [note, memo, myMoodOndo, location, navigation]);

  const handleConfirmExit = useCallback(() => {
    setIsAlertModalVisible(false);
    navigation.goBack();
  }, [navigation]);

  const handleCancelExit = useCallback(() => {
    setIsAlertModalVisible(false);
  }, []);

  return (
    <AnimatedColorView
      style={styles.animatedContainer}
      colors={colors}
      activeIndex={myMoodOndo + TEMPERATURE_OFFSET}
      duration={ANIMATION_DURATION}
    >
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <SafeAreaView style={styles.safeAreaContainer}>
            {/* Header Section */}
            <View>
              <View style={styles.topToolbar}>
                <ToolbarButton name={IconName.back} onPress={handleBackPress} />
                <Text style={typography.heading2}>{toDateString(date)}</Text>
                <ToolbarButton
                  name={IconName.check}
                  onPress={handleSavePress}
                />
              </View>
              <LocationAndTemperature
                location={location?.name_ko ?? ''}
                temperature={feelsLikeTemp}
              />
            </View>

            {/* Temperature Label */}
            <Text style={[styles.temperatureLabel, typography.label4]}>
              {temperatureLabel}
            </Text>

            {/* Temperature Slider */}
            <View style={styles.sliderContainer}>
              <TemperatureSlider
                feelsLikeTemp={feelsLikeTemp}
                myMoodOndo={myMoodOndo}
                changeMoodTemp={handleTemperatureChange}
              />
            </View>

            {/* Note Editor */}
            <View style={styles.editorContainer}>
              <NoteEditor
                keywordList={moodKeywordSet.getKeywordsByTemp(feelsLikeTemp)}
                memo={memo}
                onMemoChanged={handleMemoChange}
                defaultValue={note?.content}
                autoFocus={!note}
              />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
      <AlertModal
        isModalVisible={isAlertModalVisible}
        title="기록을 취소하실건가요?"
        content={`이대로 나가면\n작성한 일기 내용이 사라져요`}
        primaryLabel="네"
        secondaryLabel="아니요"
        onPressPrimary={handleConfirmExit}
        onPressSecondary={handleCancelExit}
        dismissHandler={handleCancelExit}
      />
    </AnimatedColorView>
  );
};

export default EditPage;

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  safeAreaContainer: {
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
  temperatureLabel: {
    alignSelf: 'center',
    marginTop: 20,
    color: Colors.black70,
  },
  sliderContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  editorContainer: {
    flex: 1,
  },
});

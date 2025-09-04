import React from 'react';
import { Platform, Vibration } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import { RulerPicker } from '@/components/editpage/RulerPicker';

type TemperatureSliderProps = {
  feelsLikeTemp: number;
  myMoodOndo: number;
  changeMoodTemp: (temperature: number) => void;
};

const TemperatureSlider = ({
  feelsLikeTemp,
  changeMoodTemp,
}: TemperatureSliderProps) => {
  const minValue = -40;
  const maxValue = 40;

  const onTemperatureChanged = (number: number) => {
    // 매우 약한 햅틱 피드백 - 기본 Vibration만 사용 (RNHapticFeedback은 라이브러리만 유지)
    if (Platform.OS === 'ios') {
      // iOS에서 아주 약한 진동 (10ms)
      // Vibration.vibrate(10);
      const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      };
      ReactNativeHapticFeedback.trigger('selection', options);
    } else {
      // Android에서 약한 진동 (2ms)
      Vibration.vibrate(2);
    }

    changeMoodTemp(number);
  };

  return (
    <RulerPicker
      height={120}
      min={minValue}
      max={maxValue}
      initialValue={feelsLikeTemp}
      gapBetweenSteps={8}
      step={1}
      indicatorHeight={40}
      shortStepColor={Colors.black18}
      shortStepHeight={12}
      longStepColor={Colors.black32}
      longStepHeight={20}
      stepWidth={2}
      fractionDigits={0}
      unit="°"
      valueTextStyle={{ color: Colors.black100, ...typography.title1 }}
      unitTextStyle={{
        color: Colors.black100,
        ...typography.title3,
      }}
      onValueChange={number => onTemperatureChanged(number)}
      onValueChangeEnd={number => onTemperatureChanged(number)}
    />
  );
};

export default TemperatureSlider;

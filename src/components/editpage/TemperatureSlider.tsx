import React from 'react';
import { Vibration } from 'react-native';
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
    // React Native 내장 진동 피드백 사용 (부드러운 햅틱 효과)
    Vibration.vibrate(50); // 50ms 부드러운 진동
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

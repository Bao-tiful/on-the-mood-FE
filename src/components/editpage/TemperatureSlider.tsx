import React from "react";
import { Colors } from "@/src/styles/Colors";
import typography from "@/src/styles/Typography";
import * as Haptic from "expo-haptics";
import { RulerPicker } from "./RulerPicker";

type TemperatureSliderProps = {
  feelsLikeTemp: number;
  myMoodOndo: number;
  changeMoodTemp: (temperature: number) => void;
};

const TemperatureSlider = ({
  feelsLikeTemp,
  myMoodOndo,
  changeMoodTemp,
}: TemperatureSliderProps) => {
  const minValue = -40;
  const maxValue = 40;

  const onTemperatureChanged = (number: number) => {
    // TODO: Haptic 실제 동작 여부는 Expo SDK 53 업데이트 PR 후
    // 실기기에서 테스트 진행하기
    Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Soft);
    changeMoodTemp(number);
  };

  return (
    <RulerPicker
      height={120}
      min={minValue}
      max={maxValue}
      initialValue={myMoodOndo}
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
      onValueChange={(number) => onTemperatureChanged(number)}
      onValueChangeEnd={(number) => onTemperatureChanged(number)}
    />
  );
};

export default TemperatureSlider;

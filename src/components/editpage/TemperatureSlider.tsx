import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Slider } from "@miblanchard/react-native-slider";
import { Colors, OndoColors } from "@/src/styles/Colors";
import Icon, { IconName } from "../Icon";
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

  return (
    <RulerPicker
      height={130}
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
      onValueChange={(number) => changeMoodTemp(number)}
      onValueChangeEnd={(number) => changeMoodTemp(number)}
    />
  );
};

export default TemperatureSlider;

const styles = StyleSheet.create({
  sliderContainer: {
    height: 32,
    marginTop: 40,
    width: '100%',
    justifyContent: 'flex-end',
  },
  backgroundContainer: {
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
  feelsLikeTempLabelRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -54,
    transform: [{ translateX: '-22%' }],
    alignItems: 'center',
  },
  feelsLikeTempLabel: {
    ...typography.label1,
    fontWeight: 600,
    color: Colors.black40,
  },
  sliderThumbContainer: {
    position: 'absolute',
  },
  degreeTag: {
    position: 'absolute',
    width: 82,
    height: 48,
    transform: [{ translateX: '-50%' }],
    backgroundColor: 'black',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  degreeTopLabel: {
    ...typography.label4,
    position: 'absolute',
    top: -14,
  },
  degreeTagLabel: {
    ...typography.heading1,
  },
  degreeBottomTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8 / 2,
    borderRightWidth: 8 / 2,
    borderBottomWidth: (Math.sqrt(3) / 2) * 8, // 정삼각형 높이
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    backgroundColor: 'transparent',
    position: 'absolute',
    transform: [{ translateY: 98 }, { translateX: '-35%' }],
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
    borderRadius: '50%',
  },
  thumb: {
    width: 2,
    height: 58,
    backgroundColor: 'black',
    position: 'absolute',
    top: -15,
  },
  track: {
    height: 80,
  },
});

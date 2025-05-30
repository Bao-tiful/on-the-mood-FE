import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Slider } from "@miblanchard/react-native-slider";
import { Colors, OndoColors } from "@/src/styles/Colors";
import Icon, { IconName } from "../Icon";
import typography from "@/src/styles/Typography";
import * as Haptic from "expo-haptics";

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
    <View style={{ width: "100%", marginTop: 16, marginBottom: 32 }}>
      <View style={styles.sliderContainer}>
        <View>
          <View style={styles.backgroundContainer}>
            <View style={styles.minMaxLabelRow}>
              <Text style={styles.minMaxLabel}>{minValue}°</Text>
              <Text style={styles.minMaxLabel}>{maxValue}°</Text>
            </View>
            <View style={styles.backgroundTrack}>
              {Array.from({ length: maxValue - minValue + 1 }).map(
                (_, index) => (
                  <View
                    style={[
                      styles.backgroundTrackItem,
                      // 해당 체감온도에 해당하는 칸은 색상 구분
                      index === feelsLikeTemp - minValue
                        ? { backgroundColor: Colors.black40 }
                        : null,
                    ]}
                    key={index}
                  />
                )
              )}
            </View>
            {myMoodOndo === feelsLikeTemp ? null : (
              <View
                style={[
                  styles.feelsLikeTempLabelRow,
                  // 체감온도 레이블을 표시할 위치 지정
                  {
                    left: `${
                      ((feelsLikeTemp - minValue) / (maxValue - minValue)) * 100
                    }%`,
                  },
                ]}
              >
                <Icon name={IconName.temperatureGray} size={16} />
                <Text style={styles.feelsLikeTempLabel}>
                  {feelsLikeTemp + "°"}
                </Text>
              </View>
            )}
          </View>
          <Slider
            containerStyle={{ height: 20 }}
            trackRightPadding={-1}
            minimumValue={minValue}
            maximumValue={maxValue}
            value={myMoodOndo}
            onValueChange={(value) => {
              // step 크기와 관계없이 소숫점 단위의 변화에 대해서도 onValueChange 콜백이 호출되고 있어,
              // 이미 value가 같은 경우에는 로직 호출 방지
              if (myMoodOndo == value[0]) return;

              changeMoodTemp(value[0]);

              Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Soft);
            }}
            maximumTrackTintColor="transparent"
            minimumTrackTintColor="transparent"
            thumbStyle={styles.thumb}
            thumbTouchSize={{
              width: 12,
              height: 50,
            }}
            trackStyle={styles.track}
            step={1}
          />
        </View>
      </View>
      <View
        style={[
          styles.sliderThumbContainer,
          {
            left: `${((myMoodOndo - minValue) / (maxValue - minValue)) * 100}%`,
          },
        ]}
      >
        <View style={[styles.degreeTag]}>
          <Text style={[styles.degreeTopLabel]}>
            {myMoodOndo === feelsLikeTemp ? "오늘의 체감온도" : "나의 온도무드"}
          </Text>
          <Text
            style={[
              styles.degreeTagLabel,
              { color: OndoColors.get(myMoodOndo) },
            ]}
          >
            {myMoodOndo}°
          </Text>
        </View>
        <View style={styles.degreeBottomTriangle} />
      </View>
    </View>
  );
};

export default TemperatureSlider;

const styles = StyleSheet.create({
  sliderContainer: {
    height: 32,
    marginTop: 40,
    width: "100%",
    justifyContent: "flex-end",
  },
  backgroundContainer: {
    flexDirection: "column",
  },
  minMaxLabelRow: {
    flexDirection: "row",
    position: "absolute",
    justifyContent: "space-between",
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
    flexDirection: "row",
    position: "absolute",
    bottom: -54,
    transform: [{ translateX: "-22%" }],
    alignItems: "center",
  },
  feelsLikeTempLabel: {
    ...typography.label1,
    fontWeight: 600,
    color: Colors.black40,
  },
  sliderThumbContainer: {
    position: "absolute",
  },
  degreeTag: {
    position: "absolute",
    width: 82,
    height: 48,
    transform: [{ translateX: "-50%" }],
    backgroundColor: "black",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  degreeTopLabel: {
    ...typography.label4,
    position: "absolute",
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
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    backgroundColor: "transparent",
    position: "absolute",
    transform: [{ translateY: 98 }, { translateX: "-35%" }],
  },
  backgroundTrack: {
    height: 32,
    width: "101%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backgroundTrackItem: {
    backgroundColor: Colors.black18,
    height: "100%",
    width: 2,
    borderRadius: "50%",
  },
  thumb: {
    width: 2,
    height: 58,
    backgroundColor: "black",
    position: "absolute",
    top: -15,
  },
  track: {
    height: 80,
  },
});

import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Slider } from "@miblanchard/react-native-slider";

type TemperatureSliderProps = {
  feelsLikeTemp: number;
  changeMoodTemp: Function;
};

const TemperatureSlider = ({
  feelsLikeTemp,
  changeMoodTemp,
}: TemperatureSliderProps) => {
  const [myValue, setMyValue] = useState(feelsLikeTemp);

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.sliderContainer}>
        <View>
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                justifyContent: "space-between",
                top: -20,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <Text>-40°</Text>
              <Text>40°</Text>
            </View>
            <View style={styles.trackBackground}>
              {Array.from({ length: 81 }).map((_, index) => (
                <View
                  style={[
                    styles.trackItem,
                    index === 40 + feelsLikeTemp
                      ? { backgroundColor: "#888888" }
                      : null,
                  ]}
                  key={index}
                />
              ))}
            </View>
            <View
              style={{
                position: "absolute",
                bottom: -54,
                left: `${((feelsLikeTemp + 40) / 80) * 100}%`,
                transform: [{ translateX: "-50%" }],
              }}
            >
              <Text>
                {myValue === feelsLikeTemp ? "" : feelsLikeTemp + "°"}
              </Text>
            </View>
          </View>
          <Slider
            containerStyle={{ height: 20 }}
            minimumValue={-40}
            maximumValue={40}
            value={myValue}
            onValueChange={(value) => setMyValue(value[0])}
            maximumTrackTintColor="transparent"
            minimumTrackTintColor="transparent"
            thumbStyle={styles.thumb}
            thumbTouchSize={{
              width: 6,
              height: 50,
            }}
            trackStyle={styles.track}
            step={1}
          />
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          left: `${((myValue + 40) / 80) * 100}%`,
        }}
      >
        <View style={[styles.degreeTag]}>
          <Text
            style={{
              position: "absolute",
              fontSize: 10,
              transform: [{ translateY: -34 }],
              top: -14,
            }}
          >
            {myValue === feelsLikeTemp ? "오늘의 체감온도" : "나의 온도무드"}
          </Text>
          <Text style={styles.degreeTagLabel}>{myValue}°</Text>
        </View>
        {/* 슬라이더 하단 점 */}
        {/* TODO: 삼각형 이미지로 변경해주기 */}
        <View
          style={{
            width: 4,
            height: 4,
            backgroundColor: "black",
            position: "absolute",
            transform: [{ translateY: 100 }, { translateX: "-50%" }],
          }}
        />
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
  degreeTagLabel: {
    color: "white",
    fontWeight: 600,
    fontSize: 20,
  },
  trackBackground: {
    height: 32,
    width: "100%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trackItem: {
    backgroundColor: "#cccccc",
    height: "100%",
    width: 2,
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

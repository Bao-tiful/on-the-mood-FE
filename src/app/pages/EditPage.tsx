import { Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Slider } from "@miblanchard/react-native-slider";
import React, { useRef, useState } from "react";
import { transform } from "@babel/core";
import TemperatureSlider from "@/src/components/editpage/TemperatureSlider";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const EditPage = () => {
  const [myValue, setMyValue] = useState(4);

  const foo = (newValue: number) => {
    setMyValue(newValue);
  };

  return (
    <View style={{ padding: 20, alignItems: "center" }}>
      <TemperatureSlider feelsLikeTemp={myValue} changeMoodTemp={foo} />
    </View>
  );
};

export default EditPage;

const styles = StyleSheet.create({});

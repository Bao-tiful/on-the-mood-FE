import { StyleSheet, View } from "react-native";
import React from "react";
import TemperatureSlider from "@/src/components/editpage/TemperatureSlider";

const EditPage = () => {
  const todayTemp = 4;

  return (
    <View style={{ padding: 20, alignItems: "center" }}>
      <TemperatureSlider feelsLikeTemp={todayTemp} changeMoodTemp={() => {}} />
    </View>
  );
};

export default EditPage;

const styles = StyleSheet.create({});

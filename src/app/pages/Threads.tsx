import {
  View,
  Text,
  SafeAreaView,
  Animated,
  Dimensions,
  PanResponder,
  Easing,
} from "react-native";
import React, { Component, useEffect, useRef, useState } from "react";

const Threads = () => {
  return (
    <SafeAreaView style={{ flex: 1, width: "100%" }}>
      <Sliding></Sliding>
    </SafeAreaView>
  );
};

export default Threads;

const { width: screenWidth, height: screenHeight } = {
  width: Dimensions.get("window"),
  height: 1000,
};

export const Sliding = () => {
  const bottomPadding = 10;
  const data = new Array(20).fill({
    name: "John Smith",
    title: "Marketing Head",
    address: "Address",
    email: "johnsmith@gmail.com",
  });
  const colors = [
    "#ff5252",
    "#e040fb",
    "#7c4dff",
    "#448aff",
    "#64ffda",
    "#ff6e40",
  ];

  const [size, setSize] = useState({ width: 0, height: 0 });

  const translateY = useRef(new Animated.Value(-bottomPadding)).current;
  const translateYValue = useRef(-bottomPadding); // 현재 translateY 값을 저장할 ref

  useEffect(() => {
    // Animated Value의 변경을 감지하고 translateYValue에 최신 값 저장
    const listenerId = translateY.addListener(({ value }) => {
      translateYValue.current = value;
    });

    return () => {
      translateY.removeListener(listenerId);
    };
  }, [translateY]);

  const bottoms = data.map((_, i) =>
    Animated.add(
      Animated.multiply(translateY, -1),
      (i * screenHeight) / 6
    ).interpolate({
      inputRange: [0, screenHeight * 0.9, screenHeight],
      outputRange: [0, screenHeight * 0.6, screenHeight * 0.6],
    })
  );

  console.log(bottoms);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: Animated.event([null, { dy: translateY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, { vy }) => {
        // vy : 스크롤을 뗄 때 y축 속도가 얼마나 강한지

        // 이 코드가 있으면 스크롤 -> 다음 스크롤 시 이어서 스크롤이 됨
        // 없으면 처음(0)부터 다시 스크롤이 된다.
        translateY.extractOffset();

        Animated.decay(translateY, {
          velocity: vy,
          deceleration: 0.997,
          useNativeDriver: false,
        }).start(() => {
          // `translateYValue.current`를 사용하여 현재 translateY 값을 가져올 수 있음
          // yOffset = 절대값을 기준으로 translateYValue.current 값에서 가장 가까운 + 값보다는 작은 Y 값을 bottoms에서 찾기
          // console.log(translateYValue.current);
          // 스크롤이 멈췄을 때 근처의 셀을 찾아 지정해주는 애니메이션
          // 잘 작동하지 않아서, 우선은 주석처리 해두었음
          // animatedInterpolation 타입에서 value를 가져오기 어려워, JSON화 -> String to Number 로 값을 가져오도록 구현
          // const yOffsetInterpolation = bottoms.reduce(
          //   (prevVal, x) => (x > prevVal ? x : prevVal),
          //   bottoms[0]
          // );
          // const yOffset = Math.abs(
          //   Number(JSON.stringify(yOffsetInterpolation))
          // );
          // translateY.extractOffset();
          // const targetY = yOffset - bottomPadding;
          // Animated.timing(translateY, {
          //   toValue: translateYValue.current - targetY,
          //   duration: 300,
          //   useNativeDriver: false,
          // }).start(() => {
          //   // console.log(translateYValue.current);
          //   translateY.extractOffset();
          // });
        });
      },
    })
  ).current;

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
      }}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setSize({ width, height });
      }}
      {...panResponder.panHandlers}
    >
      {data
        .slice()
        .reverse()
        .map((x, index) => {
          const i = data.length - index - 1;
          const bottom = bottoms[i];

          // 마지막에 슉 내려가는 애니메이션
          const pullDown = bottom.interpolate({
            inputRange: [bottomPadding - 1, bottomPadding, bottomPadding + 1],
            outputRange: [-4, 0, 0],
            extrapolateLeft: "extend",
          });

          const scale = Animated.multiply(
            Animated.add(Animated.divide(bottom, screenHeight - 200), -1),
            -1
          ).interpolate({
            inputRange: [0.2, 0.3, 0.5, 1],
            outputRange: [0.6, 1, 1, 1],
            extrapolate: "clamp",
          });
          // const opacity = bottom.interpolate({
          //   inputRange: [bottomPadding, screenHeight - 200],
          //   outputRange: [0, 0.3],
          //   extrapolate: "clamp",
          // });
          return (
            <Animated.View
              key={i}
              style={{
                position: "absolute",
                transform: [{ scale }],
                bottom: Animated.add(bottom, pullDown),
                width: "100%",
              }}
            >
              <Card color={colors[i % colors.length]} data={x} />
            </Animated.View>
          );
        })}
    </View>
  );
};

type CardProps = {
  color: string;
  data: { name: string; title: string; address: string; email: string };
};

const Card = ({ color, data }: CardProps) => {
  return (
    <View
      style={{ flex: 1, width: "100%", backgroundColor: color, height: 100 }}
    >
      <Text>data : {data.name}</Text>
    </View>
  );
};

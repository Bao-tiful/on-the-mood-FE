import React, { Component, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  EasingFunction,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

interface AnimatedColorViewProps {
  children: React.ReactNode;
  activeIndex: number;
  duration?: number;
  colors?: string[];
  style?: ViewStyle;
  easing?: EasingFunction;
}

const AnimatedColorView = ({
  children,
  activeIndex,
  duration = 400,
  colors = [],
  style = {},
  easing = Easing.ease,
}: AnimatedColorViewProps) => {
  // 애니메이션 값을 저장할 색상팔레트 레퍼런스 배열 생성
  // Value는 투명도(opacity) -> 1이면 색상이 보이고 0이면 색상이 보이지 않음
  const animatedValues = useRef(
    colors.map(() => new Animated.Value(0))
  ).current;

  // 활성화된 색상을 업데이트하는 함수
  const setActive = (index: number) => {
    animatedValues.forEach((animatedValue, i) => {
      Animated.timing(animatedValue, {
        toValue: i === index ? 1 : 0,
        duration,
        useNativeDriver: true,
        easing,
      }).start();
    });
  };

  // 컴포넌트 마운트 시 초기 활성 색상 설정
  useEffect(() => {
    if (colors.length > 0) {
      setActive(activeIndex);
    }
  }, [colors, activeIndex]);

  // activeIndex가 변경될 때마다 애니메이션 업데이트
  useEffect(() => {
    setActive(activeIndex);
  }, [activeIndex]);

  return (
    <View style={style}>
      {colors.map((item, index) => (
        // 애니메이션이 적용된 opacity 값으로 색상을 렌더링

        <Animated.View
          key={`animated-view-${index}`}
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: item, opacity: animatedValues[index] },
          ]}
        />
      ))}
      {children}
    </View>
  );
};

export default AnimatedColorView;

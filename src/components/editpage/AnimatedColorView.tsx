import React, { Component } from "react";
import {
  Animated,
  Easing,
  EasingFunction,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

interface AnimatedColorViewProps {
  duration: number;
  colors: string[];
  activeIndex: number;

  style: ViewStyle;
  children: React.ReactNode;
  easing: EasingFunction;
}

export default class AnimatedColorView extends Component<AnimatedColorViewProps> {
  static defaultProps: Partial<AnimatedColorViewProps> = {
    duration: 200,
    colors: [],
    activeIndex: 0,
    style: {},
    easing: Easing.linear,
  };

  // 애니메이션을 적용할 색상 팔레트
  // Value는 투명도(opacity) -> 1이면 색상이 보이고 0이면 색상이 보이지 않음
  animatedValues: Animated.Value[] = [];
  setInterval: any = null;

  // prop으로 들어온 색상 hex 코드 목록을 animatedValues에 적용
  constructor(props: any) {
    super(props);
    const { colors, activeIndex } = props;
    if (colors.length) {
      colors.map((_item: string) => {
        this.animatedValues.push(new Animated.Value(0));
      });
      this.animatedValues[activeIndex].setValue(1);
    }
  }

  // 특정 index의 색상을 업데이트 시킬 때
  // 에니메이션을 적용하며 해당 색상의 투명도를 1으로, 나머지 색상은 0으로 set
  setActive = async (index: number) => {
    const { duration, easing } = this.props;
    this.animatedValues.map((_, i) => {
      if (index !== i) {
        Animated.timing(this.animatedValues[i], {
          toValue: 0,
          duration,
          useNativeDriver: true,
          easing: easing,
        }).start();
      } else {
        Animated.timing(this.animatedValues[index], {
          toValue: 1,
          duration,
          useNativeDriver: true,
          easing: easing,
        }).start();
      }
    });
  };

  componentDidUpdate(props: any) {
    const { activeIndex } = this.props;

    if (props.activeIndex !== activeIndex) {
      this.setActive(activeIndex);
    }
  }

  render() {
    const { colors, children } = this.props;
    const props = this.props;

    return (
      <View {...props}>
        {colors.map((item, index) => {
          // 애니메이션이 적용된 opacity 값으로 색상을 렌더링
          const opacity = this.animatedValues[index];
          return (
            <Animated.View
              key={`animated-view-${index}`}
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: item, opacity },
              ]}
            />
          );
        })}
        {children}
      </View>
    );
  }
}

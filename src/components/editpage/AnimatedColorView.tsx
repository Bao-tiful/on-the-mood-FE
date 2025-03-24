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

  animatedValues: Animated.Value[] = [];
  setInterval: any = null;
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

  setActive = async (index: number) => {
    const { duration, easing } = this.props;
    this.animatedValues.map((item, i) => {
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
    console.log(activeIndex);
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

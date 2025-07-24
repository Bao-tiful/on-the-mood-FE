import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  TextStyle,
  View,
  Text,
  Animated,
  TextInput,
  LayoutChangeEvent,
} from "react-native";
import type { NativeSyntheticEvent, NativeScrollEvent } from "react-native";

import {
  AnimatedFlashList,
  FlashList,
  ListRenderItem,
} from "@shopify/flash-list";

export type RulerPickerTextProps = Pick<
  TextStyle,
  "color" | "fontSize" | "fontWeight"
>;

const { width: windowWidth } = Dimensions.get("window");

export type RulerPickerProps = {
  /**
   * Width of the ruler picker
   * @default windowWidth (또는 부모 컨테이너의 width)
   */
  width?: number;
  /**
   * Height of the ruler picker
   * @default 500
   */
  height?: number;
  /**
   * Minimum value of the ruler picker
   *
   * @default 0
   */
  min: number;
  /**
   * Maximum value of the ruler picker
   *
   * @default 240
   */
  max: number;
  /**
   * Step of the ruler picker
   *
   * @default 1
   */
  step?: number;
  /**
   * Initial value of the ruler picker
   *
   * @default min
   */
  initialValue?: number;
  /**
   * Number of digits after the decimal point
   *
   * @default 1
   */
  fractionDigits?: number;
  /**
   * Unit of the ruler picker
   *
   * @default 'cm'
   */
  unit?: string;
  /**
   * Height of the indicator
   *
   * @default 80
   */
  indicatorHeight?: number;
  /**
   * Color of the center line
   *
   * @default 'black'
   */
  indicatorColor?: string;
  /**
   * Text style of the value
   */
  valueTextStyle?: RulerPickerTextProps;
  /**
   * Text style of the unit
   */
  unitTextStyle?: RulerPickerTextProps;
  /**
   * A floating-point number that determines how quickly the scroll view
   * decelerates after the user lifts their finger. You may also use string
   * shortcuts `"normal"` and `"fast"` which match the underlying iOS settings
   * for `UIScrollViewDecelerationRateNormal` and
   * `UIScrollViewDecelerationRateFast` respectively.
   *
   *  - `'normal'`: 0.998 on iOS, 0.985 on Android (the default)
   *  - `'fast'`: 0.99 on iOS, 0.9 on Android
   *
   * @default 'normal'
   */
  decelerationRate?: "fast" | "normal" | number;
  /**
   * Callback when the value changes
   *
   * @param value
   */
  onValueChange?: (value: number) => void;
  /**
   * Callback when the value changes end
   *
   * @param value
   */
  onValueChangeEnd?: (value: number) => void;
} & Partial<RulerPickerItemProps>;

export const RulerPicker = ({
  width,
  height = 500,
  min,
  max,
  step = 1,
  initialValue = min,
  fractionDigits = 0,
  unit = "cm",
  indicatorHeight = 80,
  gapBetweenSteps = 10,
  shortStepHeight = 20,
  longStepHeight = 40,
  stepWidth = 2,
  indicatorColor = "black",
  shortStepColor = "lightgray",
  longStepColor = "darkgray",
  valueTextStyle,
  unitTextStyle,
  decelerationRate = "normal",
  onValueChange,
  onValueChangeEnd,
}: RulerPickerProps) => {
  // 동적 width 상태 관리
  const [containerWidth, setContainerWidth] = useState<number>(
    width || windowWidth
  );

  const itemAmount = (max - min) / step;
  const arrData = Array.from({ length: itemAmount + 1 }, (_, index) => index);
  const listRef = useRef<FlashList<typeof arrData>>(null);

  const stepTextRef = useRef<TextInput>(null);
  const prevValue = useRef<number>(initialValue);
  const prevMomentumValue = useRef<number>(initialValue);
  const scrollPosition = useRef(new Animated.Value(0)).current;

  // 초기값 설정 여부를 체크해, 다시 값이 초기화 되지 않도록 함
  const hasInitialized = useRef<boolean>(false);

  // onLayout 핸들러
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width: layoutWidth } = event.nativeEvent.layout;
      if (layoutWidth > 0 && !width) {
        // width prop이 없을 때만 동적으로 설정
        setContainerWidth(layoutWidth);
      }
    },
    [width]
  );

  // width가 변경될 때 초기화 상태 리셋
  useEffect(() => {
    hasInitialized.current = false;
  }, [containerWidth]);

  const valueCallback: Animated.ValueListenerCallback = useCallback(
    ({ value }) => {
      const newStep = calculateCurrentValue(
        value,
        stepWidth,
        gapBetweenSteps,
        min,
        max,
        step
      );

      if (prevValue.current !== newStep) {
        onValueChange?.(newStep);
        stepTextRef.current?.setNativeProps({ text: newStep.toString() });
      }

      prevValue.current = newStep;
    },
    [fractionDigits, gapBetweenSteps, stepWidth, max, min, onValueChange, step]
  );

  useEffect(() => {
    scrollPosition.addListener(valueCallback);

    return () => {
      scrollPosition.removeAllListeners();
    };
  }, [scrollPosition, valueCallback]);

  // initialValue가 변경되면 기본값들을 초기화
  useEffect(() => {
    prevValue.current = initialValue;
    prevMomentumValue.current = initialValue;
    hasInitialized.current = false;
  }, [initialValue]);

  const scrollHandler = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            x: scrollPosition,
          },
        },
      },
    ],
    {
      useNativeDriver: true,
    }
  );

  const renderSeparator = useCallback(
    () => <View style={{ width: containerWidth * 0.5 - stepWidth * 0.5 }} />,
    [stepWidth, containerWidth]
  );

  const renderItem: ListRenderItem<unknown> = useCallback(
    ({ index }) => {
      return (
        <RulerPickerItem
          isLast={index === arrData.length - 1}
          index={index}
          shortStepHeight={shortStepHeight}
          longStepHeight={longStepHeight}
          gapBetweenSteps={gapBetweenSteps}
          stepWidth={stepWidth}
          shortStepColor={shortStepColor}
          longStepColor={longStepColor}
        />
      );
    },
    [
      arrData.length,
      gapBetweenSteps,
      stepWidth,
      longStepColor,
      longStepHeight,
      shortStepColor,
      shortStepHeight,
    ]
  );

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newStep = calculateCurrentValue(
        event.nativeEvent.contentOffset.x || event.nativeEvent.contentOffset.y,
        stepWidth,
        gapBetweenSteps,
        min,
        max,
        step
      );

      if (prevMomentumValue.current !== newStep) {
        onValueChangeEnd?.(newStep);
      }

      prevMomentumValue.current = newStep;
    },
    [
      fractionDigits,
      gapBetweenSteps,
      stepWidth,
      max,
      min,
      onValueChangeEnd,
      step,
    ]
  );

  // 초기 스크롤 설정을 위한 useEffect 사용
  useEffect(() => {
    // 이미 설정이 완료되었다면 return
    if (hasInitialized.current || containerWidth <= 0) return;

    const timer = setTimeout(() => {
      const initialIndex = Math.floor((initialValue - min) / step);
      listRef.current?.scrollToOffset({
        offset: initialIndex * (stepWidth + gapBetweenSteps),
        animated: false,
      });
      hasInitialized.current = true;
    }, 0);

    return () => clearTimeout(timer);
  }, [initialValue, min, step, stepWidth, gapBetweenSteps, containerWidth]);

  return (
    <View
      style={{ width: width || "100%", height, marginTop: 12 }}
      onLayout={handleLayout}
    >
      {containerWidth > 0 && (
        <>
          <AnimatedFlashList
            ref={listRef}
            data={arrData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            ListHeaderComponent={renderSeparator}
            ListFooterComponent={renderSeparator}
            onScroll={scrollHandler}
            onMomentumScrollEnd={onMomentumScrollEnd}
            estimatedItemSize={stepWidth + gapBetweenSteps}
            snapToOffsets={arrData.map(
              (_, index) => index * (stepWidth + gapBetweenSteps)
            )}
            snapToAlignment="start"
            decelerationRate={decelerationRate}
            estimatedFirstItemOffset={0}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal
            contentContainerStyle={{
              paddingHorizontal: 0,
              paddingVertical: -4,
            }}
          />
          <View
            style={[
              styles.indicator,
              {
                width: 100,
                alignSelf: "center",
                transform: [
                  {
                    translateY:
                      -indicatorHeight * 0.5 -
                      (valueTextStyle?.fontSize ?? styles.valueText.fontSize),
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.displayTextContainer,
                {
                  height: valueTextStyle?.fontSize ?? styles.valueText.fontSize,
                  transform: [
                    {
                      translateY:
                        -(
                          valueTextStyle?.fontSize ?? styles.valueText.fontSize
                        ) * 0.2,
                    },
                  ],
                },
              ]}
            >
              {/* 체감온도 글자의 가운데정렬을 위해  투명 유닛 추가 */}
              {unit && (
                <View style={{ height: 60 }}>
                  <Text
                    style={[
                      styles.unitText,
                      unitTextStyle,
                      {
                        verticalAlign: "top",
                        color: "transparent",
                      },
                    ]}
                  >
                    {unit}
                  </Text>
                </View>
              )}
              <TextInput
                ref={stepTextRef}
                defaultValue={
                  fractionDigits === 0
                    ? Math.round(initialValue).toString()
                    : initialValue.toFixed(fractionDigits)
                }
                style={[
                  {
                    textAlign: "center",
                    lineHeight:
                      valueTextStyle?.fontSize ?? styles.valueText.fontSize,
                    fontVariant: ["tabular-nums"],
                  },
                  styles.valueText,
                  valueTextStyle,
                ]}
              />
              {unit && (
                <View style={{ height: 60 }}>
                  <Text
                    style={[
                      {
                        verticalAlign: "top",
                      },
                      styles.unitText,
                      unitTextStyle,
                    ]}
                  >
                    {unit}
                  </Text>
                </View>
              )}
            </View>
            <View
              style={[
                {
                  width: stepWidth,
                  height: indicatorHeight,
                  backgroundColor: indicatorColor,
                },
              ]}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    top: "50%",
    width: "100%",
    alignItems: "center",
  },
  displayTextContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: {
    color: "black",
    fontSize: 32,
    fontWeight: "800",
    margin: 0,
    padding: 0,
    fontFamily: "monospace",
  },
  unitText: {
    color: "black",
    fontSize: 24,
    fontWeight: "400",
    marginLeft: 6,
  },
});

export type RulerPickerItemProps = {
  /**
   * Gap between steps
   *
   * @default 10
   */
  gapBetweenSteps: number;
  /**
   * Height of the short step
   *
   * @default 20
   */
  shortStepHeight: number;
  /**
   * Height of the long step
   *
   * @default 40
   */
  longStepHeight: number;
  /**
   * Width of the steps
   *
   * @default 2
   */
  stepWidth: number;
  /**
   * Color of the short steps
   *
   * @default 'lightgray'
   */
  shortStepColor: string;
  /**
   * Color of the long steps
   *
   * @default 'gray'
   */
  longStepColor: string;
};

type Props = {
  index: number;
  isLast: boolean;
} & RulerPickerItemProps;

export const RulerPickerItem = React.memo(
  ({
    isLast,
    index,
    gapBetweenSteps,
    shortStepHeight,
    longStepHeight,
    stepWidth,
    shortStepColor,
    longStepColor,
  }: Props) => {
    const isLong = index % 10 === 0;
    const height = isLong ? longStepHeight : shortStepHeight;

    return (
      <View
        style={[
          {
            width: stepWidth,
            height: "100%",
            justifyContent: "center",
            marginRight: isLast ? 0 : gapBetweenSteps,
            marginTop: shortStepHeight,
            overflow: "visible",
          },
        ]}
      >
        <View
          style={[
            {
              width: "100%",
              height: height,
              backgroundColor: isLong ? longStepColor : shortStepColor,
              marginTop: isLong ? 0 : shortStepHeight / 2,
            },
          ]}
        />
        {index % 10 === 0 && (
          <View
            style={{
              overflow: "visible",
              position: "absolute",
              width: 40,
              left: -20,
              bottom: 24,
              alignItems: "center",
            }}
          >
            {/* 숫자의 가운데 정렬을 위해 앞에 공백 2칸을 삽입 */}
            <Text style={{ overflow: "visible" }}>{`  ${index - 40}°`}</Text>
          </View>
        )}
      </View>
    );
  }
);

const calculateCurrentValue = (
  scrollPosition: number,
  stepWidth: number,
  gapBetweenItems: number,
  min: number,
  max: number,
  step: number
) => {
  const index = Math.round(scrollPosition / (stepWidth + gapBetweenItems));
  const newValue = Math.round(Math.min(Math.max(index * step + min, min), max));

  return newValue;
};

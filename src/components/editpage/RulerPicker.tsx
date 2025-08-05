/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  TextStyle,
  View,
  Text,
  Animated,
  TextInput,
  LayoutChangeEvent,
} from 'react-native';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import { FlashList, ListRenderItem } from '@shopify/flash-list';
import Icon, { IconName } from '../Icon';
import { Colors } from '@/styles/Colors';

export type RulerPickerTextProps = Pick<
  TextStyle,
  'color' | 'fontSize' | 'fontWeight'
>;

const { width: windowWidth } = Dimensions.get('window');

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
  decelerationRate?: 'fast' | 'normal' | number;
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
  unit = 'cm',
  indicatorHeight = 80,
  gapBetweenSteps = 10,
  shortStepHeight = 20,
  longStepHeight = 40,
  stepWidth = 2,
  indicatorColor = 'black',
  shortStepColor = 'lightgray',
  longStepColor = 'darkgray',
  valueTextStyle,
  unitTextStyle,
  decelerationRate = 'normal',
  onValueChange,
  onValueChangeEnd,
}: RulerPickerProps) => {
  const [containerWidth, setContainerWidth] = useState<number>(
    width || windowWidth,
  );
  const [currentSelectedValue, setCurrentSelectedValue] =
    useState<number>(initialValue);
  const fixedInitialValue = useRef<number>(initialValue);

  const itemAmount = (max - min) / step;
  const arrData = Array.from({ length: itemAmount + 1 }, (_, index) => index);
  const listRef = useRef<any>(null);

  const stepTextRef = useRef<TextInput>(null);
  const prevValue = useRef<number>(initialValue);
  const prevMomentumValue = useRef<number>(initialValue);
  const scrollPosition = useRef(new Animated.Value(initialValue)).current;

  const hasInitialized = useRef<boolean>(false);
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width: layoutWidth } = event.nativeEvent.layout;
      if (layoutWidth > 0 && !width) {
        setContainerWidth(layoutWidth);
      }
    },
    [width],
  );

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
        step,
      );

      if (prevValue.current !== newStep) {
        onValueChange?.(newStep);
        stepTextRef.current?.setNativeProps({ text: newStep.toString() });
        setCurrentSelectedValue(newStep);
      }

      prevValue.current = newStep;
    },
    [gapBetweenSteps, stepWidth, max, min, onValueChange, step],
  );

  useEffect(() => {
    scrollPosition.addListener(valueCallback);

    return () => {
      scrollPosition.removeAllListeners();
    };
  }, [scrollPosition, valueCallback]);

  useEffect(() => {
    if (initialValue >= min && initialValue <= max) {
      if (!hasInitialized.current) {
        setCurrentSelectedValue(initialValue);
        prevValue.current = initialValue;
        prevMomentumValue.current = initialValue;
      }
      if (
        fixedInitialValue.current === 0 ||
        Math.abs(fixedInitialValue.current - initialValue) > 0
      ) {
        fixedInitialValue.current = initialValue;
      }
    }
  }, [initialValue, min, max]);

  const scrollHandler = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      scrollPosition.setValue(offsetX);
    },
    [scrollPosition],
  );

  const renderSeparator = useCallback(
    () => <View style={{ width: containerWidth * 0.5 - stepWidth * 0.5 }} />,
    [stepWidth, containerWidth],
  );

  const renderItem: ListRenderItem<number> = useCallback(
    ({ index }) => (
      <RulerPickerItem
        isLast={index === arrData.length - 1}
        index={index}
        shortStepHeight={shortStepHeight}
        longStepHeight={longStepHeight}
        gapBetweenSteps={gapBetweenSteps}
        stepWidth={stepWidth}
        shortStepColor={shortStepColor}
        longStepColor={longStepColor}
        min={min}
        step={step}
        initialValue={fixedInitialValue.current}
        currentSelectedValue={currentSelectedValue}
      />
    ),
    [
      arrData.length,
      gapBetweenSteps,
      stepWidth,
      longStepColor,
      longStepHeight,
      shortStepColor,
      shortStepHeight,
      min,
      step,
      currentSelectedValue,
    ],
  );

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newStep = calculateCurrentValue(
        event.nativeEvent.contentOffset.x || event.nativeEvent.contentOffset.y,
        stepWidth,
        gapBetweenSteps,
        min,
        max,
        step,
      );

      if (prevMomentumValue.current !== newStep) {
        onValueChangeEnd?.(newStep);
      }

      prevMomentumValue.current = newStep;
    },
    [gapBetweenSteps, stepWidth, max, min, onValueChangeEnd, step],
  );

  useEffect(() => {
    if (hasInitialized.current || containerWidth <= 0) return;

    const timer = setTimeout(() => {
      const initialIndex = Math.floor((currentSelectedValue - min) / step);
      listRef.current?.scrollToOffset({
        offset: initialIndex * (stepWidth + gapBetweenSteps),
        animated: false,
      });
      hasInitialized.current = true;
    }, 0);

    return () => clearTimeout(timer);
  }, [
    currentSelectedValue,
    min,
    step,
    stepWidth,
    gapBetweenSteps,
    containerWidth,
  ]);

  return (
    <View
      style={{
        width: width || '100%',
        height,
      }}
      onLayout={handleLayout}
    >
      {containerWidth > 0 && (
        <>
          <View style={{ bottom: 0, position: 'absolute' }}>
            <FlashList
              ref={listRef}
              data={arrData}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderItem}
              ListHeaderComponent={renderSeparator}
              ListFooterComponent={renderSeparator}
              onScroll={scrollHandler}
              onMomentumScrollEnd={onMomentumScrollEnd}
              // estimatedItemSize={stepWidth + gapBetweenSteps}
              snapToOffsets={arrData.map(
                (_, index) => index * (stepWidth + gapBetweenSteps),
              )}
              decelerationRate={decelerationRate}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              horizontal
            />
          </View>
          <View
            style={[
              styles.indicator,
              {
                width: 100,
                alignSelf: 'center',
              },
            ]}
          >
            <View
              style={[
                styles.displayTextContainer,
                {
                  height: valueTextStyle?.fontSize ?? styles.valueText.fontSize,
                },
              ]}
            >
              {unit && (
                <View style={{ height: 60 }}>
                  <Text
                    style={[
                      styles.unitText,
                      unitTextStyle,
                      {
                        textAlignVertical: 'top',
                        color: 'transparent',
                      },
                    ]}
                  >
                    {unit}
                  </Text>
                </View>
              )}
              <Text
                ref={stepTextRef}
                style={[
                  styles.valueText,
                  valueTextStyle,
                  {
                    textAlign: 'center',
                    lineHeight:
                      valueTextStyle?.fontSize ?? styles.valueText.fontSize,
                    // fontVariant: 'tabular-nums',
                    fontFamily: 'tabular-nums',
                  },
                ]}
              >
                {fractionDigits === 0
                  ? Math.round(currentSelectedValue).toString()
                  : currentSelectedValue.toFixed(fractionDigits)}
              </Text>
              {unit && (
                <View style={{ height: 60 }}>
                  <Text
                    style={[
                      {
                        textAlignVertical: 'top',
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
          </View>
          <View
            style={[
              {
                width: stepWidth,
                height: indicatorHeight,
                backgroundColor: indicatorColor,
                alignSelf: 'center',
                bottom: 26,
                position: 'absolute',
              },
            ]}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    top: 0,
    width: '100%',
    alignItems: 'center',
  },
  displayTextContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    color: 'black',
    fontSize: 32,
    fontWeight: '800',
    margin: 0,
    padding: 0,
    fontFamily: 'monospace',
  },
  unitText: {
    color: 'black',
    fontSize: 24,
    fontWeight: '400',
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
  /**
   * Minimum value for calculating current value
   */
  min?: number;
  /**
   * Step value for calculating current value
   */
  step?: number;
  /**
   * Initial value for comparison
   */
  initialValue?: number;
  /**
   * Current selected value
   */
  currentSelectedValue?: number;
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
    min = 0,
    step = 1,
    initialValue = 0,
  }: // currentSelectedValue = 0,
  Props) => {
    const currentValue = index * step + min;
    const isLong = index % 10 === 0;
    const height = isLong ? longStepHeight : shortStepHeight;
    const isInitialValue = currentValue === initialValue;

    return (
      <View
        style={[
          {
            width: stepWidth,
            justifyContent: 'center',
            marginRight: isLast ? 0 : gapBetweenSteps,
            marginTop: shortStepHeight,
            overflow: 'visible',
          },
        ]}
      >
        <View
          style={[
            {
              width: '100%',
              height: height,
              backgroundColor: isLong ? longStepColor : shortStepColor,
              marginTop: isLong ? 0 : shortStepHeight / 2,
            },
          ]}
        />
        {
          <View
            style={{
              width: 40,
              marginTop: 8,
            }}
          >
            <View
              style={{
                overflow: 'visible',
                flexDirection: 'row',
              }}
            >
              {isInitialValue ? (
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    left: -20,
                    bottom: -1,
                  }}
                >
                  <Icon
                    size={14}
                    name={IconName.temperature}
                    color={Colors.black70}
                  />
                  <Text
                    style={{
                      overflow: 'visible',
                      color: Colors.black70,
                      fontSize: 14,
                    }}
                  >{`${currentValue}°`}</Text>
                </View>
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    left: -8,
                  }}
                >
                  <Text
                    style={{
                      overflow: 'visible',
                      color:
                        index % 10 === 0 &&
                        Math.abs(currentValue - initialValue) > 2
                          ? Colors.black70
                          : 'transparent',
                      fontSize: 14,
                    }}
                  >{`${currentValue}°`}</Text>
                </View>
              )}
            </View>
          </View>
        }
      </View>
    );
  },
);

const calculateCurrentValue = (
  scrollPosition: number,
  stepWidth: number,
  gapBetweenItems: number,
  min: number,
  max: number,
  step: number,
) => {
  const index = Math.round(scrollPosition / (stepWidth + gapBetweenItems));
  const newValue = Math.round(Math.min(Math.max(index * step + min, min), max));

  return newValue;
};

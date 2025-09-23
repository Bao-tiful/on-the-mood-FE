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

export interface RulerPickerItemProps {
  gapBetweenSteps: number;
  shortStepHeight: number;
  longStepHeight: number;
  stepWidth: number;
  shortStepColor: string;
  longStepColor: string;
  min?: number;
  step?: number;
  initialValue?: number;
  currentSelectedValue?: number;
  tempTagValue?: number;
}

export interface RulerPickerProps extends Partial<RulerPickerItemProps> {
  width?: number;
  height?: number;
  min: number;
  max: number;
  step?: number;
  initialValue?: number;
  tempTagValue?: number;
  fractionDigits?: number;
  unit?: string;
  indicatorHeight?: number;
  indicatorColor?: string;
  valueTextStyle?: RulerPickerTextProps;
  unitTextStyle?: RulerPickerTextProps;
  decelerationRate?: 'fast' | 'normal' | number;
  onValueChange?: (value: number) => void;
  onValueChangeEnd?: (value: number) => void;
}

// Constants
const DEFAULT_VALUES = {
  height: 500,
  step: 1,
  fractionDigits: 0,
  unit: 'cm',
  indicatorHeight: 80,
  gapBetweenSteps: 10,
  shortStepHeight: 20,
  longStepHeight: 40,
  stepWidth: 2,
  indicatorColor: 'black',
  shortStepColor: 'lightgray',
  longStepColor: 'darkgray',
  decelerationRate: 'normal' as const,
} as const;

// Utility functions
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

export const RulerPicker = ({
  width,
  height = DEFAULT_VALUES.height,
  min,
  max,
  step = DEFAULT_VALUES.step,
  initialValue = 0,
  tempTagValue = 0,
  fractionDigits = DEFAULT_VALUES.fractionDigits,
  unit = DEFAULT_VALUES.unit,
  indicatorHeight = DEFAULT_VALUES.indicatorHeight,
  gapBetweenSteps = DEFAULT_VALUES.gapBetweenSteps,
  shortStepHeight = DEFAULT_VALUES.shortStepHeight,
  longStepHeight = DEFAULT_VALUES.longStepHeight,
  stepWidth = DEFAULT_VALUES.stepWidth,
  indicatorColor = DEFAULT_VALUES.indicatorColor,
  shortStepColor = DEFAULT_VALUES.shortStepColor,
  longStepColor = DEFAULT_VALUES.longStepColor,
  valueTextStyle,
  unitTextStyle,
  decelerationRate = DEFAULT_VALUES.decelerationRate,
  onValueChange,
  onValueChangeEnd,
}: RulerPickerProps) => {
  // State
  const [containerWidth, setContainerWidth] = useState<number>(
    width || windowWidth,
  );
  const [currentSelectedValue, setCurrentSelectedValue] =
    useState<number>(initialValue);

  // Refs
  const temperatureTagValue = useRef<number>(tempTagValue);
  const listRef = useRef<any>(null);
  const stepTextRef = useRef<TextInput>(null);
  const prevValue = useRef<number>(initialValue);
  const prevMomentumValue = useRef<number>(initialValue);
  const scrollPosition = useRef(new Animated.Value(initialValue)).current;
  const hasInitialized = useRef<boolean>(false);

  // Memoized values
  const itemAmount = (max - min) / step;
  const arrData = Array.from({ length: itemAmount + 1 }, (_, index) => index);

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
        temperatureTagValue.current === 0 ||
        Math.abs(temperatureTagValue.current - initialValue) > 0
      ) {
        temperatureTagValue.current = initialValue;
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
    () => (
      <View
        style={[
          styles.separator,
          { width: containerWidth * 0.5 - stepWidth * 0.5 },
        ]}
      />
    ),
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
        initialValue={temperatureTagValue.current}
        currentSelectedValue={currentSelectedValue}
        tempTagValue={tempTagValue}
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
      tempTagValue,
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
      style={[styles.container, { width: width || '100%', height }]}
      onLayout={handleLayout}
    >
      {containerWidth > 0 && (
        <>
          <View style={styles.listContainer}>
            <FlashList
              ref={listRef}
              data={arrData}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderItem}
              ListHeaderComponent={renderSeparator}
              ListFooterComponent={renderSeparator}
              onScroll={scrollHandler}
              onMomentumScrollEnd={onMomentumScrollEnd}
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

          <ValueDisplay
            unit={unit}
            currentSelectedValue={currentSelectedValue}
            fractionDigits={fractionDigits}
            valueTextStyle={valueTextStyle}
            unitTextStyle={unitTextStyle}
            stepTextRef={stepTextRef}
          />

          <View
            style={[
              styles.centerIndicator,
              {
                width: stepWidth,
                height: indicatorHeight,
                backgroundColor: indicatorColor,
              },
            ]}
          />
        </>
      )}
    </View>
  );
};

// Value Display Component
interface ValueDisplayProps {
  unit?: string;
  currentSelectedValue: number;
  fractionDigits: number;
  valueTextStyle?: RulerPickerTextProps;
  unitTextStyle?: RulerPickerTextProps;
  stepTextRef: React.RefObject<TextInput | null>;
}

const ValueDisplay = React.memo<ValueDisplayProps>(
  ({
    unit,
    currentSelectedValue,
    fractionDigits,
    valueTextStyle,
    unitTextStyle,
    stepTextRef,
  }) => (
    <View style={[styles.indicator, styles.indicatorCenter]}>
      <View
        style={[
          styles.displayTextContainer,
          { height: valueTextStyle?.fontSize ?? styles.valueText.fontSize },
        ]}
      >
        {unit && (
          <View style={styles.unitContainer}>
            <Text
              style={[styles.unitText, unitTextStyle, styles.transparentText]}
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
            styles.tabularFont,
            {
              lineHeight: valueTextStyle?.fontSize ?? styles.valueText.fontSize,
            },
          ]}
        >
          {fractionDigits === 0
            ? Math.round(currentSelectedValue).toString()
            : currentSelectedValue.toFixed(fractionDigits)}
        </Text>

        {unit && (
          <View style={styles.unitContainer}>
            <Text style={[styles.unitText, unitTextStyle, styles.visibleText]}>
              {unit}
            </Text>
          </View>
        )}
      </View>
    </View>
  ),
);

// Ruler Picker Item Component
interface RulerPickerItemComponentProps extends RulerPickerItemProps {
  index: number;
  isLast: boolean;
}

export const RulerPickerItem = React.memo<RulerPickerItemComponentProps>(
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
    tempTagValue,
  }) => {
    const currentValue = index * step + min;
    const isLong = index % 10 === 0;
    const height = isLong ? longStepHeight : shortStepHeight;
    const isTempTagValue = tempTagValue !== undefined && currentValue === tempTagValue;

    return (
      <View
        style={[
          styles.itemContainer,
          {
            width: stepWidth,
            marginRight: isLast ? 0 : gapBetweenSteps,
            marginTop: shortStepHeight,
          },
        ]}
      >
        <View
          style={[
            styles.stepLine,
            {
              height: height,
              backgroundColor: isLong ? longStepColor : shortStepColor,
              marginTop: isLong ? 0 : shortStepHeight / 2,
            },
          ]}
        />

        <View style={styles.labelContainer}>
          <View style={styles.labelContent}>
            {isTempTagValue ? (
              <View style={styles.initialValueContainer}>
                <Icon
                  size={14}
                  name={IconName.temperature}
                  color={Colors.black70}
                />
                <Text style={styles.temperatureText}>{`${currentValue}°`}</Text>
              </View>
            ) : (
              <View style={styles.regularValueContainer}>
                <Text
                  style={[
                    styles.temperatureText,
                    {
                      color:
                        index % 10 === 0 &&
                        Math.abs(currentValue - (tempTagValue ?? initialValue)) > 2
                          ? Colors.black70
                          : 'transparent',
                    },
                  ]}
                >
                  {`${currentValue}°`}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    // Main container styles
  },
  separator: {
    // Separator styles
  },
  listContainer: {
    bottom: 0,
    position: 'absolute',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: '100%',
    alignItems: 'center',
  },
  indicatorCenter: {
    width: 100,
    alignSelf: 'center',
  },
  displayTextContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitContainer: {
    height: 60,
  },
  transparentText: {
    textAlignVertical: 'top',
    color: 'transparent',
  },
  visibleText: {
    textAlignVertical: 'top',
  },
  valueText: {
    color: 'black',
    fontSize: 32,
    fontWeight: '800',
    margin: 0,
    padding: 0,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  unitText: {
    color: 'black',
    fontSize: 24,
    fontWeight: '400',
    marginLeft: 6,
  },
  centerIndicator: {
    alignSelf: 'center',
    bottom: 26,
    position: 'absolute',
  },
  itemContainer: {
    justifyContent: 'center',
    overflow: 'visible',
  },
  stepLine: {
    width: '100%',
  },
  labelContainer: {
    width: 40,
    marginTop: 8,
  },
  labelContent: {
    overflow: 'visible',
    flexDirection: 'row',
  },
  initialValueContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    left: -20,
    bottom: -1,
  },
  regularValueContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    left: -8,
  },
  temperatureText: {
    overflow: 'visible',
    color: Colors.black70,
    fontSize: 14,
  },
  tabularFont: {
    fontFamily: 'tabular-nums',
  },
});

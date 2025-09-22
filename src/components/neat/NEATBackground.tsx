import React, { useEffect, useRef, useState } from 'react';
import { View, Dimensions, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  RadialGradient,
} from 'react-native-svg';
import { NEATConfig, DEFAULT_NEAT_CONFIG } from './types';
import { WaveCalculator } from './WaveCalculator';
import { ColorBlender } from './ColorBlender';

interface NEATBackgroundProps {
  config?: Partial<NEATConfig>;
  style?: ViewStyle;
  children?: React.ReactNode;
  paused?: boolean; // 애니메이션 일시정지 옵션
}

const NEATBackground: React.FC<NEATBackgroundProps> = ({
  config = {},
  style,
  children,
  paused = false,
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mergedConfig = { ...DEFAULT_NEAT_CONFIG, ...config };
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  const waveCalculator = useRef(new WaveCalculator(mergedConfig)).current;
  const colorBlender = useRef(new ColorBlender(mergedConfig)).current;

  const [gradientStops1, setGradientStops1] = useState<
    Array<{
      offset: string;
      stopColor: string;
      stopOpacity: number;
    }>
  >([]);

  const [gradientStops2, setGradientStops2] = useState<
    Array<{
      offset: string;
      stopColor: string;
      stopOpacity: number;
    }>
  >([]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    waveCalculator.updateConfig(mergedConfig);
    colorBlender.updateConfig(mergedConfig);
  }, [colorBlender, mergedConfig, waveCalculator]);

  useEffect(() => {
    let animationId: number;
    let startTime = Date.now();
    let pausedTime = 0;

    // 성능 최적화된 애니메이션 루프
    const updateGradients = () => {
      if (paused) {
        // 애니메이션이 일시정지된 경우, 다음 프레임에서 다시 확인
        animationId = requestAnimationFrame(updateGradients);
        return;
      }

      const currentTime = Date.now() - pausedTime;
      const activeColors = colorBlender.getActiveColors();

      if (activeColors.length > 0) {
        // 60fps로 제한 (16ms 간격)
        if (currentTime - startTime >= 16) {
          // 첫 번째 그라데이션 (수평)
          const positions1 = waveCalculator.calculateColorPositions(
            currentTime,
            activeColors.length,
          );
          const stops1 = colorBlender.generateGradientStops(
            positions1,
            currentTime,
          );
          setGradientStops1(stops1);

          // 두 번째 그라데이션 (수직, 약간의 시간 오프셋)
          const positions2 = waveCalculator.calculateColorPositions(
            currentTime + 2000,
            activeColors.length,
          );
          const stops2 = colorBlender.generateGradientStops(
            positions2,
            currentTime + 2000,
          );
          setGradientStops2(stops2);

          startTime = currentTime;
        }
      }

      animationId = requestAnimationFrame(updateGradients);
    };

    // paused 상태가 변경될 때 시간 조정
    if (paused) {
      pausedTime = Date.now();
    }

    updateGradients();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [colorBlender, waveCalculator, paused]);

  const renderGradientStops = (
    stops: Array<{
      offset: string;
      stopColor: string;
      stopOpacity: number;
    }>,
  ) => {
    return stops.map((stop, index) => (
      <Stop
        key={`stop-${index}`}
        offset={stop.offset}
        stopColor={stop.stopColor}
        stopOpacity={stop.stopOpacity}
      />
    ));
  };

  return (
    <View style={[styles.container, style]}>
      <Svg
        width={dimensions.width}
        height={dimensions.height}
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          {/* 첫 번째 선형 그라데이션 (수평) */}
          <LinearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            {renderGradientStops(gradientStops1)}
          </LinearGradient>

          {/* 두 번째 선형 그라데이션 (수직) */}
          <LinearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            {renderGradientStops(gradientStops2)}
          </LinearGradient>

          {/* 방사형 그라데이션 (하이라이트 효과) */}
          <RadialGradient
            id="radialGradient"
            cx="50%"
            cy="50%"
            rx="70%"
            ry="70%"
          >
            <Stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </RadialGradient>
        </Defs>

        {/* 기본 배경 */}
        <Rect
          width="100%"
          height="100%"
          fill={mergedConfig.backgroundColor}
          opacity={mergedConfig.backgroundAlpha}
        />

        {/* 첫 번째 그라데이션 레이어 */}
        <Rect width="100%" height="100%" fill="url(#gradient1)" opacity={0.8} />

        {/* 두 번째 그라데이션 레이어 (블렌딩) */}
        <Rect width="100%" height="100%" fill="url(#gradient2)" opacity={0.6} />

        {/* 하이라이트 레이어 */}
        {mergedConfig.highlights > 0 && (
          <Rect
            width="100%"
            height="100%"
            fill="url(#radialGradient)"
            opacity={mergedConfig.highlights * 0.1}
          />
        )}
      </Svg>

      {/* 자식 컴포넌트들 */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NEATBackground;

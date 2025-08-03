import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

// 이미지들을 미리 import
import Onboarding1 from '@assets/onboardings/onboarding_1.png';
import Onboarding2 from '@assets/onboardings/onboarding_2.png';
import Onboarding3 from '@assets/onboardings/onboarding_3.png';
import Onboarding4 from '@assets/onboardings/onboarding_4.png';
import typography from '@/styles/Typography';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '@/styles/Colors';

interface OnboardingCardProps {
  index: number;
}

const OnboardingCard = ({ index }: OnboardingCardProps) => {
  // 이미지 매핑 객체
  const onboardingImages = {
    0: Onboarding1,
    1: Onboarding2,
    2: Onboarding3,
    3: Onboarding4,
  };

  const onboardingMessages = [
    '오늘의\n당신의 감정은 몇 도인가요?',
    '체감온도와는 다른\n당신만의 온도로 기록하세요',
    '선택한 온도에 따라\n컬러가 일기를 채웁니다',
    '감정의 온도를 기록하며\n나만의 일기를 완성해보세요',
  ];

  const onboardingBackgroundColors = [
    Colors.white100,
    '#BDE3FF',
    '#EBF69A',
    Colors.white100,
  ];
  // index에 따라 이미지 소스 결정 (0-3 범위로 제한)
  const getImageSource = (index: number) => {
    const safeIndex = Math.max(0, Math.min(3, index));
    return onboardingImages[safeIndex as keyof typeof onboardingImages];
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.imageContainer,
          { backgroundColor: onboardingBackgroundColors[index] },
        ]}
      >
        <View style={{ height: 40 }} />
        <Image
          source={getImageSource(index)}
          style={{
            width: index === 0 || index === 3 ? 900 : '100%',
            height: index === 0 || index === 3 ? 400 : '100%',
            paddingHorizontal: index === 0 || index === 3 ? 0 : 16,
          }}
          resizeMode="contain"
        />
        {(index === 1 || index === 2) && (
          <LinearGradient
            colors={['#FFFFFF00', '#FFFFFF00', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: 'absolute',
              flex: 1,
              width: '100%',
              height: '100%',
            }}
          />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={[{ textAlign: 'center' }, typography.heading2]}>
          {onboardingMessages[index]}
        </Text>
      </View>
    </View>
  );
};

export default OnboardingCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textContainer: {
    paddingVertical: 32,
  },
});

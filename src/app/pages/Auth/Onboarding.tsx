import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import { Colors } from '@/styles/Colors';
import typography from '@/styles/Typography';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import OnboardingCard from '@/components/auth/OnboardingCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');

const OnboardingPage = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const buttonLabel = ['다음', '다음', '다음', '시작하기'];
  const onboardingData = [0, 1, 2, 3];

  const handleNext = async () => {
    if (index === 3) {
      // 온보딩 완료 플래그 저장
      try {
        await AsyncStorage.setItem('@hasCompletedOnboarding', 'true');
      } catch (error) {
        console.error('온보딩 완료 플래그 저장 중 오류:', error);
      }
      
      // Entrance 페이지로 이동 (스택 초기화)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Entrance' }],
      });
      return;
    }

    const nextIndex = index + 1;
    setIndex(nextIndex);
    flatListRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    });
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffset / screenWidth);
    setIndex(currentIndex);
  };

  const renderItem = ({ item }: { item: number }) => (
    <View style={{ width: screenWidth }}>
      <OnboardingCard index={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={item => item.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />

      {/* 페이지네이션 인디케이터 */}
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, i) => (
          <View
            key={i}
            style={[
              styles.paginationDot,
              {
                backgroundColor: i === index ? Colors.black100 : Colors.black18,
              },
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.bottomButton} onPress={handleNext}>
        <Text style={styles.bottomButtonLabel}>{buttonLabel[index]}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white100,
  },
  bottomButton: {
    backgroundColor: Colors.black100,
    marginHorizontal: 16,
    marginBottom: 34,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 50,
  },
  bottomButtonLabel: {
    ...typography.body,
    color: Colors.white100,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

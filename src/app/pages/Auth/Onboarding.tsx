import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useState, useRef } from "react";
import { Colors } from "@/src/styles/Colors";
import typography from "@/src/styles/Typography";
import { router } from "expo-router";
import OnboardingCard from "@/src/components/auth/OnboardingCard";

const { width: screenWidth } = Dimensions.get("window");

const OnboardingPage = () => {
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const buttonLabel = ["다음", "다음", "다음", "시작하기"];
  const onboardingData = [0, 1, 2, 3];

  const handleNext = () => {
    if (index === 3) {
      router.replace("/pages/Auth/Entrance");
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
        keyExtractor={(item) => item.toString()}
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
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 50,
  },
  bottomButtonLabel: {
    ...typography.body,
    color: Colors.white100,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

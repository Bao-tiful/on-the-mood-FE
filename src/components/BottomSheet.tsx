/// https://coding-w00se.tistory.com/33

import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
  TouchableOpacity,
} from "react-native";

interface BottomSheetProps {
  children: React.ReactNode;
  modalVisible: any; // boolean이면 boolean으로 명확하게 타입 지정 가능
  setModalVisible?: any; // (value: boolean) => void; 로 명확한 타입 지정 가능
}

const BottomSheet = ({
  children,
  modalVisible,
  setModalVisible,
}: BottomSheetProps) => {
  const screenHeight = Dimensions.get("screen").height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

  // const panResponders = useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onMoveShouldSetPanResponder: () => false,
  //     onPanResponderMove: (event, gestureState) => {
  //       panY.setValue(gestureState.dy);
  //     },
  //     onPanResponderRelease: (event, gestureState) => {
  //       if (gestureState.dy > 0 && gestureState.vy > 1.5) {
  //         closeModal();
  //       } else {
  //         resetBottomSheet.start();
  //       }
  //     },
  //   })
  // ).current;

  useEffect(() => {
    if (modalVisible) {
      resetBottomSheet.start();
    } else {
      // closeBottomSheet.start();
      closeModal();
    }
  }, [modalVisible]);

  const closeModal = () => {
    closeBottomSheet.start(() => {
      setModalVisible(false);
    });
  };

  return (
    <Modal
      visible={modalVisible}
      animationType={"fade"}
      transparent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            ...styles.bottomSheetContainer,
            transform: [{ translateY: translateY }],
          }}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  background: {
    flex: 1,
  },
  bottomSheetContainer: {
    // height: 350,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default BottomSheet;

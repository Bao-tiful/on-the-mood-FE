import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export const useScreenSize = () => {
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenHeight(window.height);
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, []);

  const isLargeScreen = screenHeight >= 800;
  const isMediumScreen = screenHeight >= 600 && screenHeight < 800;
  const isSmallScreen = screenHeight < 600;

  return {
    screenHeight,
    screenWidth,
    isLargeScreen,
    isMediumScreen,
    isSmallScreen,
  };
}; 
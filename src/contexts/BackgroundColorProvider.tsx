import React, { createContext, useState, ReactNode } from 'react';

interface BackgroundColor {
  // 색상 index 값을 state로 관리
  color: number;
}

export interface BackgroundColorContextType {
  colorState: BackgroundColor;
  setBackgroundColor: (value: number) => void;
}

export const BackgroundColorContext = createContext<
  BackgroundColorContextType | undefined
>(undefined);

interface BackgroundColorProviderProps {
  children: ReactNode;
}

export const BackgroundColorProvider: React.FC<
  BackgroundColorProviderProps
> = ({ children }) => {
  const [backgroundColor, setBackgroundColor] = useState<BackgroundColor>({
    color: 0,
  });

  const setColorIndex = (color: number) => {
    setBackgroundColor({ color });
  };

  return (
    <BackgroundColorContext.Provider
      value={{ colorState: backgroundColor, setBackgroundColor: setColorIndex }}
    >
      {children}
    </BackgroundColorContext.Provider>
  );
};

// 커스텀 훅

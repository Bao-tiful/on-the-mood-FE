import React, { createContext, useContext, useState, ReactNode } from "react";

interface BackgroundColor {
  // 색상 index 값을 state로 관리
  color: number;
}

interface BackgroundColorContextType {
  colorState: BackgroundColor;
  setBackgroundColor: (value: number) => void;
}

const BackgroundColorContext = createContext<
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
export const useBackgroundColor = (): BackgroundColorContextType => {
  const context = useContext(BackgroundColorContext);
  if (!context) {
    throw new Error(
      "useBackgroundColor는 BackgroundColorProvider 내부에서만 사용할 수 있습니다."
    );
  }
  return context;
};

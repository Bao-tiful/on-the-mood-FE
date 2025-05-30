import { useContext } from "react";
import { BackgroundColorContext } from "../contexts/BackgroundColorProvider";
import { BackgroundColorContextType } from "../contexts/BackgroundColorProvider";

export const useBackgroundColor = (): BackgroundColorContextType => {
  const context = useContext(BackgroundColorContext);
  if (!context) {
    throw new Error(
      "useBackgroundColor는 BackgroundColorProvider 내부에서만 사용할 수 있습니다."
    );
  }
  return context;
};

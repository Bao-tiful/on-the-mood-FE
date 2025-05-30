import { useContext } from "react";
import { MoodKeywordContext } from "../contexts/keywordProvider";

export const useMoodKeyword = () => {
  const context = useContext(MoodKeywordContext);
  if (!context) {
    throw new Error(
      "useMoodKeyword는 MoodKeywordProvider 내부에서만 사용할 수 있습니다."
    );
  }
  return context;
};
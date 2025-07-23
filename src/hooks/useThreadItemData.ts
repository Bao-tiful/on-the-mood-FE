import { useMemo } from "react";
import { Thread } from "@/src/types/thread";
import { OndoColors } from "@/src/styles/Colors";
import { Colors } from "@/src/styles/Colors";

/**
 * ThreadItem에서 사용할 데이터를 변환하는 훅
 */
export const useThreadItemData = (thread: Thread) => {
  const formattedDate = useMemo(() => {
    return new Date(thread.updated_at).getDate();
  }, [thread.updated_at]);

  const backgroundColor = useMemo(() => {
    return OndoColors.get(thread.custom_temp) || Colors.white100;
  }, [thread.custom_temp]);

  const accessibilityLabel = useMemo(() => {
    return `${formattedDate}일 일기, 온도 ${thread.custom_temp}도`;
  }, [formattedDate, thread.custom_temp]);

  return {
    formattedDate,
    backgroundColor,
    accessibilityLabel,
  };
};

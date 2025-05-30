import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";

export interface MoodKeyword {
  keywords: string[];
  temp_range: [number, number];
}

export interface MoodKeywordSet {
  data: MoodKeyword[];
  getKeywordsByTemp: (temp: number) => string[];
}

export const createMoodKeywordSet = (data: MoodKeyword[]): MoodKeywordSet => ({
  data,
  getKeywordsByTemp: (temp: number) => {
    const found = data.find(
      (item) => temp >= item.temp_range[0] && temp < item.temp_range[1]
    );
    return found?.keywords ?? [];
  },
});

// Context 생성
export const MoodKeywordContext = createContext<
  | {
      moodKeywordSet: MoodKeywordSet;
      setMoodKeywordSet: (data: MoodKeyword[]) => void;
    }
  | undefined
>(undefined);

export const MoodKeywordProvider = ({ children }: { children: ReactNode }) => {
  // 기본값은 빈 배열
  const [moodKeywordSet, setMoodKeywordSetState] = useState<MoodKeywordSet>(
    () => createMoodKeywordSet([])
  );

  // 외부에서 데이터로 초기화할 수 있는 함수
  const setMoodKeywordSet = useCallback((data: MoodKeyword[]) => {
    setMoodKeywordSetState(createMoodKeywordSet(data));
  }, []);

  return (
    <MoodKeywordContext.Provider value={{ moodKeywordSet, setMoodKeywordSet }}>
      {children}
    </MoodKeywordContext.Provider>
  );
};

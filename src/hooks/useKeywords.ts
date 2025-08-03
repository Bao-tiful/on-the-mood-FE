import { useEffect, useState } from 'react';
import { MoodKeyword, MoodKeywordSet } from '../types/moodKeyword';
import { getKeywords } from '../api/endpoints/weather';

// useMoodKeyword를 통해 온도별 키워드를 한 번에 가져오고,
// 전달하는 온도에 따라 해당 목록에서 키워드를 찾아서 반환하는 함수를 제공.
export const createMoodKeywordSet = (data: MoodKeyword[]): MoodKeywordSet => ({
  data,
  getKeywordsByTemp: (temp: number) => {
    const found = data.find(
      (item) => temp >= item.temp_range[0] && temp < item.temp_range[1]
    );
    return found?.keywords ?? [];
  },
});

export const useMoodKeyword = () => {
  const [moodKeywordSet, setMoodKeywordSet] = useState<MoodKeywordSet>(
    () => createMoodKeywordSet([])
  );

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const keywords = await getKeywords();
        setMoodKeywordSet(createMoodKeywordSet(keywords));
      } catch (error) {
        console.error('키워드 받아오기에 실패하였습니다 :', error);
      }
    };

    fetchKeywords();
  }, []);

  return { moodKeywordSet };
};

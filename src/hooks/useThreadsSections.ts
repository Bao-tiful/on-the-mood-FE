import { useMemo } from 'react';
import { Thread } from '@/types/thread';

type ThreadsByMonth = {
  [key: string]: Thread[];
};

export interface ThreadSection {
  title: string;
  data: Thread[];
}

/**
 * 스레드 데이터를 SectionList에서 사용할 수 있는 섹션 형태로 변환하는 훅
 */
export const useThreadsSections = (
  threads: ThreadsByMonth
): ThreadSection[] => {
  return useMemo(() => {
    return Object.entries(threads).map(([date, items]) => {
      const [year, month] = date.split('-');
      const formattedDate = `${year}.${month.padStart(2, '0')}`;
      return {
        title: formattedDate,
        data: items,
      };
    });
  }, [threads]);
};

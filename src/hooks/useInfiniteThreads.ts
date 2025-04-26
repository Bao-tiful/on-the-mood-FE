import { useState, useEffect, useCallback } from "react";
import { Thread, ThreadsResponse } from "../types/thread";
import { getThreads } from "../api/thread";

interface UseInfiniteThreadsProps {
  pageSize?: number;
}

type ThreadsByMonth = {
  [key: string]: Thread[];
};

export const useInfiniteThreads = ({
  pageSize = 10,
}: UseInfiniteThreadsProps) => {
  const [threads, setThreads] = useState<ThreadsByMonth>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchThreads = useCallback(
    async (pageNum: number) => {
      try {
        setIsLoading(true);
        const response = await getThreads({
          page: pageNum,
          size: pageSize,
        });
        console.log("response-------------", response);

        const groupedThreads = response.results;

        if (pageNum === 1) {
          setThreads(groupedThreads);
        } else {
          setThreads((prev) => {
            const newThreads = { ...prev };
            Object.entries(groupedThreads).forEach(([date, threads]) => {
              newThreads[date] = [...(newThreads[date] || []), ...threads];
            });
            return newThreads;
          });
        }

        setHasMore(response.next !== null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize]
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, hasMore]);

  const refresh = useCallback(() => {
    setPage(1);
    setThreads({});
    setHasMore(true);
  }, []);

  useEffect(() => {
    fetchThreads(page);
  }, [page, fetchThreads]);

  return {
    threads,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};

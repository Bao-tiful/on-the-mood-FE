import axios from "axios";
import { ThreadsResponse } from "../../types/thread";
import axiosClient from "../clients/axiosClient";

interface GetThreadsParams {
  page: number;
  size: number;
}

export const getThreads = async ({
  page,
  size,
}: GetThreadsParams): Promise<ThreadsResponse> => {
  try {
    const response = await axiosClient.get(
      `/daily-notes/thread?page=${page}&page_size=${size}`
    );

    return response.data;
  } catch (error) {
    console.error("API 에러:", error);
    if (axios.isAxiosError(error)) {
      console.error("에러 상세:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw error;
  }
};

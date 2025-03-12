// GPT

import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://3.35.230.131:8000", // 기본 API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// 예: 인증 토큰 설정
axiosClient.interceptors.request.use(
  (config) => {
    // const token = "your_token_here"; // 로컬 저장소에서 가져오거나 상태 관리에서 가져옴
    // if (token) {
    //   config.headers["Authorization"] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;

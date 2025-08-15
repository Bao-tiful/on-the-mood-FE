// GPT

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://onthemood.p-e.kr/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정
axiosClient.interceptors.request.use(
  async (config) => {
    // AsyncStorage에서 토큰을 가져옵니다
    const token = await AsyncStorage.getItem('accessToken');

    // 토큰이 있으면 Authorization 헤더에 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정 (필요시 토큰 갱신 등)
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 응답 에러 처리 (예: 토큰 만료 시 토큰 갱신 요청)
    return Promise.reject(error);
  }
);

export default axiosClient;

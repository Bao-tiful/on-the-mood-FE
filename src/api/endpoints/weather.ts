import axiosClient from "../clients/axiosClient";
import { handleApiError } from "../apiUtils";

interface GetWeatherProps {
  latitude: number;
  longitude: number;
}

interface WeatherData {
  id: number;
  avg_feels_like_temp: number;
  location: {
    id: number;
    name: string;
    name_ko: string;
    country_code: string;
    state?: string;
    latitude: number;
    longitude: number;
  };
  date: string;
}

export const getWeather = async ({ latitude, longitude }: GetWeatherProps) => {
  try {
    const response = await axiosClient.get<WeatherData>(
      `/weather?lon=${longitude}&lat=${latitude}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

interface GetKeywordsProp {
  temperature: number;
}

export const getKeywords = async ({ temperature }: GetKeywordsProp) => {
  try {
    const response = await axiosClient.get<string[]>(
      `weather/keywords?temp=${temperature}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

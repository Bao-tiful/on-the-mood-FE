import axios from "axios";
import axiosClient from "../clients/axiosClient";

interface SignUpProps {
  username: string;
  email: string;
  password: string;
  password2: string;
  nickname?: string;
}

export const signUp = async (postData: SignUpProps) => {
  try {
    const response = await axiosClient.post("/auth/register", postData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios Error fetching posts:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error occurred :", error);
    }
    throw error;
  }
};

interface LogInProps {
  username: string;
  password: string;
}

export const logIn = async (postData: LogInProps) => {
  try {
    const response = await axiosClient.post("/auth/login", postData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios Error fetching posts:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error occurred :", error);
    }
    throw error;
  }
};

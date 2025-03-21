import axios from "axios";
import axiosClient from "../clients/axiosClient";
import { handleApiError } from "../apiUtils";

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
    handleApiError(error);
    throw error;
  }
};

interface LogInProps {
  username: string;
  password: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

export const logIn = async (postData: LogInProps) => {
  try {
    const response = await axiosClient.post<AuthTokens>(
      "/auth/login",
      postData
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

interface Profile {
  id: number;
  nickname?: string;
  username: string;
  email: string;
  is_active: boolean;
  date_joined: string;
}

export const getProfile = async () => {
  try {
    const response = await axiosClient.get<Profile>("/auth/profile");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

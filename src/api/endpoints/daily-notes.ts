import axios from "axios";
import axiosClient from "../clients/axiosClient";
import { handleApiError } from "../apiUtils";

interface PostNotesProps {
  location: string;
  content: string;
  custom_temp: number;
}

export const postNote = async (prop: PostNotesProps) => {
  try {
    const response = await axiosClient.post<Note>("/daily-notes", prop);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

interface Note {
  id: string;
  location: string;
  content: string;
  custom_temp: number;
  created_at: string;
  updated_at: string;
}

export const getNotes = async () => {
  try {
    const response = await axiosClient.get<Note[]>("/daily-notes");
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface SignUpData {
  nickname: string;
  email: string;
}

const apiClient = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signUp = async (data: SignUpData) => {
  try {
    const res = await apiClient.post("signup", data);

    return res;
  } catch (error) {
    throw error;
  }
};

export const login = async (nickname: string, code: string) => {
  try {
    const res = await apiClient.post("login", { nickname, code });

    return res;
  } catch (error) {
    throw error;
  }
};

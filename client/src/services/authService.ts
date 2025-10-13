import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface SignUpData {
  nickname: string;
  email: string;
}

interface SignInData {
  nickname: string;
  code: string;
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

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (data: SignInData) => {
  try {
    const res = await apiClient.post("signin", data);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async (token: string) => {
  try {
    const res = await apiClient.get("me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    throw err;
  }
};

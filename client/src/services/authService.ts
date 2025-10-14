import { createAxiosInstance } from "./apiService";

interface SignUpData {
  nickname: string;
  email: string;
}

interface SignInData {
  nickname: string;
  code: string;
}

const apiClient = createAxiosInstance("auth", { withCredentials: true });

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

export const getCurrentUser = async () => {
  try {
    const res = await apiClient.get("me");

    return res.data;
  } catch (err) {
    throw err;
  }
};

export const userLogout = async () => {
  try {
    const res = await apiClient.get("logout");

    return res;
  } catch (err) {
    throw err;
  }
};

import axios, { type AxiosInstance } from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const createAxiosInstance = (
  endpointName: string,
  options?: { withCredentials?: boolean }
): AxiosInstance => {
  return axios.create({
    baseURL: `${API_URL}/${endpointName}`,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: options?.withCredentials ?? false,
  });
};

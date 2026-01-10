import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from 'axios';

import type { ApiErrorReponse } from '@/types/api-response';

const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  throw new Error('VITE_API_URL is not defined in environment variables');
}

export const createAxiosInstance = (
  endpointName: string,
  options?: { withCredentials?: boolean }
): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: `${API_URL}/${endpointName}`,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: options?.withCredentials ?? false,
  });

  axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => res,
    (err: AxiosError<ApiErrorReponse>) => {
      if (err.response?.data?.message) {
        const enhancedError = new AxiosError(
          err.response.data.message,
          err.code,
          err.config,
          err.request,
          err.response
        );

        enhancedError.message = err.response.data.message;
        return Promise.reject(enhancedError);
      }
      return Promise.reject(err);
    }
  );

  return axiosInstance;
};

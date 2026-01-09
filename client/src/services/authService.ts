import { createAxiosInstance } from './apiService';
import type { UserType, UserSignUpType } from '../types/user';
import type { SignUpData, SignInData } from '../types/user';
import type { BaseApiResponse } from '../types/api-response';

const apiClient = createAxiosInstance('auth', { withCredentials: true });

export const signUp = async (data: SignUpData): Promise<UserSignUpType> => {
  const res = await apiClient.post<BaseApiResponse<UserSignUpType>>(
    'signup',
    data
  );

  return res.data.data;
};

export const login = async (data: SignInData): Promise<UserType> => {
  const res = await apiClient.post<BaseApiResponse<UserType>>('signin', data);

  return res.data.data;
};
export const getCurrentUser = async (): Promise<UserType> => {
  const res = await apiClient.get<BaseApiResponse<UserType>>('me');

  return res.data.data;
};

export const userLogout = async (): Promise<BaseApiResponse<void>> => {
  const res = await apiClient.post<BaseApiResponse<void>>('logout');

  return res.data;
};

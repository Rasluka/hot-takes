export interface BaseApiResponse<T = void> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiErrorReponse {
  message: string;
}

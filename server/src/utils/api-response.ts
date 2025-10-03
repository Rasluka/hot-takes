import { Response } from 'express';

interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}

const createApiResponse = <T>(
  status: number,
  data: T,
  message: string,
): ApiResponse<T> => ({
  status,
  data,
  message,
});

export const successApiResponse = <T>(
  res: Response,
  status: number = 200,
  data: T,
  message: string = 'Request completed successfully.',
): void => {
  const response = createApiResponse(status, data, message);
  res.status(status).json(response);
};

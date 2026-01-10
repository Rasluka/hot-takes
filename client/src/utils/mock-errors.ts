import { AxiosError, AxiosHeaders } from 'axios';

import type { ApiErrorReponse } from '@/types/api-response';

export const createMockAxiosError = (
  message: string,
  statusCode: number = 400
): AxiosError<ApiErrorReponse> => {
  const mockConfig = {
    url: '/signup',
    method: 'post' as const,
    headers: new AxiosHeaders(), // Required by InternalAxiosRequestConfig
  };

  // Create mock response
  const mockResponse = {
    data: { message },
    status: statusCode,
    statusText: getStatusText(statusCode),
    headers: {},
    config: mockConfig,
  };

  // Create and return AxiosError
  return new AxiosError(
    message,
    getErrorCode(statusCode),
    mockConfig, // config (not needed for mocks)
    undefined, // request (not needed for mocks)
    mockResponse
  );
};

// Helper functions
const getStatusText = (status: number): string => {
  const statusTexts: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    500: 'Internal Server Error',
  };
  return statusTexts[status] || 'Unknown Error';
};

const getErrorCode = (status: number): string => {
  const errorCodes: Record<number, string> = {
    400: 'ERR_BAD_REQUEST',
    401: 'ERR_UNAUTHORIZED',
    403: 'ERR_FORBIDDEN',
    404: 'ERR_NOT_FOUND',
    409: 'ERR_CONFLICT',
    500: 'ERR_INTERNAL',
  };
  return errorCodes[status] || 'ERR_UNKNOWN';
};

// Predefined error factories for common cases
export const mockEmailExistsError = (): AxiosError => {
  return createMockAxiosError('Email already exists', 409);
};

export const mockNicknameExistsError = (): AxiosError => {
  return createMockAxiosError('Nickname already exists', 409);
};

export const mockValidationError = (field: string): AxiosError => {
  return createMockAxiosError(`${field} is required`, 400);
};

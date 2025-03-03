import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Default statusCode but may be changed later is a custom error class is created
  const statusCode = 500;
  let message = 'Internal server error.';

  if (error instanceof Error) {
    message = error.message;
  }

  logger.error(`Status: ${statusCode}, Message: ${message}`, { error });

  res.status(statusCode).json({ message });
};

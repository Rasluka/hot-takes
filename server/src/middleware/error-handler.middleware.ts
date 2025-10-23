import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger.util';
import { AppError } from '../errors/app.error';

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Default statusCode but may be changed later is a custom error class is created
  let statusCode = 500;
  let message = 'Internal server error.';

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  logger.error(
    `[${req.url}] => [${req.method}] => Status: ${statusCode}, Message: ${message}`,
    { error },
  );

  res.status(statusCode).json({ message });
};

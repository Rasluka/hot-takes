import { Response } from "express";

export const successApiResponse = (
  res: Response,
  status: number,
  data: any,
  message: string = "Request completed successfullyS"
) => {
  res.status(status).json({
    status,
    data,
    message,
  });
};

export const errorApiResponse = (
  res: Response,
  status: number,
  error?: any,
  message: string = "Internal server error."
) => {
  res.status(status).json({
    status,
    message,
    error: error || null,
  });
};

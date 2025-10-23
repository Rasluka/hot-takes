import { Request, Response, NextFunction } from 'express';

// Extend the Request type to include the `user` property
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

// Define the checkRole middleware
export const checkRole = (requiredRole: string) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    const user = req.user;

    if (!user || user.role.toLowerCase() !== requiredRole.toLowerCase()) {
      res.status(403).json({ message: 'Access denied.' });
      return;
    }

    next();
  };
};

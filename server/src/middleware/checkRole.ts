import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/interfaces';

// Extend the Request type to include the `user` property
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// Define the checkRole middleware
export const checkRole = (requiredRole: string) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    const user = req.user;

    if (!user || user.role.name.toLowerCase() !== requiredRole.toLowerCase()) {
      res
        .status(403)
        .json({ message: 'Access denied. Insufficient permissions.' });
      return; // Stop further execution
    }

    next(); // Proceed to the next middleware or route handler
  };
};

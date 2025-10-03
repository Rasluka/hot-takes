import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: number;
  role: { id: number; name: string };
}

interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (
      err: jwt.VerifyErrors | null,
      user: string | jwt.JwtPayload | undefined,
    ) => {
      if (err) {
        res.status(403).json({ message: 'Invalid or expired token.' });
        return;
      }

      req.user = user as TokenPayload;
      next();
    },
  );
}

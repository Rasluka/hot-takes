import { Request } from 'express';

export interface TokenPayload {
  userId: number;
  role: { id: number; name: string };
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

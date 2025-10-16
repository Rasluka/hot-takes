import express from 'express';
import { AuthService } from '../services/auth-service';
import { AuthController } from '../controllers/auth-controller';
import { asyncWrapper } from '../utils/async-wrapper';
import { authenticateToken } from '../middleware/auth-token';
import { PrismaClient } from '@prisma/client';

export const createAuthRouter = (prisma: PrismaClient) => {
  const jwtKey = process.env.JWT_SECRET;
  if (!jwtKey) throw new Error('JWT_SECRET environment variable is not set.');

  const router = express.Router();
  const authService = new AuthService(jwtKey, prisma);
  const authController = new AuthController(authService);

  router.post('/signup', asyncWrapper(authController.signUp));
  router.post('/signin', asyncWrapper(authController.signIn));
  router.get(
    '/me',
    authenticateToken,
    asyncWrapper(authController.getCurrentUser),
  );
  router.post('/logout', asyncWrapper(authController.logout));

  return router;
};

import express, { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { asyncWrapper } from '../utils/async-wrapper.util';
import { authenticateToken } from '../middleware/auth-token.middleware';
import { PrismaClient } from '@prisma/client';

export const createAuthRouter = (prisma: PrismaClient): Router => {
  const router = express.Router();
  const authService = new AuthService(prisma);
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

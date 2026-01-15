import express, { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { asyncWrapper } from '../utils/async-wrapper.util';
import { authenticateToken } from '../middleware/auth-token.middleware';
import { validate } from '../middleware/validation.middleware';
import { UserCreateSchema } from '../dto/user/user-create.dto';
import { SignInSchema } from '../dto/auth/sign-in.dto';
import { PrismaClient } from '@prisma/client';

export const createAuthRouter = (prisma: PrismaClient): Router => {
  const router = express.Router();
  const authService = new AuthService(prisma);
  const authController = new AuthController(authService);

  router.post('/signup', validate(UserCreateSchema), asyncWrapper(authController.signUp));
  router.post('/signin', validate(SignInSchema), asyncWrapper(authController.signIn));
  router.get(
    '/me',
    authenticateToken,
    asyncWrapper(authController.getCurrentUser),
  );
  router.post('/logout', asyncWrapper(authController.logout));

  return router;
};

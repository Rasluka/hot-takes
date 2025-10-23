import express, { Router } from 'express';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { asyncWrapper } from '../utils/async-wrapper.util';
import { authenticateToken } from '../middleware/auth-token.middleware';
import { checkRole } from '../middleware/check-role.middleware';
import { PrismaClient } from '@prisma/client';

export const createUserRouter = (prisma: PrismaClient): Router => {
  const router = express.Router();
  router.use(authenticateToken, checkRole('admin'));

  const userService = new UserService(prisma);
  const userController = new UserController(userService);

  router.get('/', asyncWrapper(userController.getAll));
  router.get('/:id', asyncWrapper(userController.getById));
  router.post('/', asyncWrapper(userController.create));
  router.patch('/:id/role', asyncWrapper(userController.updateUserRole));
  router.delete('/:id', asyncWrapper(userController.deleteById));

  return router;
};

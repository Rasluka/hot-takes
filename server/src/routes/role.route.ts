import express, { Router } from 'express';
import { RoleService } from '../services/role.service';
import { RoleController } from '../controllers/role.controller';
import { asyncWrapper } from '../utils/async-wrapper.util';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth-token.middleware';
import { checkRole } from '../middleware/check-role.middleware';

export const createRoleRouter = (prisma: PrismaClient): Router => {
  const router = express.Router();
  const roleService = new RoleService(prisma);
  const roleController = new RoleController(roleService);

  router.use(authenticateToken, checkRole('admin'));

  router.get('/', asyncWrapper(roleController.getAll));
  router.get('/:id', asyncWrapper(roleController.getById));
  router.post('/', asyncWrapper(roleController.create));
  router.put('/:id', asyncWrapper(roleController.updateById));
  router.delete('/:id', asyncWrapper(roleController.deleteById));

  return router;
};

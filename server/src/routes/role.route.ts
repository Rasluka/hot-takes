import express, { Router } from 'express';
import { RoleService } from '../services/role.service';
import { RoleController } from '../controllers/role.controller';
import { asyncWrapper } from '../utils/async-wrapper.util';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth-token.middleware';
import { checkRole } from '../middleware/check-role.middleware';
import { validate } from '../middleware/validation.middleware';
import { RoleCreateSchema } from '../dto/role/role-create.dto';
import { RoleUpdateSchema } from '../dto/role/role-update.dto';

export const createRoleRouter = (prisma: PrismaClient): Router => {
  const router = express.Router();
  const roleService = new RoleService(prisma);
  const roleController = new RoleController(roleService);

  router.use(authenticateToken, checkRole('admin'));

  router.get('/', asyncWrapper(roleController.getAll));
  router.get('/:id', asyncWrapper(roleController.getById));
  router.post(
    '/',
    validate(RoleCreateSchema),
    asyncWrapper(roleController.create),
  );
  router.patch(
    '/:id',
    validate(RoleUpdateSchema),
    asyncWrapper(roleController.updateById),
  );
  router.delete('/:id', asyncWrapper(roleController.deleteById));

  return router;
};

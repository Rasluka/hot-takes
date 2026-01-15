import express, { Router } from 'express';
import { TakeService } from '../services/take.service';
import { TakeController } from '../controllers/take.controller';
import { asyncWrapper } from '../utils/async-wrapper.util';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth-token.middleware';
import { validate } from '../middleware/validation.middleware';
import { TakeCreateSchema } from '../dto/take/take-create.dto';
import { TakeUpdateSchema } from '../dto/take/take-update.dto';

export const createTakeRouter = (prisma: PrismaClient): Router => {
  const router = express.Router();
  const takeService = new TakeService(prisma);
  const takeController = new TakeController(takeService);

  router.get('/', asyncWrapper(takeController.getAll));
  router.get('/:id', asyncWrapper(takeController.getById));
  router.post('/', authenticateToken, validate(TakeCreateSchema), asyncWrapper(takeController.create));
  router.put(
    '/:id',
    authenticateToken,
    validate(TakeUpdateSchema),
    asyncWrapper(takeController.updateById),
  );
  router.delete(
    '/:id',
    authenticateToken,
    asyncWrapper(takeController.deleteById),
  );

  return router;
};

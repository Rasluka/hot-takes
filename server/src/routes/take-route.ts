import express from 'express';
import { TakeService } from '../services/take-service';
import { TakeController } from '../controllers/take-controller';
import { asyncWrapper } from '../utils/async-wrapper';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth-token';

export const createTakeRouter = (prisma: PrismaClient) => {
  const router = express.Router();
  const takeService = new TakeService(prisma);
  const takeController = new TakeController(takeService);

  router.get('/', asyncWrapper(takeController.getAll));
  router.get('/:id', asyncWrapper(takeController.getById));
  router.post('/', authenticateToken, asyncWrapper(takeController.create));
  router.put(
    '/:id',
    authenticateToken,
    asyncWrapper(takeController.updateById),
  );
  router.delete(
    '/:id',
    authenticateToken,
    asyncWrapper(takeController.deleteById),
  );

  return router;
};

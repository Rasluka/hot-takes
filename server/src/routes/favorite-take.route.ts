import { FavoriteTakeController } from './../controllers/favorite-take.controller';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { FavoriteTakeService } from '../services/favorite-take.service';
import { asyncWrapper } from '../utils/async-wrapper.util';
import { authenticateToken } from '../middleware/auth-token.middleware';

export const createFavoriteTakeRouter = (prisma: PrismaClient): Router => {
  const router = Router();
  const favoriteTakeService = new FavoriteTakeService(prisma);
  const favoriteTakeController = new FavoriteTakeController(
    favoriteTakeService,
  );

  router.use(authenticateToken);

  router.get('/', asyncWrapper(favoriteTakeController.getUserFavorites));
  router.post('/', asyncWrapper(favoriteTakeController.addFavorite));
  router.delete(
    '/:takeId',
    asyncWrapper(favoriteTakeController.removeFavorite),
  );

  return router;
};

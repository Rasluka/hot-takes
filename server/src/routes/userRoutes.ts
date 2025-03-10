import express, { NextFunction, Response } from 'express';
import dbPool from '../db';
import { UserService } from '../services/userService';
import { UserController } from '../controllers/userController';
import { asyncWrapper } from '../utils/asyncWrapper';
import { authenticateToken } from '../middleware/authMiddleware';
import { AuthenticatedRequest, checkRole } from '../middleware/checkRole';

const router = express.Router();

router.use(authenticateToken);

const userService = new UserService(dbPool);
const userController = new UserController(userService);

router.get(
  '/',
  checkRole('admin'),
  asyncWrapper(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      await userController.getAll(req, res, next);
    },
  ),
);

router.get(
  '/:userId',
  checkRole('admin'),
  asyncWrapper(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      await userController.getById(req, res, next);
    },
  ),
);

router.patch(
  '/:userId/role',
  checkRole('admin'),
  asyncWrapper(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      await userController.updateUserRole(req, res, next);
    },
  ),
);

router.delete(
  '/:id',
  checkRole('admin'),
  asyncWrapper(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      await userController.delete(req, res, next);
    },
  ),
);

export default router;

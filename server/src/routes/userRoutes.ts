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

// Get All Users
router.get(
  '/',
  checkRole('admin'),
  asyncWrapper(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      await userController.getAll(req, res, next);
    },
  ),
);

// Get User by Id
router.get(
  '/:userId',
  checkRole('admin'),
  asyncWrapper(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      await userController.getById(req, res, next);
    },
  ),
);

// Update User Role
router.patch(
  '/:userId/role',
  checkRole('admin'),
  asyncWrapper(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      await userController.updateUserRole(req, res, next);
    },
  ),
);

// Remove User
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

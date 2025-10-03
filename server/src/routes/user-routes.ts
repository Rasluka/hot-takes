import express, { NextFunction, Response } from 'express';
import { UserService } from '../services/user-service';
import { UserController } from '../controllers/user-controller';
import { asyncWrapper } from '../utils/async-wrapper';
import { authenticateToken } from '../middleware/auth-middleware';
import { AuthenticatedRequest, checkRole } from '../middleware/check-role';

const router = express.Router();

router.use(authenticateToken);

const userService = new UserService();
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
  '/:id',
  checkRole('admin'),
  asyncWrapper(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      await userController.getById(req, res, next);
    },
  ),
);

// Update User Role
router.patch(
  '/:id/role',
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

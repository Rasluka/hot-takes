import express, { NextFunction, Request, Response } from 'express';
import dbPool from '../db';
import { UserService } from '../services/userService';
import { UserController } from '../controllers/userController';
import { asyncWrapper } from '../utils/asyncWrapper';

const router = express.Router();

const userService = new UserService(dbPool);
const userController = new UserController(userService);

// GetAll
router.get(
  '/',
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    userController.getAll(req, res, next),
  ),
);

//GetById
router.get(
  '/:userId',
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    userController.getById(req, res, next),
  ),
);

// Update user role
router.patch(
  '/:userId/role',
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    userController.updateUserRole(req, res, next),
  ),
);

//DeleteById
router.delete(
  '/:id',
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    userController.delete(req, res, next),
  ),
);

export default router;

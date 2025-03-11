import express, { Request, Response, NextFunction } from 'express';
import dbPool from '../db';
import { AuthService } from '../services/authService';
import { AuthController } from '../controllers/authController';
import { asyncWrapper } from '../utils/asyncWrapper';
const jwtKey = process.env.JWT_SECRET || '';
// const expTokenTime: string = process.env.TOKEN_EXPIRATION_TIME || '1h';

const router = express.Router();
const authService = new AuthService(dbPool, jwtKey);
const authController = new AuthController(authService);

router.post(
  '/signup',
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    authController.signUp(req, res, next),
  ),
);

router.post(
  '/signin',
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    authController.signIn(req, res, next),
  ),
);

export default router;

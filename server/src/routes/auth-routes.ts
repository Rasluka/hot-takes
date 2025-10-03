import express, { Request, Response, NextFunction } from 'express';
// import dbPool from '../db';
import { AuthService } from '../services/auth-service';
import { AuthController } from '../controllers/auth-controller';
import { asyncWrapper } from '../utils/async-wrapper';
const jwtKey = process.env.JWT_SECRET || '';
// const expTokenTime: string = process.env.TOKEN_EXPIRATION_TIME || '1h';

const router = express.Router();
const authService = new AuthService(jwtKey);
// const authService = new AuthService();
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

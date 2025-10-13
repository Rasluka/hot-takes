import express, { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth-service';
import { AuthController } from '../controllers/auth-controller';
import { asyncWrapper } from '../utils/async-wrapper';
import { authenticateToken } from '../middleware/auth-middleware';
const jwtKey = process.env.JWT_SECRET || '';

const router = express.Router();
const authService = new AuthService(jwtKey);
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

router.get(
  '/me',
  authenticateToken,
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    authController.getCurrentUser(req, res, next),
  ),
);

export default router;

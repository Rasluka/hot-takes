import express, { Request, Response } from 'express';
import dbPool from '../db';
import { UserService } from '../services/userService';
import { UserController } from '../controllers/userController';

const router = express.Router();

const userService = new UserService(dbPool);
const userController = new UserController(userService);

// GetAll
router.get('/', async (req: Request, res: Response) =>
  userController.getAllUser(req, res),
);

//GetById
router.get('/:id', async (req: Request, res: Response) =>
  userController.getUserById(req, res),
);

//DeleteById
router.delete('/:id', async (req: Request, res: Response) =>
  userController.deleteUser(req, res),
);

export default router;

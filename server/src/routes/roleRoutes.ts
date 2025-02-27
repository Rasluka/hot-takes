import express, { Request, Response } from 'express';
import { RoleService } from '../services/roleService';
import dbPool from '../db';
import { RoleController } from '../controllers/roleController';

const router = express.Router();
const roleService = new RoleService(dbPool);
const roleController = new RoleController(roleService);

router.post('/', async (req: Request, res: Response) =>
  roleController.createRole(req, res),
);

export default router;

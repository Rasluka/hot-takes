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

router.get('/', async (req: Request, res: Response) =>
  roleController.getAll(req, res),
);

router.put('/:id', async (req: Request, res: Response) =>
  roleController.updateRole(req, res),
);

router.get('/:id', async (req: Request, res: Response) =>
  roleController.getRoleById(req, res),
);

router.delete('/:id', async (req: Request, res: Response) =>
  roleController.deleteRole(req, res),
);

export default router;

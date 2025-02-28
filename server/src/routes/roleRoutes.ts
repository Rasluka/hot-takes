import express, { Request, Response, NextFunction } from 'express';
import dbPool from '../db';
import { RoleService } from '../services/roleService';
import { RoleController } from '../controllers/roleController';
import { asyncWrapper } from '../utils/asyncWrapper';

const router = express.Router();
const roleService = new RoleService(dbPool);
const roleController = new RoleController(roleService);

router.get(
  '/',
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    roleController.getAll(req, res, next),
  ),
);

router.get(
  '/:id',
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    roleController.getById(req, res, next),
  ),
);

router.post(
  '/',
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    roleController.create(req, res, next),
  ),
);

router.put(
  '/:id',
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    roleController.updateById(req, res, next),
  ),
);

router.delete(
  '/:id',
  asyncWrapper((req: Request, res: Response, next: NextFunction) =>
    roleController.deleteById(req, res, next),
  ),
);

export default router;

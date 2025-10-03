import express, { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/role-service';
import { RoleController } from '../controllers/role-controller';
import { asyncWrapper } from '../utils/async-wrapper';

const router = express.Router();
const roleService = new RoleService();
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

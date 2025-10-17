import { Request, Response } from 'express';
import { RoleService } from '../services/role-service';
import { successApiResponse } from '../utils/api-response';
import { Role } from '../types/role';
import { BadRequest } from '../errors/bad-request';

export class RoleController {
  private roleService: RoleService;

  constructor(roleService: RoleService) {
    this.roleService = roleService;
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const results: Role[] = await this.roleService.getAll();

    return successApiResponse(
      res,
      200,
      results,
      'Roles retrieved succesfully!',
    );
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const roleId = Number(req.params.id);

    if (isNaN(roleId)) throw new BadRequest('Invalid ID.');

    const result: Role = await this.roleService.getById(roleId);

    return successApiResponse(res, 200, result, 'Role retrieved succesfully!');
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const { name = '' } = req.body;

    if (!name.trim()) throw new BadRequest('Role name is required.');

    const result = await this.roleService.create(name);

    return successApiResponse(res, 201, result, 'Role created successfully!');
  };

  updateById = async (req: Request, res: Response): Promise<void> => {
    const { name = '' } = req.body;
    const roleId = Number(req.params.id);

    if (isNaN(roleId)) throw new BadRequest('Invalid ID.');

    if (!name.trim()) throw new BadRequest('Role name is required.');

    const result = await this.roleService.updateById(roleId, name);
    return successApiResponse(res, 200, result, 'Role updated succesfully!');
  };

  deleteById = async (req: Request, res: Response): Promise<void> => {
    const roleId = Number(req.params.id);

    if (isNaN(roleId)) throw new BadRequest('Invalid ID.');

    const result = await this.roleService.deleteById(roleId);
    return successApiResponse(res, 200, result, 'Role deleted succesfully!');
  };
}

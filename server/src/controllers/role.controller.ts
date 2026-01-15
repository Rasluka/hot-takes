import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';
import { successApiResponse } from '../utils/api-response.util';
import { RoleResponseDto } from '../dto/role/role-response.dto';
import { BadRequest } from '../errors/bad-request.error';
import { RoleCreateDto } from '../dto/role/role-create.dto';
import { RoleUpdateDto } from '../dto/role/role-update.dto';

export class RoleController {
  private roleService: RoleService;

  constructor(roleService: RoleService) {
    this.roleService = roleService;
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const results: RoleResponseDto[] = await this.roleService.getAll();

    return successApiResponse(
      res,
      200,
      results,
      'Roles retrieved successfully!',
    );
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const roleId = Number(req.params.id);

    if (isNaN(roleId)) throw new BadRequest('Invalid ID.');

    const result: RoleResponseDto = await this.roleService.getById(roleId);

    return successApiResponse(res, 200, result, 'Role retrieved successfully!');
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const roleData: RoleCreateDto = req.body;

    if (!roleData.name.trim()) throw new BadRequest('Role name is required.');

    const result = await this.roleService.create(roleData);

    return successApiResponse(res, 201, result, 'Role created successfully!');
  };

  updateById = async (req: Request, res: Response): Promise<void> => {
    const roleData: RoleUpdateDto = req.body;
    const roleId = Number(req.params.id);

    if (isNaN(roleId)) throw new BadRequest('Invalid ID.');

    if (!roleData.name.trim()) throw new BadRequest('Role name is required.');

    const result = await this.roleService.updateById(roleId, roleData);
    return successApiResponse(res, 200, result, 'Role updated successfully!');
  };

  deleteById = async (req: Request, res: Response): Promise<void> => {
    const roleId = Number(req.params.id);

    if (isNaN(roleId)) throw new BadRequest('Invalid ID.');

    const result = await this.roleService.deleteById(roleId);
    return successApiResponse(res, 200, result, 'Role deleted successfully!');
  };
}

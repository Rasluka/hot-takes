import { Request, Response } from 'express';
import { RoleService } from '../services/roleService';
import { errorApiResponse, successApiResponse } from '../utils/apiResponse';

export class RoleController {
  private roleService: RoleService;

  constructor(roleService: RoleService) {
    this.roleService = roleService;
  }

  async createRole(req: Request, res: Response): Promise<void> {
    const { roleName } = req.body;

    if (!roleName) {
      errorApiResponse(res, 400, 'Role name is required.');
    }

    try {
      const results = await this.roleService.createRole(roleName);

      successApiResponse(res, 201, results, 'Role created successfully!');
    } catch (err) {
      errorApiResponse(res, 500, err, 'Internal server error.');
    }
  }
}

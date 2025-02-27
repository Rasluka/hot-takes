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

  async getAll(_: Request, res: Response): Promise<void> {
    try {
      const results = await this.roleService.getAllRoles();

      if (results.rows.length === 0) {
        errorApiResponse(res, 404, 'No roles found!');
      }

      successApiResponse(
        res,
        200,
        results.rows,
        'Roles retrieved succesfully!',
      );
    } catch (err) {
      errorApiResponse(res, 500, err);
    }
  }

  async updateRole(req: Request, res: Response): Promise<void> {
    const { roleName } = req.body;
    const roleId = req.params.id;

    if (!roleId || !roleName) {
      errorApiResponse(res, 400, 'Role id and name are required.');
    }

    try {
      const results = await this.roleService.updateRole(roleId, roleName);

      if (!results.rowCount) {
        return errorApiResponse(res, 404, 'Role not found!');
      }

      successApiResponse(res, 200, results, 'Role updated succesfully!');
    } catch (err) {
      errorApiResponse(res, 500, err);
    }
  }

  async getRoleById(req: Request, res: Response): Promise<void> {
    const roleId = req.params.id;

    try {
      const results = await this.roleService.getRoleById(roleId);

      if (!results.rowCount) {
        return errorApiResponse(res, 404, 'Role not found!');
      }

      successApiResponse(
        res,
        200,
        results.rows[0],
        'Role retrieved succesfully!',
      );
    } catch (err) {
      errorApiResponse(res, 500, err);
    }
  }

  async deleteRole(req: Request, res: Response): Promise<void> {
    const roleId = req.params.id;

    try {
      const results = await this.roleService.deleteRole(roleId);

      if (!results.rowCount) {
        return errorApiResponse(res, 404, 'Role not found!');
      }

      successApiResponse(
        res,
        200,
        results.rows[0],
        'Role deleted succesfully!',
      );
    } catch (err) {
      errorApiResponse(res, 500, err);
    }
  }
}

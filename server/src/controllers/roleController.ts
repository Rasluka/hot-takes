import { NextFunction, Request, Response } from 'express';
import { RoleService } from '../services/roleService';
import { successApiResponse } from '../utils/apiResponse';

export class RoleController {
  private roleService: RoleService;

  constructor(roleService: RoleService) {
    this.roleService = roleService;
  }

  async getAll(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const results = await this.roleService.getAll();

    if (results.rows.length === 0) {
      return next(new Error('No roles found!'));
    }

    return successApiResponse(
      res,
      200,
      results.rows,
      'Roles retrieved succesfully!',
    );
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const roleId = req.params.id;

    const results = await this.roleService.getById(roleId);

    if (!results.rowCount) {
      return next(new Error('Role not found!'));
    }

    return successApiResponse(
      res,
      200,
      results.rows[0],
      'Role retrieved succesfully!',
    );
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name } = req.body;

    if (!name) {
      return next(new Error('Role name is required.'));
    }

    const results = await this.roleService.create(name);

    return successApiResponse(
      res,
      201,
      results.rows[0],
      'Role created successfully!',
    );
  }

  async updateById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { name } = req.body;
    const id = req.params.id;

    if (!id || !name) {
      return next(new Error('Role id and name are required.'));
    }

    const results = await this.roleService.updateById(id, name);

    if (!results.rowCount) {
      return next(Error('Role not found!'));
    }

    return successApiResponse(
      res,
      200,
      results.rows[0],
      'Role updated succesfully!',
    );
  }

  async deleteById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const roleId = req.params.id;

    const results = await this.roleService.deleteById(roleId);

    if (!results.rowCount) {
      return next(new Error('Role not found!'));
    }

    return successApiResponse(
      res,
      200,
      results.rows[0],
      'Role deleted succesfully!',
    );
  }
}

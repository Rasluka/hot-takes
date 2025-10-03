import { NextFunction, Request, Response } from 'express';
import { RoleService } from '../services/role-service';
import { successApiResponse } from '../utils/api-response';
import { IRole } from '../models/interfaces';
import { NotFound } from '../errors/not-found';

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
    const results: IRole[] = await this.roleService.getAll();

    if (results.length === 0) {
      return next(new NotFound('No roles found!'));
    }

    return successApiResponse(
      res,
      200,
      results,
      'Roles retrieved succesfully!',
    );
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const roleId = req.params.id;

    const result: IRole | null = await this.roleService.getById(roleId);

    if (!result) {
      return next(new NotFound('Role not found!'));
    }

    return successApiResponse(res, 200, result, 'Role retrieved succesfully!');
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name } = req.body;

    if (!name) {
      return next(new Error('Role name is required.'));
    }

    const result = await this.roleService.create(name);

    return successApiResponse(res, 201, result, 'Role created successfully!');
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

    try {
      const result = await this.roleService.updateById(id, name);
      return successApiResponse(res, 200, result, 'Role updated succesfully!');
    } catch (err: any) {
      if (err.code === 'P2025') {
        return next(new NotFound('Role not found!'));
      }

      throw next(err);
    }
  }

  async deleteById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const roleId = req.params.id;

    try {
      const result = await this.roleService.deleteById(roleId);
      return successApiResponse(res, 200, result, 'Role deleted succesfully!');
    } catch (err: any) {
      if (err.code === 'P2025') {
        return next(new NotFound('Role not found!'));
      }

      throw next(err);
    }
  }
}

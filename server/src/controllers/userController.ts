import { Response, Request, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { successApiResponse } from '../utils/apiResponse';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getAll(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const results = await this.userService.getAll();

    if (!results.rowCount) {
      return next(new Error('No user found!'));
    }

    return successApiResponse(
      res,
      200,
      results.rows,
      'Users retrieved successfully!',
    );
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId: string = req.params.userId;

    const results = await this.userService.getById(userId);

    if (!results.rowCount) {
      return next(new Error('User not found!'));
    }

    return successApiResponse(
      res,
      200,
      results.rows[0],
      'User fetched successfully!',
    );
  }

  async updateUserRole(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId: string = req.params.userId;
    const { roleId } = req.body;

    const results = await this.userService.updateUserRole(userId, roleId);

    if (!results.rowCount) {
      return next(new Error('User not found!'));
    }

    return successApiResponse(
      res,
      200,
      results.rows[0],
      'User role updated successfully!',
    );
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId: string = req.params.id;

    const results = await this.userService.delete(userId);

    if (!results.rowCount) {
      return next(new Error('User not found!'));
    }

    return successApiResponse(
      res,
      200,
      results.rows[0],
      'User deleted successfully!',
    );
  }
}

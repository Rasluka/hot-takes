import { Response, Request, NextFunction } from 'express';
import { UserService } from '../services/user-service';
import { successApiResponse } from '../utils/api-response';
import { NotFound } from '../errors/not-found';

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

    if (results.length === 0) {
      return next(new NotFound('No user found!'));
    }

    return successApiResponse(
      res,
      200,
      results,
      'Users retrieved successfully!',
    );
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId: string = req.params.id;

    const result = await this.userService.getById(userId);

    if (!result) {
      return next(new NotFound('User not found!'));
    }

    return successApiResponse(res, 200, result, 'User fetched successfully!');
  }

  async updateUserRole(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId: string = req.params.id;
    const { roleId } = req.body;

    try {
      const result = await this.userService.updateUserRole(userId, roleId);
      return successApiResponse(
        res,
        200,
        result,
        'User role updated successfully!',
      );
    } catch (err: any) {
      if (err.code === 'P2025') {
        return next(new NotFound('User not found!'));
      }

      throw next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId: string = req.params.id;

    try {
      const result = await this.userService.deleteById(userId);
      return successApiResponse(res, 200, result, 'User deleted successfully!');
    } catch (err: any) {
      if (err.code === 'P2025') {
        return next(new NotFound('User not found!'));
      }

      throw next(err);
    }
  }
}

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

  async getUserById(req: Request, res: Response): Promise<void> {
    const userId: string = req.params.id;

    const results = await this.userService.getUserById(userId);

    if (!results.rowCount) {
      throw new Error('User not found!');
    }

    return successApiResponse(
      res,
      200,
      results.rows[0],
      'User fetched successfully!',
    );
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const userId: string = req.params.id;

    const results = await this.userService.deleteUser(userId);

    if (!results.rowCount) {
      throw new Error('User not found!');
    }

    return successApiResponse(res, 200, userId, 'User deleted successfully!');
  }
}

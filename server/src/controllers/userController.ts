import { Response, Request } from 'express';
import { UserService } from '../services/userService';
import { successApiResponse, errorApiResponse } from '../utils/apiResponse';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getAllUser(_: Request, res: Response): Promise<void> {
    try {
      const results = await this.userService.getAllUser();

      if (!results.rowCount) {
        return errorApiResponse(res, 404, 'User not found!');
      }

      return successApiResponse(
        res,
        200,
        results.rows,
        'Users retrieved successfully!',
      );
    } catch (err) {
      return errorApiResponse(res, 500, err);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.id;

      const results = await this.userService.getUserById(userId);

      if (!results.rowCount) {
        return errorApiResponse(res, 404, 'User not found!');
      }

      return successApiResponse(
        res,
        200,
        results.rows[0],
        'User fetched successfully!',
      );
    } catch (err) {
      return errorApiResponse(res, 500, err);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.id;

      const results = await this.userService.deleteUser(userId);

      if (results.rowCount) {
        return errorApiResponse(res, 404, 'User not found!');
      }

      return successApiResponse(res, 200, userId, 'User deleted successfully!');
    } catch (err) {
      return errorApiResponse(res, 500, err);
    }
  }
}

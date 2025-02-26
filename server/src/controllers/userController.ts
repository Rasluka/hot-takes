import { Response, Request } from 'express';
import { UserService } from '../services/userService';
import { successApiResponse, errorApiResponse } from '../utils/apiResponse';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getAllUser(req: Request, res: Response): Promise<void> {
    try {
      const results = await this.userService.getAllUser();

      if (results.rowCount === 0) {
        errorApiResponse(res, 404, 'User not found!');
      }

      successApiResponse(
        res,
        200,
        results.rows,
        'Users retrieved successfully!',
      );
    } catch (err) {
      errorApiResponse(res, 500, err);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.id;

      const results = await this.userService.getUserById(userId);

      if (results.rows.length > 0) {
        successApiResponse(
          res,
          200,
          results.rows[0],
          'User fetched successfully!',
        );
      } else {
        errorApiResponse(res, 404, 'User not found!');
      }
    } catch (err) {
      errorApiResponse(res, 500, err);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.id;

      const results = await this.userService.deleteUser(userId);

      if (results.rowCount) {
        successApiResponse(res, 200, userId, 'User deleted successfully!');
      } else {
        errorApiResponse(res, 404, 'User not found!');
      }
    } catch (err) {
      errorApiResponse(res, 500, err);
    }
  }
}

import { Response, Request } from 'express';
import { UserService } from '../services/user.service';
import { successApiResponse } from '../utils/api-response.util';
import { BadRequest } from '../errors/bad-request.error';
import { UserDto } from '../types/user';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const results = await this.userService.getAll();

    return successApiResponse(
      res,
      200,
      results,
      'Users retrieved successfully!',
    );
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.id);

    if (isNaN(userId)) throw new BadRequest('Invalid ID');

    const result = await this.userService.getById(userId);

    return successApiResponse(res, 200, result, 'User fetched successfully!');
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const userData: UserDto = req.body;

    if (!userData.roleId) throw new BadRequest('Role Id was not provided.');

    const result = await this.userService.create(userData);

    return successApiResponse(res, 201, result, 'User created succesfully!');
  };

  updateUserRole = async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.id);
    const { roleId = NaN } = req.body;

    if (isNaN(roleId) || isNaN(userId)) throw new BadRequest('Invalid ID.');

    const result = await this.userService.updateUserRole(userId, roleId);
    return successApiResponse(
      res,
      200,
      result,
      'User role updated successfully!',
    );
  };

  deleteById = async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.id);

    if (isNaN(userId)) throw new BadRequest('Invalid ID.');

    const result = await this.userService.deleteById(userId);
    return successApiResponse(res, 200, result, 'User deleted successfully!');
  };
}

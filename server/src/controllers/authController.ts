import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { successApiResponse } from '../utils/apiResponse';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { nickname, email, roleId } = req.body;
    const actualRoleId = roleId ? parseInt(roleId) : 1;

    if (!email || !nickname) {
      return next(new Error('Email and nickname are required.'));
    }

    const results = await this.authService.signUp(
      nickname,
      email,
      actualRoleId,
    );

    successApiResponse(res, 201, results, 'User created succesfully!');
  }
}

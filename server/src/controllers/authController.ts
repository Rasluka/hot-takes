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

    const lowerNickname = nickname.toLowerCase();

    const results = await this.authService.signUp(
      lowerNickname,
      email,
      actualRoleId,
    );

    return successApiResponse(res, 201, results, 'User created succesfully!');
  }

  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { nickname, code } = req.body;

    if (!nickname || !code || code.length < 8) {
      return next(new Error('Invalid credentials.'));
    }

    const lowerNickname = nickname.toLowerCase();

    const results = await this.authService.signIn(lowerNickname, code);

    return successApiResponse(res, 200, results, 'Sign In succesfully');
  }

  async regenerateCode(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId = req.params.userId;

    if (!userId) {
      return next(new Error('Invalid user id.'));
    }

    const results = await this.authService.regenerateCode(userId);

    return successApiResponse(
      res,
      200,
      results,
      'Code regenerated successfully!',
    );
  }
}

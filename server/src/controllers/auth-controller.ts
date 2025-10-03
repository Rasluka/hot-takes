import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth-service';
import { successApiResponse } from '../utils/api-response';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { nickname, email } = req.body;

    if (!email || !nickname) {
      return next(new Error('Email and nickname are required.'));
    }

    const lowerNickname = nickname.toLowerCase();

    const results = await this.authService.signUp(lowerNickname, email);

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
}

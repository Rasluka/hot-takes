import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth-service';
import { successApiResponse } from '../utils/api-response';
import { AuthenticatedRequest } from '../models/auth-request';
import { BadRequest } from '../errors/bad-request';

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
      return next(new BadRequest('Invalid credentials.'));
    }

    const normalizedNickname = nickname.toLowerCase();

    const { user, token } = await this.authService.signIn(
      normalizedNickname,
      code,
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60 * 60 * 1000, // 5 hours
      path: '/',
    });

    return successApiResponse(res, 200, { user }, 'Signed in successfully');
  }

  async getCurrentUser(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { user } = req;

    if (!user) {
      return next(new BadRequest('Token is missing!'));
    }

    const result = await this.authService.getCurrentUser(user.userId);

    return successApiResponse(res, 200, result, 'User found!');
  }
}

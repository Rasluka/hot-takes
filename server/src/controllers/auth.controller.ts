import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { successApiResponse } from '../utils/api-response.util';
import { AuthenticatedRequest } from '../types/auth-request';
import { BadRequest } from '../errors/bad-request.error';
import {
  UserCreateDto,
  UserCreateResponseDto,
} from '../dto/user/user-create.dto';
import { SignInDto } from '../dto/auth/sign-in.dto';
import { UnauthorizedError } from '../errors/unauthorized.error';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  signUp = async (req: Request, res: Response): Promise<void> => {
    const userData: UserCreateDto = req.body;

    if (!userData.email || !userData.nickname) {
      throw new BadRequest('Email and nickname are required.');
    }

    const results: UserCreateResponseDto =
      await this.authService.signUp(userData);

    return successApiResponse(res, 201, results, 'User created succesfully!');
  };

  signIn = async (req: Request, res: Response): Promise<void> => {
    const userData: SignInDto = req.body;

    if (!userData.nickname || !userData.code || userData.code.length !== 8) {
      throw new BadRequest('Invalid credentials.');
    }

    const { user, token } = await this.authService.signIn(userData);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60 * 60 * 1000, // 5 hours
      path: '/',
    });

    return successApiResponse(res, 200, user, 'Signed in successfully');
  };

  getCurrentUser = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    const { user } = req;

    if (!user) throw new UnauthorizedError('Authentication required');

    const result = await this.authService.getCurrentUser(user.userId);

    return successApiResponse(res, 200, result, 'User found!');
  };

  logout = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return successApiResponse(res, 200, null, 'Logged out successfully!');
  };
}

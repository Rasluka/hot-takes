import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { successApiResponse, errorApiResponse } from '../utils/apiResponse';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async signUp(req: Request, res: Response): Promise<void> {
    const { nickname, email, roleId } = req.body;
    const actualRoleId = roleId ? parseInt(roleId) : 1;

    if (!email || !nickname) {
      errorApiResponse(res, 400, 'Email and nickname are required.');
    }

    try {
      const results = await this.authService.signUp(
        nickname,
        email,
        actualRoleId,
      );

      return successApiResponse(res, 201, results, 'User created succesfully!');
    } catch (err) {
      return errorApiResponse(res, 500, err);

      // if (err instanceof Error && "code" in err) {
      //   if (err.code === "23505") {
      //     // Unique violation error code
      //     res
      //       .status(400)
      //       .json({ error: "Email, nickname, or code already in use" });
      //   } else {
      //     res
      //       .status(500)
      //       .json({ message: "Internal server error", actualError: err });
      //   }
      // } else {
      //   res
      //     .status(500)
      //     .json({ message: "An unknown error occurred", error: err });
      // }
    }
  }
}

import bcrypt from 'bcrypt';
import { createUserInDb } from './user.creation';
import {
  UserCreateDto,
  UserCreateResponseDto,
} from '../dto/user/user-create.dto';
import { SignInDto, SignInResponseDto } from '../dto/auth/sign-in.dto';
import { UserResponseDto } from '../dto/user/user-response.dto';
import { sendCodeEmail } from './email.service';
import { PrismaClient } from '@prisma/client';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { NotFoundError } from '../errors/not-found.error';
import { mapToUserResponseDto } from '../utils/format-user.util';
import { generateJwtToken } from '../utils/generate-token.util';

export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async signUp(userData: UserCreateDto): Promise<UserCreateResponseDto> {
    const signUpResult: UserCreateResponseDto = await createUserInDb(
      this.prisma,
      userData,
      2, // RoleId is assigned 2 for 'normal users'
    );
    let emailSent = true;

    try {
      await sendCodeEmail(userData.email, userData.nickname, signUpResult.code);
    } catch {
      emailSent = false;
    }

    return { ...signUpResult, emailSent };
  }

  async signIn(userData: SignInDto): Promise<SignInResponseDto> {
    const normalizedNickname = userData.nickname.trim().toLowerCase();
    const normalizedCode = userData.code.trim();

    const user = await this.prisma.user.findUnique({
      where: { nickname: normalizedNickname },
      include: { role: true },
    });

    if (!user) throw new UnauthorizedError('Invalid credentials.');

    const isValidCode = await bcrypt.compare(normalizedCode, user.hashedCode);

    if (!isValidCode) throw new UnauthorizedError('Invalid credentials.');

    if (user.role.name !== 'User' && user.role.name !== 'Admin') {
      throw new UnauthorizedError('Invalid user role.');
    }

    const token = generateJwtToken(user.id, user.role.name);

    return { user: mapToUserResponseDto(user), token };
  }

  async getCurrentUser(userId: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) throw new NotFoundError('No user found!');

    return mapToUserResponseDto(user);
  }
}

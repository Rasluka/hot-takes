import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/interfaces';
import { ConflictError } from '../errors/conflict-error';
import prisma from '../prisma';
import { formatUser } from '../utils/format-user';

interface SignUpResult {
  user: IUser;
  code: string;
}

interface SignInResult {
  user: IUser;
  token: string;
}

export class AuthService {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async signUp(
    nickname: string,
    email: string,
    roleId = 2,
  ): Promise<SignUpResult> {
    const { newCode, hashedCode } = await this.generateCode();

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedNickname = nickname.trim().toLowerCase();

    try {
      const user = await prisma.users.create({
        data: {
          email: normalizedEmail,
          nickname: normalizedNickname,
          hashed_code: hashedCode,
          role_id: roleId,
        },
        include: {
          user_roles: true,
        },
      });

      const formattedUser: IUser = formatUser(user);

      return { user: formattedUser, code: newCode };
    } catch (err: any) {
      if (err.code === 'P2002') {
        // Prisma unique constraint error
        if (err.meta?.target?.includes('nickname')) {
          throw new ConflictError('Nickname already in use.');
        } else if (err.meta?.target?.includes('email')) {
          throw new ConflictError('Email already in use.');
        }
      }
      throw err;
    }
  }

  async signIn(nickname: string, code: string): Promise<SignInResult> {
    const user = await prisma.users.findUnique({
      where: { nickname },
      include: { user_roles: true },
    });

    // Nickname doesnt exist
    if (!user) {
      throw new Error('Invalid credentials.');
    }

    const isValidCode = await bcrypt.compare(code, user.hashed_code);

    if (!isValidCode) {
      throw new Error('Invalid credentials.');
    }

    const formattedUser: IUser = formatUser(user);

    const token = jwt.sign(
      { userId: formattedUser.id, role: formattedUser.role },
      this.secretKey,
      {
        expiresIn: '5h',
      },
    );

    delete formattedUser.hashed_code;

    return { user: formattedUser, token };
  }

  private async generateCode(): Promise<{
    newCode: string;
    hashedCode: string;
  }> {
    // Generating and Hashing the new code
    const newCode = nanoid(8).toUpperCase();
    const saltRounds = 10;
    const hashedCode = await bcrypt.hash(newCode, saltRounds);

    return { newCode, hashedCode };
  }
}

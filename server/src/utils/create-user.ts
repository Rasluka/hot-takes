import prisma from '../prisma';
import { formatUser } from './format-user';
import { generateCode } from './generate-code';
import { ISignUpResult, IUser } from '../models/interfaces';
import { ConflictError } from '../errors/conflict-error';

export async function createUser(
  nickname: string,
  email: string,
  roleId: number,
): Promise<ISignUpResult> {
  const { newCode, hashedCode } = await generateCode();
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
      // Prisma unique constraint error (P2002)
      if (err.meta?.target?.includes('nickname')) {
        throw new ConflictError('Nickname already in use.');
      } else if (err.meta?.target?.includes('email')) {
        throw new ConflictError('Email already in use.');
      }
    }
    throw err;
  }
}

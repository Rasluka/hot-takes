import { generateCode } from '../utils/generate-code.util';
import { PrismaClient } from '@prisma/client';
import { UserDto, UserCreationResult } from '../types/user';
import { ConflictError } from '../errors/conflict.error';
import { formatUser } from '../utils/format-user.util';

export async function createUserInDb(
  prisma: PrismaClient,
  userData: UserDto,
): Promise<UserCreationResult> {
  const normalizedData: UserDto = normalizeUserDto(userData);
  const { newCode, hashedCode } = await generateCode();

  try {
    const user = await prisma.user.create({
      data: {
        ...normalizedData,
        hashedCode: hashedCode,
        roleId: normalizedData.roleId || 2,
      },
      include: {
        role: true,
      },
    });

    return { user: formatUser(user), code: newCode };
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

const normalizeUserDto = (userDto: UserDto): UserDto => {
  return {
    ...userDto,
    nickname: userDto.nickname.trim().toLowerCase(),
    email: userDto.email.trim().toLowerCase(),
  };
};

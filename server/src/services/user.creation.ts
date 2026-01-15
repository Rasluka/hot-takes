import { generateCode } from '../utils/generate-code.util';
import { PrismaClient } from '@prisma/client';
import { ConflictError } from '../errors/conflict.error';
import { mapToUserResponseDto } from '../utils/format-user.util';
import {
  UserCreateDto,
  UserCreateResponseDto,
} from '../dto/user/user-create.dto';

export async function createUserInDb(
  prisma: PrismaClient,
  userData: UserCreateDto,
  roleId?: number,
): Promise<UserCreateResponseDto> {
  const normalizedData: UserCreateDto = normalizeUserDto(userData);
  const { newCode, hashedCode } = await generateCode();

  try {
    const user = await prisma.user.create({
      data: {
        ...normalizedData,
        hashedCode: hashedCode,
        roleId: roleId || 2,
      },
      include: {
        role: true,
      },
    });

    return { user: mapToUserResponseDto(user), code: newCode };
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

const normalizeUserDto = (userDto: UserCreateDto): UserCreateDto => {
  return {
    ...userDto,
    nickname: userDto.nickname.trim().toLowerCase(),
    email: userDto.email.trim().toLowerCase(),
  };
};

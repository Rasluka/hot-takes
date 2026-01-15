import { createUserInDb } from './user.creation';
import { sendCodeEmail } from './email.service';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../errors/not-found.error';
import { mapToUserResponseDto } from '../utils/format-user.util';
import { UserResponseDto } from '../dto/user/user-response.dto';
import {
  UserCreateDto,
  UserCreateResponseDto,
} from '../dto/user/user-create.dto';

export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      include: { role: true },
      orderBy: { id: 'asc' },
    });

    if (users.length === 0) throw new NotFoundError('No users found!');

    return users.map(mapToUserResponseDto);
  }

  async getById(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      include: { role: true },
      where: { id },
    });

    if (!user) throw new NotFoundError('User not found!');

    return mapToUserResponseDto(user);
  }

  async create(userData: UserCreateDto): Promise<UserCreateResponseDto> {
    const signUpRes = await createUserInDb(
      this.prisma,
      userData,
      userData.roleId || 2,
    );
    let emailSent = true;

    try {
      await sendCodeEmail(userData.email, userData.nickname, signUpRes.code);
    } catch {
      emailSent = false;
    }

    return { ...signUpRes, emailSent };
  }

  async updateUserRole(id: number, roleId: number): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { roleId },
        include: { role: true },
      });

      return mapToUserResponseDto(user);
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFoundError('User not found!');
      throw err;
    }
  }

  async deleteById(id: number): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
        include: { role: true },
      });

      return mapToUserResponseDto(user);
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFoundError('User not found!');
      throw err;
    }
  }
}

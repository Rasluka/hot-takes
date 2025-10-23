import { createUserInDb } from './user.creation';
import { sendCodeEmail } from './email.service';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../errors/not-found.error';
import { User, UserDto, UserCreationResult } from '../types/user';
import { formatUser } from '../utils/format-user.util';

export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: { role: true },
      orderBy: { id: 'asc' },
    });

    if (users.length === 0) throw new NotFoundError('No users found!');

    return users.map(formatUser);
  }

  async getById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      include: { role: true },
      where: { id },
    });

    if (!user) throw new NotFoundError('User not found!');

    return formatUser(user);
  }

  async create(userData: UserDto): Promise<UserCreationResult> {
    const signUpRes: UserCreationResult = await createUserInDb(
      this.prisma,
      userData,
    );
    let emailSent = true;

    try {
      await sendCodeEmail(userData.email, userData.nickname, signUpRes.code);
    } catch (err) {
      emailSent = false;
    }

    return { ...signUpRes, emailSent };
  }

  async updateUserRole(id: number, roleId: number): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { roleId },
        include: { role: true },
      });

      return formatUser(user);
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFoundError('User not found!');
      throw err;
    }
  }

  async deleteById(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
        include: { role: true },
      });

      return formatUser(user);
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFoundError('User not found!');
      throw err;
    }
  }
}
